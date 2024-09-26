const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyDEX", function () {
    let dex;
    let factory;
    let tokenA;
    let tokenB;
    let owner;
    let user;

    before(async () => {
        [owner, user] = await ethers.getSigners();

        // Deploy Mock ERC20 Tokens
        const Token = await ethers.getContractFactory("ERC20Mock");
        tokenA = await Token.deploy("Token A", "TKA", ethers.utils.parseEther("10000"));
        tokenB = await Token.deploy("Token B", "TKB", ethers.utils.parseEther("10000"));

        // Deploy MyTokenFactory
        factory = await (await ethers.getContractFactory("MyTokenFactory")).deploy();
        await factory.deployed();

        // Deploy MyDEX
        dex = await (await ethers.getContractFactory("MyDEX")).deploy(factory.address);
        await dex.deployed();

        // Create a pair
        await factory.createPair(tokenA.address, tokenB.address);

        // Transfer some tokens to the user for testing
        await tokenA.transfer(user.address, ethers.utils.parseEther("10"));
        await tokenB.transfer(user.address, ethers.utils.parseEther("10"));
    });

    it("should add liquidity correctly", async function () {
        await tokenA.approve(dex.address, ethers.utils.parseEther("100"));
        await tokenB.approve(dex.address, ethers.utils.parseEther("100"));

        await dex.addLiquidity(tokenA.address, tokenB.address, ethers.utils.parseEther("100"), ethers.utils.parseEther("100"));

        const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
        const pair = await ethers.getContractAt("MyTokenPair", pairAddress);
        const reserves = await pair.getReserves();

        expect(reserves[0]).to.equal(ethers.utils.parseEther("100")); // Token A reserve
        expect(reserves[1]).to.equal(ethers.utils.parseEther("100")); // Token B reserve
    });

    it("should swap tokens correctly", async function () {
        // Add liquidity first
        await tokenA.approve(dex.address, ethers.utils.parseEther("100"));
        await tokenB.approve(dex.address, ethers.utils.parseEther("100"));
        await dex.addLiquidity(tokenA.address, tokenB.address, ethers.utils.parseEther("100"), ethers.utils.parseEther("100"));

        // Now perform the swap
        await tokenA.connect(user).approve(dex.address, ethers.utils.parseEther("10"));
        await dex.connect(user).swapTokens(tokenA.address, tokenB.address, ethers.utils.parseEther("10"));

        const userTokenBBalance = await tokenB.balanceOf(user.address);
        expect(userTokenBBalance).to.be.gt(0);
    });

    it("should remove liquidity correctly", async function () {
        const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
        const pair = await ethers.getContractAt("MyTokenPair", pairAddress);
    
        // Add liquidity to ensure there are liquidity tokens
        const addAmount = ethers.utils.parseEther("100");
        await tokenA.approve(dex.address, addAmount);
        await tokenB.approve(dex.address, addAmount);
        await dex.addLiquidity(tokenA.address, tokenB.address, addAmount, addAmount);
    
        // Get liquidity token balance for the owner
        const liquidity = await pair.balanceOf(owner.address);
        expect(liquidity).to.be.gt(0); // Ensure the owner has liquidity tokens
    
        // Check liquidity token balance before removing
        console.log("Liquidity tokens before remove:", liquidity.toString());
    
        // Get token balances before removing liquidity
        const tokenABalanceBefore = await tokenA.balanceOf(owner.address);
        const tokenBBalanceBefore = await tokenB.balanceOf(owner.address);
    
        // Approve and remove liquidity
        await pair.connect(owner).approve(dex.address, liquidity);
        await dex.connect(owner).removeLiquidity(tokenA.address, tokenB.address, liquidity);
    
        // Check balances after removing liquidity
        const tokenABalanceAfter = await tokenA.balanceOf(owner.address);
        const tokenBBalanceAfter = await tokenB.balanceOf(owner.address);
    
        // Ensure the owner received tokens after removing liquidity
        expect(tokenABalanceAfter).to.be.gt(tokenABalanceBefore);
        expect(tokenBBalanceAfter).to.be.gt(tokenBBalanceBefore);
    
        // Ensure liquidity tokens were burned
        const remainingLiquidity = await pair.balanceOf(owner.address);
        expect(remainingLiquidity).to.equal(0); // Liquidity tokens should be fully burned
    });
});