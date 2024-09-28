require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
require("dotenv").config();
const { parseEther } = require('ethers/lib/utils');

const NotaryABI = require("../artifacts/contracts/Notary.sol/Notary.json");
const NFTABI = require("../artifacts/contracts/NFT.sol/NFT.json");

const { NODE_URL_ARBITRUM, CHAIN_ID_ARBITRUM, ARBITRUM_PRIVATE_KEY01, ARBITRUM_PRIVATE_KEY02, ARBITRUM_PRIVATE_KEY03, NODE_URL_AMOY, CHAIN_ID_AMOY, AMOY_PRIVATE_KEY01, AMOY_PRIVATE_KEY02, AMOY_PRIVATE_KEY03, NOTARYADDRESSARBITRUM, NFTAADDRESSARBITRUM, NOTARYADDRESSAMOY, NFTAADDRESSAMOY } = process.env;

const arbitrumProvider = new ethers.providers.JsonRpcProvider(NODE_URL_ARBITRUM);
const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const arbitrumWallet = new ethers.Wallet(ARBITRUM_PRIVATE_KEY01, arbitrumProvider);
const arbitrumWallet02 = new ethers.Wallet(ARBITRUM_PRIVATE_KEY02, arbitrumProvider);
const arbitrumWallet03 = new ethers.Wallet(ARBITRUM_PRIVATE_KEY03, arbitrumProvider);

const amoyWallet = new ethers.Wallet(AMOY_PRIVATE_KEY01, amoyProvider);
const amoyWallet02 = new ethers.Wallet(AMOY_PRIVATE_KEY02, amoyProvider);
const amoyWallet03 = new ethers.Wallet(AMOY_PRIVATE_KEY03, amoyProvider);

const NotaryAddressArbitrum = NOTARYADDRESSARBITRUM;
const NFTAddressArbitrum = NFTAADDRESSARBITRUM;

const NotaryAddressAmoy = NOTARYADDRESSAMOY;
const NFTAddressAmoy = NFTAADDRESSAMOY;

const NotaryContractArbitrum = new ethers.Contract(NotaryAddressArbitrum, NotaryABI.abi, arbitrumWallet);
const NotaryContractAmoy = new ethers.Contract(NotaryAddressAmoy, NotaryABI.abi, amoyWallet);

const NFTContractArbitrum = new ethers.Contract(NFTAddressArbitrum, NFTABI.abi, arbitrumWallet);
const NFTContractAmoy = new ethers.Contract(NFTAddressAmoy, NFTABI.abi, amoyWallet);

async function transfer() {
    const NFTid = await NotaryContractArbitrum.connect(arbitrumWallet02).getNftTransfers();
    console.log("NFTid: ", NFTid);
    console.log("Mint NFT Arbitrum...");

    const mintArbitrumStartTime = Date.now();
    const arbitrumMint = await NFTContractArbitrum.connect(arbitrumWallet).mint(arbitrumWallet02.address, { gasLimit: 1000000 });
    const receiptarbitrumMint = await arbitrumMint.wait();
    const mintArbitrumEndTime = Date.now();
    const timeMintArbitrum = (mintArbitrumEndTime - mintArbitrumStartTime);
    const gasUsedMintArbitrum = receiptarbitrumMint.gasUsed;

    console.log("Minted NFT Arbitrum");
    balanceMint = await NFTContractArbitrum.balanceOf(arbitrumWallet02.address);
    console.log("Arbitrum address: ", arbitrumWallet02.address);
    console.log("BalanceOf Arbitrum: ", balanceMint.toString());
    console.log("Minting Time: ", (timeMintArbitrum), "ms");
    console.log("Gas Used: ", gasUsedMintArbitrum.toString());

    console.log("\n\nAprove contract...");
    const approveArbitrumStartTime = Date.now();
    const approve = await NFTContractArbitrum.connect(arbitrumWallet02).approve(NotaryAddressArbitrum, NFTid);
    const receiptApprove = await approve.wait();
    const approveArbitrumEndTime = Date.now();
    const timeApproveArbitrum = (approveArbitrumEndTime - approveArbitrumStartTime);
    const gasUsedApproveArbitrum = receiptApprove.gasUsed;
    console.log("Approve Time: ", (timeApproveArbitrum), "ms");
    console.log("Gas Used: ", gasUsedApproveArbitrum.toString());


    console.log("\n\nTransfering NFTs...");
    const transferArbitrumStartTime = Date.now();
    const transferInter = await NotaryContractArbitrum.connect(arbitrumWallet02).transferNFTInterChain(NFTAddressArbitrum, NFTid, amoyWallet02.address, { gasLimit: 1000000 });
    const receiptTransferInter = await transferInter.wait();
    const transferArbitrumEndTime = Date.now();
    const timeTransferArbitrum = (transferArbitrumEndTime - transferArbitrumStartTime);
    const gasUsedTransferArbitrum = receiptTransferInter.gasUsed;

    const dataTransfer = await NotaryContractArbitrum.connect(arbitrumWallet02).nftTransfers(NFTid);
    console.log("Data Transfer: ", dataTransfer);
    console.log("Transfer Time: ", (timeTransferArbitrum), "ms");
    console.log("Gas Used: ", gasUsedTransferArbitrum.toString());

    console.log("\nMint new NFT in Amoy");
    const amoyMintStartTime = Date.now();
    const gasEstimate = await amoyProvider.getFeeData();
    const amoyMint = await NotaryContractAmoy.connect(amoyWallet).mintNFT(
    amoyWallet02.address, 
    arbitrumWallet02.address, 
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

    const datamint = await NotaryContractAmoy.connect(amoyWallet).mintRecords(NFTid);
    console.log("Data Mint: ", datamint);

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const date = today.toISOString();
    console.log("\nDate: ", date);

    const csvData = [
        [date, gasUsedMintArbitrum.toString(), timeMintArbitrum, gasUsedApproveArbitrum.toString(), timeApproveArbitrum, gasUsedTransferArbitrum.toString(), timeTransferArbitrum, gasUsedMintAmoy.toString(), timeMintAmoy]
    ];

    // Convert array to CSV string
    const csvContent = csvData.map(e => e.join(",")).join("\n");

    // Check if the file already exists, if not, add headers
    if (!fs.existsSync('./metrics/gasUsageDataArbitrum.csv')) {
        const headers = 'date,gasUsedMintArbitrum,timeMintArbitrum,gasUsedApproveArbitrum,timeApproveArbitrum,gasUsedTransferArbitrum,timeTransferArbitrum,gasUsedMintAmoy,timeMintAmoy\n';
        fs.appendFileSync('./metrics/gasUsageDataArbitrum.csv', headers);
    }

    // Append the CSV data to the file
    fs.appendFileSync('./metrics/gasUsageDataArbitrum.csv', csvContent + '\n', (err) => {
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