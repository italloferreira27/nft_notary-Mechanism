const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const tokenStartTime = Date.now();
    const Token = await hre.ethers.getContractFactory("NFT");
    const token = await Token.deploy();
    const tokenReceipt = await token.deployTransaction.wait();
    const gasUsedToken = tokenReceipt.gasUsed;
    const tokenEndTime = Date.now();
    console.log("Token address: ", token.address);
    console.log("Deployed by: ", token.deployTransaction.from);
    console.log("Gas Used: ", gasUsedToken.toString());
    console.log("Token Deployment Time: ", (tokenEndTime - tokenStartTime), "ms");

    const notaryStartTime = Date.now();
    const Notary = await hre.ethers.getContractFactory("Notary");
    const notary = await Notary.deploy();
    const notaryReceipt = await notary.deployTransaction.wait();
    const gasUsedNotary = notaryReceipt.gasUsed;
    const notaryEndTime = Date.now();
    console.log("\nNotary address: ", notary.address);
    console.log("Deployed by: ", notary.deployTransaction.from);
    console.log("Gas Used: ", gasUsedNotary.toString());
    console.log("Notary Deployment Time: ", (notaryEndTime - notaryStartTime), "ms");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });