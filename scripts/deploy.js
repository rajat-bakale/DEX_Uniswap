const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy ERC20Mock tokens
    const TokenA = await ethers.getContractFactory("ERC20Mock");
    const tokenA = await TokenA.deploy("Token A", "TKA", ethers.utils.parseEther("1000000")); // 1 million tokens
    await tokenA.deployed();
    console.log("Token A deployed to:", tokenA.address);

    const TokenB = await ethers.getContractFactory("ERC20Mock");
    const tokenB = await TokenB.deploy("Token B", "TKB", ethers.utils.parseEther("1000000")); // 1 million tokens
    await tokenB.deployed();
    console.log("Token B deployed to:", tokenB.address);

    // Deploy MyTokenFactory
    const factory = await (await ethers.getContractFactory("MyTokenFactory")).deploy();
    await factory.deployed();
    console.log("MyTokenFactory deployed to:", factory.address);

    // Create a pair for Token A and Token B in the factory
    const tx = await factory.createPair(tokenA.address, tokenB.address);
    const receipt = await tx.wait(); // Wait for the transaction to be mined
    const pairAddress = receipt.events[0].args.pair; // Adjust based on your event structure
    console.log("Token pair created at address:", pairAddress);

    // Deploy MyDEX
    const dex = await (await ethers.getContractFactory("MyDEX")).deploy(factory.address);
    await dex.deployed();
    console.log("MyDEX deployed to:", dex.address);

    // Add liquidity to the DEX
    const amountA = ethers.utils.parseEther("10000"); // 10,000 Token A
    const amountB = ethers.utils.parseEther("10000"); // 10,000 Token B

    // Approve DEX to spend tokens
    await tokenA.approve(dex.address, amountA);
    await tokenB.approve(dex.address, amountB);

    // Add liquidity to the DEX with a higher gas limit if necessary
    const liquidityTx = await dex.addLiquidity(tokenA.address, tokenB.address, amountA, amountB, {
        gasLimit: 1000000 // Adjust gas limit as necessary
    });
    await liquidityTx.wait(); // Wait for the transaction to be mined
    console.log("Liquidity added to the DEX");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });