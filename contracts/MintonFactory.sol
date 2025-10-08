// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./MintonPair.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintonFactory is Ownable {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);
    
    constructor() Ownable(msg.sender) {}
    
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "MintonFactory: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "MintonFactory: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "MintonFactory: PAIR_EXISTS");
        
        MintonPair newPair = new MintonPair();
        newPair.initialize(token0, token1);
        pair = address(newPair);
        
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
    
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
}