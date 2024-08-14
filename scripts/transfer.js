require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('fs');
require("dotenv").config();
const { parseEther } = require('ethers/lib/utils');

const NotaryABI = require("../artifacts/contracts/NFT.sol/NFT.json");

const {NODE_URL_SEPOLIA, NODE_URL_AMOY, SEPOLIA_PRIVATE_KEY, AMOY_PRIVATE_KEY} = process.env;

const sepoliaProvider = new ethers.providers.JsonRpcProvider(NODE_URL_SEPOLIA);
const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const sepoliaWallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, sepoliaProvider);
const amoyWallet = new ethers.Wallet(AMOY_PRIVATE_KEY, amoyProvider);

const NFTAddressSepolia = "0x5AAd1957A2E047752cad49cbF4BB14f79Cb9B33E";
const NFTAddressAmoy = "0x5fE7cECc95dCa0D125b2B354f55efB1502610349";

const NotaryContractSepolia = new ethers.Contract(NFTAddressSepolia, NotaryABI.abi, sepoliaWallet);
const NotaryContractAmoy = new ethers.Contract(NFTAddressAmoy, NotaryABI.abi, amoyWallet);

// console.log("sepolia", NODE_URL_SEPOLIA);   
// console.log("amoy", NODE_URL_AMOY);
// console.log("sepolia", sepoliaWallet.address);
// console.log("amoy", AMOY_PRIVATE_KEY);

async function mint(){
    const sepoliaMint = await NotaryContractAmoy.connect(amoyWallet).mint(amoyWallet.address, { gasLimit: 1000000 });
    await sepoliaMint.wait();
    console.log("Minted NFT Sepolia");
    balanceMint = await NotaryContractAmoy.balanceOf("amoyWallet.address");
    console.log("BalanceOf add Sepolia: ", balanceMint.toString());

    const approve = await NotaryContractAmoy.connect(amoyWallet).approve(NFTAddressAmoy, 1);
    await approve.wait();

    const transfer = await NotaryContractAmoy.connect(amoyWallet).transferInter(1, "0xf7e451fB0038eBafcFd28ee2f887A3803C83A7de", { gasLimit: 1000000 });
    await transfer.wait();

    const balace = await NotaryContractAmoy.balanceOf("0x5fE7cECc95dCa0D125b2B354f55efB1502610349");
    console.log("BalanceOf contract: ", balace.toString());

    const amoyMint = await NotaryContractSepolia.mint("0xf7e451fB0038eBafcFd28ee2f887A3803C83A7de", { gasLimit: 1000000 });
    await amoyMint.wait();

    const balaceAmoy = await NotaryContractSepolia.balanceOf("0xf7e451fB0038eBafcFd28ee2f887A3803C83A7de");
    console.log("BalanceOf addres amoy: ", balaceAmoy.toString());
}

mint()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });