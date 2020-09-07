module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        ganache: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
        },
        chainskills : {
          host: "localhost",
          port: 8545,
          network_id: "4224",
          //gas: 4700000 // if out of gas limit exception is thrown
          //from : '0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c'
          //not from first account: web3.eth.personal.unlockAccount("0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c", "pass1234").then(console.log("Unlocked"))
        },
        rinkeby: {
            host: "localhost",
            port: 8545,
            network_id: 4, // Rinkeby test network
            gas: 4700000
        }
    },
    // Configure your compilers
    compilers: {
        solc: {
            settings: {          // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};
