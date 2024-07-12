// const { expect } = require("chai");

describe("mint", ()=> {
    let Token, token, addr;
    beforeEach(async ()=>{
        Token = await ethers.getContractFactory("NFT");
        token = await Token.deploy("TEST", "TST");
        await token.deployed();
    });
    
    it("should mint a token", async ()=>{
        const addr = await ethers.getSigners();
        console.log("balance before mint: ", await token.balanceOf(addr[0].address));
        await token.mint(addr[0].address);
        console.log("balance after mint: ", await token.balanceOf(addr[0].address));
    });

    it("should package a token", async ()=>{
        const addr = await ethers.getSigners();
        await token.mint(addr[0].address);
        console.log("Before packing: ", await token.isPacked(1));
        await token.packToken(1);
        console.log("After packing: ", await token.isPacked(1));
        console.log("\nUnpack:")
        await token.unpackToken(1);
        console.log("After unpacking: ", await token.isPacked(1));
    });

    // it("Should't allow transfer of a wrapped NFT", async ()=>{
    //     const addr = await ethers.getSigners();
    //     await token.mint(addr[0].address);
    //     await token.packToken(1);
    //     await expect(token.transferFrom(addr[0].address, addr[1].address, 1)).to.be.revertedWith("NFT: Packed tokens cannot be transferred");

    //     await token.unpackToken(1);

    //     await expect(token.transferFrom(addr[0].address, addr[1].address, 1)).to.not.be.reverted;
    // });
});