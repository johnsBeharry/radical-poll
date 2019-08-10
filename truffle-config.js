require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = process.env.INFURA_KEY;

module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `http://localhost:8545`),
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
  	},

    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  
    rinkby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rinkby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 4,       // Rinkby's id
      gas: 5500000,        // Rinkby has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  
    goerli: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 5,       // Goerli's id
      gas: 5500000,        // Goerli has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

  },

  plugins: [
  ],

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
    }
  },

  api_keys: {
    etherscan: process.env.ETHERSCAN
  }
}
