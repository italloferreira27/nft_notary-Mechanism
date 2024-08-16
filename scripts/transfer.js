require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('fs');
require("dotenv").config();
const { parseEther } = require('ethers/lib/utils');

const NotaryABI = require("../artifacts/contracts/NFT.sol/NFT.json");

const {NODE_URL_SEPOLIA, NODE_URL_AMOY, SEPOLIA_PRIVATE_KEY01, SEPOLIA_PRIVATE_KEY02, AMOY_PRIVATE_KEY} = process.env;

const sepoliaProvider = new ethers.providers.JsonRpcProvider(NODE_URL_SEPOLIA);
const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const sepoliaWallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY01, sepoliaProvider);
const amoyWallet = new ethers.Wallet(AMOY_PRIVATE_KEY, amoyProvider);

const sepoliaWallet02 = new ethers.Wallet(SEPOLIA_PRIVATE_KEY02, sepoliaProvider);

// const NFTAddressSepolia = "0x5AAd1957A2E047752cad49cbF4BB14f79Cb9B33E";
// const NFTAddressAmoy = "0x5fE7cECc95dCa0D125b2B354f55efB1502610349";

const NFTAddressSepolia = "0x3170453fc9914213592B0a65Bbd223786CDf880B";
const NFTAddressAmoy = "0x9347FEf4CbaC8CF631650AEb45922eD882F62c3b";

const NotaryContractSepolia = new ethers.Contract(NFTAddressSepolia, NotaryABI.abi, sepoliaWallet);
const NotaryContractAmoy = new ethers.Contract(NFTAddressAmoy, NotaryABI.abi, amoyWallet);

// console.log("sepolia", NODE_URL_SEPOLIA);   
// console.log("amoy", NODE_URL_AMOY);
// console.log("sepolia", sepoliaWallet.address);
// console.log("amoy", AMOY_PRIVATE_KEY);

async function transfer(){
    let idNFT = 8;

    console.log("Minting NFTs...");
    try{
    const sepoliaMint = await NotaryContractSepolia.connect(sepoliaWallet).mint("0x305fF925335cb4Aad692666b939cB0df8190437C", { gasLimit: 1000000 });
    await sepoliaMint.wait();

    console.log("Minted NFT Sepolia");
    balanceMint = await NotaryContractSepolia.balanceOf("0x305fF925335cb4Aad692666b939cB0df8190437C");
    console.log("Sepolia address: ", "0x305fF925335cb4Aad692666b939cB0df8190437C");
    console.log("BalanceOf Sepolia: ", balanceMint.toString());
    } catch (error) {
        console.error('Failed to mint NFT on Sepolia:', error);
    }

    console.log("\n\nAprove contract...");
    const approve = await NotaryContractSepolia.connect(sepoliaWallet02).approve(NFTAddressSepolia, idNFT);
    await approve.wait();

    try{
    console.log("\n\nTransfering NFTs...");
    const transfer = await NotaryContractSepolia.connect(sepoliaWallet02).transferInter(idNFT, "0x1283Bd5d3Db837eB0ec0DaB0b0D5aE6f291C22be", { gasLimit: 1000000 });
    await transfer.wait();
    } catch (error) {
        console.error('Failed to transfer NFT:', error);
    }

    const balanceContrctSepolia = await NotaryContractSepolia.balanceOf(NFTAddressSepolia);
    console.log("Balance of contract: ", balanceContrctSepolia.toString());


    // const balace = await NotaryContractSepolia.balanceOf("0x5AAd1957A2E047752cad49cbF4BB14f79Cb9B33E");
    // console.log("BalanceOf contract: ", balace.toString());

    try{
    console.log("Transfer on Amoy...");
    const amoyMint = await NotaryContractAmoy.connect(amoyWallet).mint("0x1283Bd5d3Db837eB0ec0DaB0b0D5aE6f291C22be", { gasLimit: 1000000 });
    await amoyMint.wait();
    } catch (error) {
        console.error('Failed to mint NFT on AMOY:', error);
    }

    const balaceAmoy = await NotaryContractAmoy.balanceOf("0x1283Bd5d3Db837eB0ec0DaB0b0D5aE6f291C22be");
    console.log("BalanceOf addres amoy: ", balaceAmoy.toString());

    console.log("Minted NFT Amoy");
}

transfer()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });