// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MintonRouter
 * @notice Router contract for MintonDex swaps and liquidity management on Shardeum Mainnet
 * @dev Based on battle-tested Uniswap V2 Router (audited by Trail of Bits)
 * 
 * SECURITY NOTES:
 * - This is a Uniswap V2 fork - core logic audited with billions in TVL
 * - Uses Solidity 0.8.20+ built-in overflow protection (no SafeMath needed)
 * - Includes deadline checks to prevent stale transactions
 * - Not formally audited - use at your own risk
 * 
 * FEE STRUCTURE:
 * - 0.3% trading fee on all swaps
 * - 0.25% goes to liquidity providers
 * - 0.05% goes to protocol (if feeTo is set in factory)
 */

interface IFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IPair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint);
    function transfer(address to, uint amount) external returns (bool);
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
}

interface IWSHM {
    function deposit() external payable;
    function withdraw(uint) external;
    function balanceOf(address account) external view returns (uint);
    function transfer(address to, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
}

contract MintonRouter {
    address public immutable factory;
    address public immutable WSHM;
    
    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "MintonRouter: EXPIRED");
        _;
    }
    
    constructor(address _factory, address _WSHM) {
        factory = _factory;
        WSHM = _WSHM;
    }
    
    receive() external payable {
        assert(msg.sender == WSHM);
    }
    
    // ========== TOKEN-TO-TOKEN SWAPS ==========
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "MintonRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        
        require(
            IERC20(path[0]).transferFrom(msg.sender, pairFor(path[0], path[1]), amounts[0]),
            "MintonRouter: TRANSFER_FROM_FAILED"
        );
        _swap(amounts, path, to);
    }
    
    // ========== NATIVE SHM SWAPS ==========
    
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable ensure(deadline) returns (uint[] memory amounts) {
        require(path[0] == WSHM, "MintonRouter: INVALID_PATH");
        amounts = getAmountsOut(msg.value, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "MintonRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        
        IWSHM(WSHM).deposit{value: amounts[0]}();
        assert(IWSHM(WSHM).transfer(pairFor(path[0], path[1]), amounts[0]));
        _swap(amounts, path, to);
    }
    
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint[] memory amounts) {
        require(path[path.length - 1] == WSHM, "MintonRouter: INVALID_PATH");
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "MintonRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        
        require(
            IERC20(path[0]).transferFrom(msg.sender, pairFor(path[0], path[1]), amounts[0]),
            "MintonRouter: TRANSFER_FROM_FAILED"
        );
        _swap(amounts, path, address(this));
        IWSHM(WSHM).withdraw(amounts[amounts.length - 1]);
        _safeTransferETH(to, amounts[amounts.length - 1]);
    }
    
    // ========== LIQUIDITY FUNCTIONS ==========
    
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = pairFor(tokenA, tokenB);
        
        require(IERC20(tokenA).transferFrom(msg.sender, pair, amountA), "MintonRouter: TRANSFER_FROM_FAILED");
        require(IERC20(tokenB).transferFrom(msg.sender, pair, amountB), "MintonRouter: TRANSFER_FROM_FAILED");
        
        liquidity = IPair(pair).mint(to);
    }
    
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {
        (amountToken, amountETH) = _addLiquidity(
            token,
            WSHM,
            amountTokenDesired,
            msg.value,
            amountTokenMin,
            amountETHMin
        );
        address pair = pairFor(token, WSHM);
        require(IERC20(token).transferFrom(msg.sender, pair, amountToken), "MintonRouter: TRANSFER_FROM_FAILED");
        IWSHM(WSHM).deposit{value: amountETH}();
        assert(IWSHM(WSHM).transfer(pair, amountETH));
        liquidity = IPair(pair).mint(to);
        
        if (msg.value > amountETH) _safeTransferETH(msg.sender, msg.value - amountETH);
    }
    
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint amountA, uint amountB) {
        address pair = pairFor(tokenA, tokenB);
        
        require(IPair(pair).transferFrom(msg.sender, pair, liquidity), "MintonRouter: TRANSFER_FROM_FAILED");
        (uint amount0, uint amount1) = IPair(pair).burn(to);
        
        (address token0,) = sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, "MintonRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "MintonRouter: INSUFFICIENT_B_AMOUNT");
    }
    
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint amountToken, uint amountETH) {
        address pair = pairFor(token, WSHM);
        
        require(IPair(pair).transferFrom(msg.sender, pair, liquidity), "MintonRouter: TRANSFER_FROM_FAILED");
        (uint amount0, uint amount1) = IPair(pair).burn(address(this));
        
        (address token0,) = sortTokens(token, WSHM);
        (amountToken, amountETH) = token == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountToken >= amountTokenMin, "MintonRouter: INSUFFICIENT_TOKEN_AMOUNT");
        require(amountETH >= amountETHMin, "MintonRouter: INSUFFICIENT_ETH_AMOUNT");
        
        require(IERC20(token).transfer(to, amountToken), "MintonRouter: TRANSFER_FAILED");
        IWSHM(WSHM).withdraw(amountETH);
        _safeTransferETH(to, amountETH);
    }
    
    // ========== INTERNAL HELPER FUNCTIONS ==========
    
    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin
    ) internal returns (uint amountA, uint amountB) {
        if (IFactory(factory).getPair(tokenA, tokenB) == address(0)) {
            IFactory(factory).createPair(tokenA, tokenB);
        }
        
        (uint reserveA, uint reserveB) = getReserves(tokenA, tokenB);
        
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint amountBOptimal = quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "MintonRouter: INSUFFICIENT_B_AMOUNT");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint amountAOptimal = quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, "MintonRouter: INSUFFICIENT_A_AMOUNT");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }
    
    function _swap(uint[] memory amounts, address[] memory path, address _to) internal {
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0,) = sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOut) : (amountOut, uint(0));
            address to = i < path.length - 2 ? pairFor(output, path[i + 2]) : _to;
            IPair(pairFor(input, output)).swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }
    
    function _safeTransferETH(address to, uint value) internal {
        (bool success,) = to.call{value: value}(new bytes(0));
        require(success, "MintonRouter: ETH_TRANSFER_FAILED");
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    function quote(uint amountA, uint reserveA, uint reserveB) public pure returns (uint amountB) {
        require(amountA > 0, "MintonRouter: INSUFFICIENT_AMOUNT");
        require(reserveA > 0 && reserveB > 0, "MintonRouter: INSUFFICIENT_LIQUIDITY");
        amountB = (amountA * reserveB) / reserveA;
    }
    
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0, "MintonRouter: INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "MintonRouter: INSUFFICIENT_LIQUIDITY");
        uint amountInWithFee = amountIn * 997; // 0.3% fee
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }
    
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) public pure returns (uint amountIn) {
        require(amountOut > 0, "MintonRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "MintonRouter: INSUFFICIENT_LIQUIDITY");
        uint numerator = reserveIn * amountOut * 1000;
        uint denominator = (reserveOut - amountOut) * 997;
        amountIn = (numerator / denominator) + 1;
    }
    
    function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts) {
        require(path.length >= 2, "MintonRouter: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(path[i], path[i + 1]);
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }
    
    function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts) {
        require(path.length >= 2, "MintonRouter: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(path[i - 1], path[i]);
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }
    
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "MintonRouter: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "MintonRouter: ZERO_ADDRESS");
    }
    
    function pairFor(address tokenA, address tokenB) internal view returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = IFactory(factory).getPair(token0, token1);
        require(pair != address(0), "MintonRouter: PAIR_DOES_NOT_EXIST");
    }
    
    function getReserves(address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IPair(pairFor(tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
