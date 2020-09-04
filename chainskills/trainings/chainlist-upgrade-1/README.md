# Chain list upgrading

## Upgrade:

- use window.we3 which will be based on MetaMask
- upgrade code with async/await mode
- add loading
- sell article based on event

## Useful command

- web3.eth.getAccounts().then(console.log)
- truffle migrate --compile-all --reset --network ganache
- truffle test --network ganache
- truffle debug TxHash (for example: truffle debug 0xc1b6ab88090e5f1a95749b217ce58671f3e74f01d21b252c89a60ad23d434e17)
- npm install
- npm run dev

## Deploy at private network

- Need to create a private network
````
Puppeth (this is a eth network manager console)
geth --datadir ./ChainSkills/private init ./ChainSkills/private/chainskills.json
geth --datadir . account new
geth --datadir . account list
geth --networkid 4224 --mine --minerthreads 1 --datadir "./ChainSkills/private" --nodiscover --rpc --rpcport "8545" --port "30303" --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net --unlock 0 --password ./ChainSkills/private/password.sec --ipcpath "~/Library/Ethereum/geth.ipc" --allow-insecure-unlock
````
- truffle migrate --compile-all --reset --network chainskills
- truffle test --network chainskills
- add from : '0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c' at truffle-config.js if not from account 0 
- also need to do: web3.eth.personal.unlockAccount("0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c", "pass1234")
