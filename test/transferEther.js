require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const { ethers } = require('ethers');
require("dotenv").config();

const NODE_URL_AMOY = 'https://avalanche-fuji.infura.io/v3/';
const AMOY_PRIVATE_KEY01 = '0x';
const AMOY_PRIVATE_KEY02 = '0x'; 

const amoyProvider = new ethers.providers.JsonRpcProvider(NODE_URL_AMOY);

const amoySender = new ethers.Wallet(AMOY_PRIVATE_KEY01, amoyProvider);
const amoyReceiver = new ethers.Wallet(AMOY_PRIVATE_KEY02, amoyProvider);

// Função para buscar o saldo de uma conta
async function getBalance(address) {
    const balance = await amoyProvider.getBalance(address);
    console.log(`Saldo de ${address}: ${ethers.utils.formatEther(balance)} ETH`);
    return balance;
}

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
    // Consultar saldos antes da transferência
    console.log("Saldo antes da transferência:");
    await getBalance(amoySender.address);
    await getBalance(amoyReceiver.address);

    const receiverAddress = amoyReceiver.address; 
    const amountInEther = "1"; 

    // Realizar a transferência
    await transferEther(amoySender, receiverAddress, amountInEther);

    // Consultar saldos após a transferência
    console.log("Saldo após a transferência:");
    await getBalance(amoySender.address);
    await getBalance(amoyReceiver.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
