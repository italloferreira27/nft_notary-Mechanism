require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const { ethers } = require('ethers');
require("dotenv").config();

const NODE_URL_AMOY = 'https://polygon-amoy.g.alchemy.com/v2/KEY';
const AMOY_PRIVATE_KEY01 = '0x';
const AMOY_PRIVATE_KEY02 = '0x'; 

const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const amoySender = new ethers.Wallet(AMOY_PRIVATE_KEY01, amoyProvider);
const amoyReceiver = new ethers.Wallet(AMOY_PRIVATE_KEY02, amoyProvider);


async function transferEther(senderWallet, receiverAddress, amountInEther) {
    const tx = {
        to: receiverAddress,
        value: ethers.utils.parseEther(amountInEther),
        gasLimit: 21000, 
        gasPrice: await amoyProvider.getGasPrice() 
    };

    console.log(`Enviando ${amountInEther} ETH de ${senderWallet.address} para ${receiverAddress}...`);
    const transaction = await senderWallet.sendTransaction(tx);
    await transaction.wait();
    console.log(`Transação concluída! Hash da transação: ${transaction.hash}`);
}

async function main() {
    const receiverAddress = amoyReceiver.address; 
    const amountInEther = "20"; 

    
    await transferEther(amoySender, receiverAddress, amountInEther);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });