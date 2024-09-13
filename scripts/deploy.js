const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const tokenStartTime = Date.now();
    const Token = await hre.ethers.getContractFactory("NFT");
    const token = await Token.deploy();
    await token.deployed();
    const tokenEndTime = Date.now();
    console.log("Token address: ", token.address);
    console.log("Deployed by: ", token.deployTransaction.from);
    console.log("Token Deployment Time: ", (tokenEndTime - tokenStartTime), "ms");

    const notaryStartTime = Date.now();
    const Notary = await hre.ethers.getContractFactory("Notary");
    const notary = await Notary.deploy();
    await notary.deployed();
    const notaryEndTime = Date.now();
    console.log("\nNotary address: ", notary.address);
    console.log("Deployed by: ", notary.deployTransaction.from);
    console.log("Notary Deployment Time: ", (notaryEndTime - notaryStartTime), "ms");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });