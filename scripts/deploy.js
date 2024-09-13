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

/*
//____________AMOY NETWORK____________
Token address:  0x2bF0b16a00c35DAf50e824AB5fDCD53f192ee791
Deployed by:  0xbc8Cd664252FF99052cFCF0AdC1cA3603Af45AD0
Token Deployment Time:  10302 ms

Notary address:  0x5f4351252D27582687D66aDffa27746679294d30
Deployed by:  0xbc8Cd664252FF99052cFCF0AdC1cA3603Af45AD0
Notary Deployment Time:  7349 ms


//____________ARBITRUM NETWORK____________
Token address:  0xE0c46dB5F4909d850c3474755a25Cc27D03a374b
Deployed by:  0x9A30D453697a55d810A51425137A9F0Bb0f63F76
Token Deployment Time:  5104 ms

Notary address:  0xBcf88E6bB7ec9Af6da6A071DD172D1a942f7c2ac
Deployed by:  0x9A30D453697a55d810A51425137A9F0Bb0f63F76
Notary Deployment Time:  2868 ms
*/