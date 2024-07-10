require("@nomiclabs/hardhat-ethers");

async function main() {
    const Token = await ethers.getContractFactory("NFT");
    const token = await Token.deploy("Token", "TK");
    console.log("Token address: ", token.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });