require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
require("dotenv").config();
const { parseEther } = require('ethers/lib/utils');
const axios = require('axios');

const NotaryABI = require("../artifacts/contracts/Notary.sol/Notary.json");
const NFTABI = require("../artifacts/contracts/NFT.sol/NFT.json");

const { NODE_URL_AVALANCHE, CHAIN_ID_AVALANCHE, AVALANCHE_PRIVATE_KEY01, AVALANCHE_PRIVATE_KEY02, AVALANCHE_PRIVATE_KEY03, NODE_URL_AMOY, CHAIN_ID_AMOY, AMOY_PRIVATE_KEY01, AMOY_PRIVATE_KEY02, AMOY_PRIVATE_KEY03, NOTARYADDRESSAVALANCHE, NFTAADDRESSAVALANCHE, NOTARYADDRESSAMOY, NFTAADDRESSAMOY } = process.env;

const avalancheProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AVALANCHE);
const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const avalancheWallet = new ethers.Wallet(AVALANCHE_PRIVATE_KEY01, avalancheProvider);
const avalancheWallet02 = new ethers.Wallet(AVALANCHE_PRIVATE_KEY02, avalancheProvider);
const avalancheWallet03 = new ethers.Wallet(AVALANCHE_PRIVATE_KEY03, avalancheProvider);

const amoyWallet = new ethers.Wallet(AMOY_PRIVATE_KEY01, amoyProvider);
const amoyWallet02 = new ethers.Wallet(AMOY_PRIVATE_KEY02, amoyProvider);
const amoyWallet03 = new ethers.Wallet(AMOY_PRIVATE_KEY03, amoyProvider);

const NotaryAddressAvalanche = NOTARYADDRESSAVALANCHE;
const NFTAddressAvalanche = NFTAADDRESSAVALANCHE;

const NotaryAddressAmoy = NOTARYADDRESSAMOY;
const NFTAddressAmoy = NFTAADDRESSAMOY;

const NotaryContractAvalanche = new ethers.Contract(NotaryAddressAvalanche, NotaryABI.abi, avalancheWallet);
const NotaryContractAmoy = new ethers.Contract(NotaryAddressAmoy, NotaryABI.abi, amoyWallet);

const NFTContractAvalanche = new ethers.Contract(NFTAddressAvalanche, NFTABI.abi, avalancheWallet);
const NFTContractAmoy = new ethers.Contract(NFTAddressAmoy, NFTABI.abi, amoyWallet);

async function getCryptoPrice(cryptoId) {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`);
        const price = response.data[cryptoId].usd;
        return price;
    } catch (error) {
        console.error(`Erro ao buscar o preço de ${cryptoId}:`, error);
        return null;
    }
}

async function transfer() {
    const fullTimeStart = Date.now();
    const NFTid = await NotaryContractAvalanche.connect(avalancheWallet02).getNftTransfers();
    console.log("NFTid: ", NFTid);
    console.log("Mint NFT Avalanche...");

    const mintAvalancheStartTime = Date.now();
    const avalancheMint = await NFTContractAvalanche.connect(avalancheWallet).mint(avalancheWallet02.address, { gasLimit: 1000000 });
    const receiptAvalancheMint = await avalancheMint.wait();
    const mintAvalancheEndTime = Date.now();
    const timeMintAvalanche = (mintAvalancheEndTime - mintAvalancheStartTime);
    const gasUsedMintAvalanche = receiptAvalancheMint.gasUsed;

    console.log("Minted NFT Avalanche");
    balanceMint = await NFTContractAvalanche.balanceOf(avalancheWallet02.address);
    console.log("Avalanche address: ", avalancheWallet02.address);
    console.log("BalanceOf Avalanche: ", balanceMint.toString());
    console.log("Minting Time: ", (timeMintAvalanche), "ms");
    console.log("Gas Used: ", gasUsedMintAvalanche.toString());

    console.log("\n\nAprove contract...");
    const approveAvalancheStartTime = Date.now();
    const approve = await NFTContractAvalanche.connect(avalancheWallet02).approve(NotaryAddressAvalanche, NFTid);
    const receiptApprove = await approve.wait();
    const approveAvalancheEndTime = Date.now();
    const timeApproveAvalanche = (approveAvalancheEndTime - approveAvalancheStartTime);
    const gasUsedApproveAvalanche = receiptApprove.gasUsed;
    console.log("Approve Time: ", (timeApproveAvalanche), "ms");
    console.log("Gas Used: ", gasUsedApproveAvalanche.toString());

    console.log("\n\nTransfering NFTs...");
    const transferAvalancheStartTime = Date.now();
    const transferInter = await NotaryContractAvalanche.connect(avalancheWallet02).transferNFTInterChain(NFTAddressAvalanche, NFTid, amoyWallet02.address, { gasLimit: 1000000 });
    const receiptTransferInter = await transferInter.wait();
    const transferAvalancheEndTime = Date.now();
    const timeTransferAvalanche = (transferAvalancheEndTime - transferAvalancheStartTime);
    const gasUsedTransferAvalanche = receiptTransferInter.gasUsed;

    const dataTransfer = await NotaryContractAvalanche.connect(avalancheWallet02).nftTransfers(NFTid);
    console.log("Data Transfer: ", dataTransfer);
    console.log("Transfer Time: ", (timeTransferAvalanche), "ms");
    console.log("Gas Used: ", gasUsedTransferAvalanche.toString());

    console.log("\nMint new NFT in Amoy");
    const amoyMintStartTime = Date.now();
    const amoyMint = await NotaryContractAmoy.connect(amoyWallet).mintNFT(
        amoyWallet02.address, 
        avalancheWallet02.address, 
        {
            gasLimit: 1000000, 
            maxPriorityFeePerGas: ethers.utils.parseUnits('25', 'gwei'),
            maxFeePerGas: ethers.utils.parseUnits('50', 'gwei')
        }
    );
    const receiptMintAmoy = await amoyMint.wait();
    const amoyMintEndTime = Date.now();
    const timeMintAmoy = (amoyMintEndTime - amoyMintStartTime);
    const gasUsedMintAmoy = receiptMintAmoy.gasUsed;

    balanceMint = await NotaryContractAmoy.balanceOf(amoyWallet02.address);
    console.log("Amoy address: ", amoyWallet02.address);
    console.log("BalanceOf Amoy: ", balanceMint.toString());
    console.log("Minting Amoy Time: ", (timeMintAmoy), "ms");
    console.log("Gas Used: ", gasUsedMintAmoy.toString());

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const date = today.toISOString();
    console.log("\nDate: ", date);

    const fullTimeEnd = Date.now();
    const fullTime = (fullTimeEnd - fullTimeStart);
    console.log("Full Time: ", fullTime, "ms");

    const cryptoId = 'avalanche-2';  // Avalanche
    const cryptoId2 = 'ethereum';      // Amoy  
    const priceAvalanche = await getCryptoPrice(cryptoId);
    const priceAmoy = await getCryptoPrice(cryptoId2);

    if (priceAvalanche !== null || priceAmoy !== null) {
        console.log(`Preço atual de ${cryptoId} em USD: $${priceAvalanche}`);
        console.log(`Preço atual de ${cryptoId2} em USD: $${priceAmoy}`);
    }

    const gasPriceAvalanche = await avalancheProvider.getGasPrice();
    const gasPriceAmoy = await amoyProvider.getGasPrice();

    console.log("Gas Price Avalanche: ", gasPriceAvalanche.toString());
    console.log("Gas Price Amoy: ", gasPriceAmoy.toString());

    const csvData = [
        [date, gasUsedMintAvalanche.toString(), timeMintAvalanche, gasUsedApproveAvalanche.toString(), timeApproveAvalanche, gasUsedTransferAvalanche.toString(), timeTransferAvalanche, gasUsedMintAmoy.toString(), timeMintAmoy, priceAvalanche, priceAmoy, fullTime, gasPriceAmoy.toString(), gasPriceAvalanche.toString()]
    ];

    // Convert array to CSV string
    const csvContent = csvData.map(e => e.join(",")).join("\n");

    // Check

    if (!fs.existsSync('./_metrics/gasUsageDataAvalanche.csv')) {
        const headers = 'date,gasUsedMintAvalanche,timeMintAvalanche,gasUsedApproveAvalanche,timeApproveAvalanche,gasUsedTransferAvalanche,timeTransferAvalanche,gasUsedMintAmoy,timeMintAmoy,priceAmoy (USD),priceAvalanche (USD),full Time (ms),gasPriceAmoy,gasPriceAvalanche\n';
        fs.appendFileSync('./metrics/gasUsageDataAvalanche.csv', headers);
    }
    
    // Append the CSV data to the file
    fs.appendFileSync('./metrics/gasUsageDataAvalanche.csv', csvContent + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data successfully appended to CSV file!');
        }
    });
    }
    
    transfer()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
    