const axios = require('axios');

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

async function main() {
    const cryptoId = 'matic-network'; // ID da criptomoeda na CoinGecko (por exemplo, 'ethereum' para Ether)
    const cryptoId2 = 'ethereum'; // ID da criptomoeda na CoinGecko (por exemplo, 'ethereum' para Ether)
    const price = await getCryptoPrice(cryptoId);
    const price2 = await getCryptoPrice(cryptoId2);
    if (price !== null) {
        console.log(`Preço atual de ${cryptoId} em USD: $${price}`);
        console.log(`Preço atual de ${cryptoId2} em USD: $${price2}`);
    }
}

main();