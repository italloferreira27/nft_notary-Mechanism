/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.24",

  networks: {
    hardhat: {
    },
    arbitrum: {
      url: "https://arb-sepolia.g.alchemy.com/v2/<your API key>",
      chainId: 421614,
      accounts: ["<ARBITRUM_PRIVATE_KEY01>", "<ARBITRUM_PRIVATE_KEY02>", "<ARBITRUM_PRIVATE_KEY03>"],
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/your API key",
      chainId: 80002,
      accounts: ["<AMOY_PRIVATE_KEY01>", "<AMOY_PRIVATE_KEY02>", "<AMOY_PRIVATE_KEY03>"],
    },
  },
};
