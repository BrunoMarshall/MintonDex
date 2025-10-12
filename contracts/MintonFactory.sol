// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IMintonPair {
    function initialize(address, address) external;
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract MintonPair is ReentrancyGuard {
    string public name = "MintonDex LP";
    string public symbol = "MINTON-LP";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public factory;
    address public token0;
    address public token1;
    
    uint256 private reserve0;
    uint256 private reserve1;
    uint256 private blockTimestampLast;
    
    uint256 private unlocked = 1;
    
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    uint256 public kLast;
    
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to);
    event Sync(uint256 reserve0, uint256 reserve1);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    modifier lock() {
        require(unlocked == 1, "MintonPair: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }
    
    constructor() {
        factory = msg.sender;
    }
    
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "MintonPair: FORBIDDEN");
        token0 = _token0;
        token1 = _token1;
    }
    
    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = uint112(reserve0);
        _reserve1 = uint112(reserve1);
        _blockTimestampLast = uint32(blockTimestampLast);
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
    
    function _approve(address owner, address spender, uint256 value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }
    
    function _transfer(address from, address to, uint256 value) private {
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }
    
    function approve(address spender, uint256 value) external returns (bool) {
        _approve(msg.sender, spender, value);
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
    
    function _update(uint256 balance0, uint256 balance1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "MintonPair: OVERFLOW");
        reserve0 = balance0;
        reserve1 = balance1;
        blockTimestampLast = block.timestamp;
        emit Sync(reserve0, reserve1);
    }
    
    function _mintFee(uint256 _reserve0, uint256 _reserve1) private returns (bool feeOn) {
        address feeTo = IMintonFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast;
        
        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK = sqrt(_reserve0 * _reserve1);
                uint256 rootKLast = sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 numerator = totalSupply * (rootK - rootKLast);
                    uint256 denominator = (rootK * 5) + rootKLast;
                    uint256 liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }
    
    function mint(address to) external lock nonReentrant returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;
        
        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;
        
        if (_totalSupply == 0) {
            liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0xdead), MINIMUM_LIQUIDITY);
        } else {
            liquidity = min((amount0 * _totalSupply) / _reserve0, (amount1 * _totalSupply) / _reserve1);
        }
        
        require(liquidity > 0, "MintonPair: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);
        
        _update(balance0, balance1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1);
        emit Mint(msg.sender, amount0, amount1);
    }
    
    function burn(address to) external lock nonReentrant returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        address _token0 = token0;
        address _token1 = token1;
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];
        
        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;
        
        amount0 = (liquidity * balance0) / _totalSupply;
        amount1 = (liquidity * balance1) / _totalSupply;
        require(amount0 > 0 && amount1 > 0, "MintonPair: INSUFFICIENT_LIQUIDITY_BURNED");
        
        _burn(address(this), liquidity);
        
        require(IERC20(_token0).transfer(to, amount0), "MintonPair: TRANSFER_FAILED");
        require(IERC20(_token1).transfer(to, amount1), "MintonPair: TRANSFER_FAILED");
        
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        
        _update(balance0, balance1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1);
        emit Burn(msg.sender, amount0, amount1, to);
    }
    
    // 1% TOTAL FEE: 0.3% to LPs + 0.7% to feeTo address
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata) external lock nonReentrant {
        require(amount0Out > 0 || amount1Out > 0, "MintonPair: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "MintonPair: INSUFFICIENT_LIQUIDITY");
        
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, "MintonPair: INVALID_TO");
        
        // Transfer tokens out
        if (amount0Out > 0) require(IERC20(_token0).transfer(to, amount0Out), "MintonPair: TRANSFER_FAILED");
        if (amount1Out > 0) require(IERC20(_token1).transfer(to, amount1Out), "MintonPair: TRANSFER_FAILED");
        
        // Calculate amounts in and apply fees
        (uint256 amount0In, uint256 amount1In) = _processSwapFees(_token0, _token1, _reserve0, _reserve1, amount0Out, amount1Out);
        
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }
    
    function _processSwapFees(
        address _token0,
        address _token1,
        uint256 _reserve0,
        uint256 _reserve1,
        uint256 amount0Out,
        uint256 amount1Out
    ) private returns (uint256 amount0In, uint256 amount1In) {
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));
        
        amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "MintonPair: INSUFFICIENT_INPUT_AMOUNT");
        
        // Take 0.7% fee and send to feeTo address
        address feeTo = IMintonFactory(factory).feeTo();
        if (feeTo != address(0)) {
            if (amount0In > 0) {
                uint256 fee0 = (amount0In * 7) / 1000;
                if (fee0 > 0) {
                    require(IERC20(_token0).transfer(feeTo, fee0), "MintonPair: FEE_TRANSFER_FAILED");
                    balance0 -= fee0;
                }
            }
            if (amount1In > 0) {
                uint256 fee1 = (amount1In * 7) / 1000;
                if (fee1 > 0) {
                    require(IERC20(_token1).transfer(feeTo, fee1), "MintonPair: FEE_TRANSFER_FAILED");
                    balance1 -= fee1;
                }
            }
        }
        
        // Validate K with 0.3% LP fee
        require(
            (balance0 * 1000 - amount0In * 3) * (balance1 * 1000 - amount1In * 3) >= 
            _reserve0 * _reserve1 * 1000000,
            "MintonPair: K"
        );
        
        _update(balance0, balance1);
    }
    
    function skim(address to) external lock nonReentrant {
        address _token0 = token0;
        address _token1 = token1;
        require(IERC20(_token0).transfer(to, IERC20(_token0).balanceOf(address(this)) - reserve0), "MintonPair: TRANSFER_FAILED");
        require(IERC20(_token1).transfer(to, IERC20(_token1).balanceOf(address(this)) - reserve1), "MintonPair: TRANSFER_FAILED");
    }
    
    function sync() external lock nonReentrant {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)));
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
    
    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }
}

interface IMintonFactory {
    function feeTo() external view returns (address);
}

contract MintonFactory is Ownable {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    
    // Fee collection address - HARDCODED as you wanted
    address public feeTo = 0xd66F8E61Af6bBDceB0e568Ee2f971c00EeD32441;
    address public feeToSetter;
    
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);
    
    constructor() Ownable(msg.sender) {
        feeToSetter = msg.sender;
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
        
        IMintonPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
    
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "MintonFactory: FORBIDDEN");
        feeTo = _feeTo;
    }
    
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "MintonFactory: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}