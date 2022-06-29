const HDWalletProvider = require("@truffle/hdwallet-provider");

const gasPrice = 1000000000; //process.env.GASPRICE;
let privateKeys = ["774112a126f3fb72456e4887a9c816cd6fd3ffde83ed55cd96fe7da7f4a5d40c"];
const network = "http://bops.morpheuslabs.io:21587";
const chainId = 4816;

module.exports = {
  compilers: {
    solc: {
      //version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
    },
  },
  networks: {
    // network for unit testing
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*',
      gas: 5000000,
    },
    private_poa: {
      provider: function () {
        return new HDWalletProvider(
          {
            privateKeys: privateKeys,
            providerOrUrl: network,
            chainId: chainId
          }
        )
      },
      network_id: "*",
      gas: 6000000,
      gasPrice: gasPrice
    }
  }
};
