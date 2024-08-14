/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.24",

  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/bDjxjFADcYvYa7g5E5nW7LatEgYhQkjN",
      chainId: 11155111,
      accounts: ['0x412682824d2aad8d08315c73d861c1257736bae750e5d0501c425adf5d932c06', '0xfe7a470d011d7e01c12dbf63d48bc83664dd1fa05e05df4ca127fcd785e86d75', '0x8f46b90a74d19227207e70caeca07bdd60e3d5c117dff1f12c22e43c6b3485b2'],
      // 1° account: 0xfe8338eCd24439df698db7D615B3B57110764feB
      // 2° account: 0x305fF925335cb4Aad692666b939cB0df8190437C
      // 3° account: 0xf7e451fB0038eBafcFd28ee2f887A3803C83A7de
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/EKUz0RuSYrWNu-5AqycTorLF2ycFfzDm",
      chainId: 80002,
      accounts: ['0xf5ee5caf9c1c3c0f7645cdb3074f306524aa17686ddc3839458e2ebff46594e6','0xe7ce2df2e00f9af2edb48ab0fefbb40ca0d7fa1348cf034ae4e6fef69db4fbeb','0x9176a03007637ff1a71ef48d71b3809eae55605f7479556d3432f6f126d1a356']
      // 1° account: 0x7bA98f6a9Ce512e5155b297594D176333FdA1aD3
      // 2° account: 0xd4d902D8d6c40F59B217e78380C8190Aad72383B
      // 3° account: 0x1283Bd5d3Db837eB0ec0DaB0b0D5aE6f291C22be
    },
  },
};
