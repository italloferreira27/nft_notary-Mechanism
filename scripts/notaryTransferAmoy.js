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

async function transferFromAmoy() {
    const NFTid = await NotaryContractAmoy.connect(amoyWallet02).getNftTransfers();
    console.log("NFTid: ", NFTid);
    console.log("Mint NFT Amoy...");

    const mintAmoyStartTime = Date.now();
    const amoyMint = await NFTContractAmoy.connect(amoyWallet).mint(amoyWallet02.address, 
        {
        gasLimit: 1000000, 
        maxPriorityFeePerGas: ethers.utils.parseUnits('25', 'gwei'),
        maxFeePerGas: ethers.utils.parseUnits('50', 'gwei')
        }
    );
    const receiptAmoyMint = await amoyMint.wait();
    const mintAmoyEndTime = Date.now();
    const timeMintAmoy = (mintAmoyEndTime - mintAmoyStartTime);
    const gasUsedMintAmoy = receiptAmoyMint.gasUsed;

    console.log("Minted NFT Amoy");
    balanceMint = await NFTContractAmoy.balanceOf(amoyWallet02.address);
    console.log("Amoy address: ", amoyWallet02.address);
    console.log("BalanceOf Amoy: ", balanceMint.toString());
    console.log("Minting Time: ", (timeMintAmoy), "ms");
    console.log("Gas Used: ", gasUsedMintAmoy.toString());

    console.log("\n\nAprove contract...");
    const approveAmoyStartTime = Date.now();
    const approve = await NFTContractAmoy.connect(amoyWallet02).approve(NotaryAddressAmoy, NFTid, 
        {
            gasLimit: 1000000, 
            maxPriorityFeePerGas: ethers.utils.parseUnits('25', 'gwei'),
            maxFeePerGas: ethers.utils.parseUnits('50', 'gwei')
        }
    );
    const receiptApprove = await approve.wait();
    const approveAmoyEndTime = Date.now();
    const timeApproveAmoy = (approveAmoyEndTime - approveAmoyStartTime);
    const gasUsedApproveAmoy = receiptApprove.gasUsed;
    console.log("Approve Time: ", (timeApproveAmoy), "ms");
    console.log("Gas Used: ", gasUsedApproveAmoy.toString());


    console.log("\n\nTransfering NFTs from Amoy...");
    const transferAmoyStartTime = Date.now();
    const transferInter = await NotaryContractAmoy.connect(amoyWallet02).transferNFTInterChain(NFTAddressAmoy, NFTid, arbitrumWallet02.address, 
        {
            gasLimit: 1000000, 
            maxPriorityFeePerGas: ethers.utils.parseUnits('25', 'gwei'),
            maxFeePerGas: ethers.utils.parseUnits('50', 'gwei')
        }
    );
    const receiptTransferInter = await transferInter.wait();
    const transferAmoyEndTime = Date.now();
    const timeTransferAmoy = (transferAmoyEndTime - transferAmoyStartTime);
    const gasUsedTransferAmoy = receiptTransferInter.gasUsed;

    const dataTransfer = await NotaryContractAmoy.connect(amoyWallet02).nftTransfers(NFTid);
    console.log("Data Transfer: ", dataTransfer);
    console.log("Transfer Time: ", (timeTransferAmoy), "ms");
    console.log("Gas Used: ", gasUsedTransferAmoy.toString());

    console.log("\nMint new NFT in Arbitrum");
    const arbitrumMintStartTime = Date.now();
    const gasEstimate = await arbitrumProvider.getFeeData();
    const arbitrumMint = await NotaryContractArbitrum.connect(arbitrumWallet).mintNFT(
        arbitrumWallet02.address, 
        amoyWallet02.address, 
        {
            gasLimit: 1000000, 
            maxPriorityFeePerGas: ethers.utils.parseUnits('25', 'gwei'),
            maxFeePerGas: ethers.utils.parseUnits('50', 'gwei')
        }
    );
    const receiptMintArbitrum = await arbitrumMint.wait();
    const arbitrumMintEndTime = Date.now();
    const timeMintArbitrum = (arbitrumMintEndTime - arbitrumMintStartTime);
    const gasUsedMintArbitrum = receiptMintArbitrum.gasUsed;

    balanceMint = await NotaryContractArbitrum.balanceOf(arbitrumWallet02.address);
    console.log("Arbitrum address: ", arbitrumWallet02.address);
    console.log("BalanceOf Arbitrum: ", balanceMint.toString());
    console.log("Minting Arbitrum Time: ", (timeMintArbitrum), "ms");
    console.log("Gas Used: ", gasUsedMintArbitrum.toString());

    const datamint = await NotaryContractArbitrum.connect(arbitrumWallet).mintRecords(NFTid);
    console.log("Data Mint: ", datamint);

    const csvData = [
        [gasUsedMintAmoy.toString(), timeMintAmoy, gasUsedApproveAmoy.toString(), timeApproveAmoy, gasUsedTransferAmoy.toString(), timeTransferAmoy, gasUsedMintArbitrum.toString(), timeMintArbitrum]
    ];

    // Convert array to CSV string
    const csvContent = csvData.map(e => e.join(",")).join("\n");

    // Check if the file already exists, if not, add headers
    if (!fs.existsSync('./metrics/gasUsageDataAmoy.csv')) {
        const headers = 'gasUsedMintAmoy,timeMintAmoy,gasUsedApproveAmoy,timeApproveAmoy,gasUsedTransferAmoy,timeTransferAmoy,gasUsedMintArbitrum,timeMintArbitrum\n';
        fs.appendFileSync('./metrics/gasUsageDataAmoy.csv', headers);
    }

    // Append the CSV data to the file
    fs.appendFileSync('./metrics/gasUsageDataAmoy.csv', csvContent + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data successfully appended to CSV file!');
        }
    });
}

transferFromAmoy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
