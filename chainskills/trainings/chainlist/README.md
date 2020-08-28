# Chain list with test

## Init project
- truffle unbox chainskills/chainskills-box-truffle5

## Run contract
- truffle migrate --compile-all --reset --network ganache
- truffle console --network ganache
- ChainList.deployed().then(function(instance){app=instance;})
- app.getArticle()
- app.sellArticle("iPhone 7", "sell iPhone 7", web3.toWei(3, "ether"), {from: "0x59aC1F73cA4B4d9AA88B5C4041e8AB6Fce7A22a9"})
- app.getArticle()

## Test
- truffle test --network ganache

## UI
- npm install
- npm run dev
