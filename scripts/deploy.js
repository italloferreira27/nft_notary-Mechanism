const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const Token = await hre.ethers.getContractFactory("NFT");
    const token = await Token.deploy("Token", "TK");
    await token.deployed();
    console.log("Token address: ", token.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });