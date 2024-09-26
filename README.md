# MyDEX - A Decentralized Exchange (DEX)
  MyDEX is a decentralized exchange (DEX) built on Ethereum's smart contract framework. This project simulates a Uniswap-like DEX that allows users to add liquidity, swap tokens, and remove liquidity using ERC20 
  tokens.The project includes smart contracts for a token factory, token pairs (liquidity pools), and the DEX. Additionally, it provides deployment scripts and test cases using Hardhat for local blockchain 
  simulation and testing.

## Table of Contents
  - Overview
  - Features
  - Smart Contracts
  - Installation
  - Testing
  - Deployment
  - License

## Overview
  The MyDEX system allows users to:

1. Add liquidity to pools for ERC20 token pairs.
2. Swap between tokens using a pricing algorithm based on pool reserves.
3. Remove liquidity from the pool and receive the proportional amount of the two tokens.

  The DEX is implemented using Solidity smart contracts, which are deployed on the Ethereum blockchain. The deployment scripts and test cases are written using Hardhat.

## Features
  - **Liquidity Addition**: Users can provide liquidity for a token pair, receiving liquidity tokens in return. These liquidity tokens represent their share in the pool.
  - **Token Swapping**: Users can swap one token for another in the token pair. The swap price is determined by the token reserves in the liquidity pool.
  - **Liquidity Removal**: Users can burn their liquidity tokens to retrieve their share of the token reserves from the pool.
  - **Custom ERC20 Tokens**: Mock ERC20 tokens are provided to simulate real-world tokens.

## Smart Contracts
  The project is comprised of the following key smart contracts:

1. **MyDEX**: The main DEX contract that allows users to add liquidity, swap tokens, and remove liquidity.
2. **MyTokenFactory**: A factory contract responsible for creating and managing token pairs.
3. **MyTokenPair**: A contract representing a liquidity pool for a token pair. It holds reserves for both tokens and allows minting/burning of liquidity tokens.
4. **ERC20Mock**: A simple mock ERC20 token for testing purposes.

## Contract Details
1. ``MyDEX.sol``: Implements functions for adding liquidity, swapping tokens, and removing liquidity.
2. ``MyTokenFactory.sol``: Manages creation and retrieval of token pairs.
3. ``MyTokenPair.sol``: Manages the liquidity pool, including minting and burning liquidity tokens.
4. ``ERC20Mock.sol``: Implements a mock ERC20 token used in tests and deployments.

## Installation
### Prerequisites
  Ensure that you have the following installed:
  - Node.js
  - Hardhat
  - Git

### Step 1: Clone the Repository
   ```
     git clone https://github.com/rajat-bakale/DEX_Uniswap.git
  ```
### Step 2: Install Dependencies
  ```
       npm install
  ```

### Step 3: Compile the Smart Contracts
   ```
      npx hardhat compile
  ```

## Testing
  The project includes unit tests for the core functionality of the DEX. Tests cover the following features:

  1. Adding liquidity.
  2. Swapping tokens.
  3. Removing liquidity.

  To run the tests:
   ```
      npx hardhat test
   ```

### Test Case Breakdown
  - addLiquidity: Tests that liquidity is added correctly by verifying token reserves.
  - swapTokens: Tests that token swaps happen at the correct rates based on pool reserves.
  - removeLiquidity: Tests that liquidity can be removed and the tokens returned proportionally.

## Deployment
### Step 1: Network Configuration
  To deploy on a test network (e.g.Polygon), configure the network in `hardhat.config.js`
   
  ```
       module.exports = {
       networks: {
       polygon: {
       url: `https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
       accounts: [`0x${YOUR_PRIVATE_KEY}`],
        },
      },
      solidity: "0.8.19",
      };
  ```

### Step 2: Deploy the Contracts
   Run the following command to deploy the contracts on your selected network:
   ```
      npx hardhat run scripts/deploy.js --network polygon
   ```
## License
   This project is licensed under the MIT License - see the LICENSE file for details.

  Feel free to contribute to the project by submitting issues, feature requests, and pull requests on GitHub!

**Author** :-
Rajat Bakale







