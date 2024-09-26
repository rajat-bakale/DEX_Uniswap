// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyTokenPair.sol";

contract MyTokenFactory {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "Identical addresses");
        require(getPair[tokenA][tokenB] == address(0), "Pair already exists");

        pair = address(new MyTokenPair(tokenA, tokenB));
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;

        allPairs.push(pair);
        emit PairCreated(tokenA, tokenB, pair, allPairs.length);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }
}