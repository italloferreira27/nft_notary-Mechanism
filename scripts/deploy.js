const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const Token = await hre.ethers.getContractFactory("NFT");
    const token = await Token.deploy("Token", "TK");
    await token.deployed();
    console.log("Token address: ", token.address);
    console.log("Deployed by: ", token.deployTransaction.from);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// Token address SEPOLIA:  0x102417CE79795A6993c5C9b1FaB3DDB89051D2b1
// Token address AMOY:  0x7a1A85441D9182a077aAb6E614B9494E90b47473