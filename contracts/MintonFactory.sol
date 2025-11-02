// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MintonFactory
 * @notice Factory contract for creating MintonDex trading pairs on Shardeum Mainnet
 * @dev Based on battle-tested Uniswap V2 Factory (audited by Trail of Bits)
 * 
 * SECURITY NOTES:
 * - This is a Uniswap V2 fork - core logic audited with billions in TVL
 * - Uses Solidity 0.8.20+ built-in overflow protection (SafeMath removed)
 * - Includes reentrancy protection via checks-effects-interactions pattern
 * - Not formally audited - use at your own risk
 */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MintonPair {
    string public constant name = "MintonDex LP";
    string public constant symbol = "MINTON-LP";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public factory;
    address public token0;
    address public token1;
    
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;
    
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    uint256 public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event
    
    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "MintonPair: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }
    
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to);
    event Sync(uint112 reserve0, uint112 reserve1);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        factory = msg.sender;
    }
    
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "MintonPair: FORBIDDEN");
        token0 = _token0;
        token1 = _token1;
    }
    
    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }
    
    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "MintonPair: TRANSFER_FAILED");
    }
    
    function _update(uint256 balance0, uint256 balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "MintonPair: OVERFLOW");
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }
    
    /**
     * @notice Mints protocol fee (if enabled) to feeTo address
     * @dev Called before any liquidity changes to collect 0.05% protocol fee (1/6 of 0.3% trading fee)
     * @return feeOn Whether protocol fee is enabled
     */
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IMintonFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast;
        
        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK = sqrt(uint256(_reserve0) * uint256(_reserve1));
                uint256 rootKLast = sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 numerator = totalSupply * (rootK - rootKLast);
                    uint256 denominator = (rootK * 5) + rootKLast; // 1/6 of growth goes to protocol
                    uint256 liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }
    
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;
        
        if (_totalSupply == 0) {
            liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = min((amount0 * _totalSupply) / _reserve0, (amount1 * _totalSupply) / _reserve1);
        }
        
        require(liquidity > 0, "MintonPair: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1); // reserve0 and reserve1 are up-to-date
        
        emit Mint(msg.sender, amount0, amount1);
    }
    
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        address _token0 = token0;
        address _token1 = token1;
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;
        
        amount0 = (liquidity * balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = (liquidity * balance1) / _totalSupply;
        
        require(amount0 > 0 && amount1 > 0, "MintonPair: INSUFFICIENT_LIQUIDITY_BURNED");
        
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1);
        
        emit Burn(msg.sender, amount0, amount1, to);
    }
    
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, "MintonPair: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "MintonPair: INSUFFICIENT_LIQUIDITY");

        uint256 balance0;
        uint256 balance1;
        {
            address _token0 = token0;
            address _token1 = token1;
            require(to != _token0 && to != _token1, "MintonPair: INVALID_TO");
            if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out);
            if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out);
            balance0 = IERC20(_token0).balanceOf(address(this));
            balance1 = IERC20(_token1).balanceOf(address(this));
        }
        
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "MintonPair: INSUFFICIENT_INPUT_AMOUNT");
        
        {
            // 0.3% trading fee (3/1000)
            uint256 balance0Adjusted = (balance0 * 1000) - (amount0In * 3);
            uint256 balance1Adjusted = (balance1 * 1000) - (amount1In * 3);
            require(balance0Adjusted * balance1Adjusted >= uint256(_reserve0) * uint256(_reserve1) * (1000**2), "MintonPair: K");
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }
    
    function skim(address to) external lock {
        address _token0 = token0;
        address _token1 = token1;
        _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)) - reserve0);
        _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)) - reserve1);
    }
    
    function sync() external lock {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }
    
    // ERC20 Functions
    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint256).max) {
            allowance[from][msg.sender] -= value;
        }
        _transfer(from, to, value);
        return true;
    }
    
    function _mint(address to, uint256 value) private {
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }
    
    function _burn(address from, uint256 value) private {
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Transfer(from, address(0), value);
    }
    
    function _transfer(address from, address to, uint256 value) private {
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }
    
    // Math functions (using Solidity 0.8+ built-in overflow protection)
    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }
    
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

interface IMintonFactory {
    function feeTo() external view returns (address);
}

/**
 * @title MintonFactory
 * @notice Creates and manages liquidity pairs for MintonDex
 * @dev Fee collection is managed through feeTo address (1/6 of trading fees when enabled)
 */
contract MintonFactory {
    address public feeTo;
    address public feeToSetter;
    
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);
    
    /**
     * @param _feeToSetter Address that can control fee collection (should be multisig or governance)
     */
    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }
    
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
    
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "MintonFactory: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "MintonFactory: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "MintonFactory: PAIR_EXISTS");
        
        bytes memory bytecode = type(MintonPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        
        MintonPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
    
    /**
     * @notice Enable protocol fee collection (0.05% of each trade)
     * @param _feeTo Address to receive protocol fees (use address(0) to disable)
     */
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "MintonFactory: FORBIDDEN");
        feeTo = _feeTo;
    }
    
    /**
     * @notice Transfer fee control to new address (e.g., to multisig or governance)
     * @param _feeToSetter New address that can control fees
     */
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "MintonFactory: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
