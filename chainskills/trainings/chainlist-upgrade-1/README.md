# Chain list upgrading

## Upgrade:

- use window.we3 which will be based on MetaMask
- upgrade code with async/await mode
- add loading
- sell article based on event

## Useful command

- truffle migrate --compile-all --reset --network ganache
- truffle test --network ganache
- npm install
- npm run dev

## Deploy at private network

- Need to create a private network
````
Puppeth
geth --datadir ./ChainSkills/private init ./ChainSkills/private/chainskills.json
geth --datadir . account new
geth --datadir . account list
geth --networkid 4224 --mine --minerthreads 1 --datadir "./ChainSkills/private" --nodiscover --rpc --rpcport "8545" --port "30303" --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net --unlock 0 --password ./ChainSkills/private/password.sec --ipcpath "~/Library/Ethereum/geth.ipc" --allow-insecure-unlock
````
- add from : '0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c' if not from account 0
- also need to do: web3.eth.personal.unlockAccount("0x4B0adEF60B570Aa73BE2cCe67923d6300bfB666c", "pass1234")
