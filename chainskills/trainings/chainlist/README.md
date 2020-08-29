# Chain list with test

## Init project
- truffle unbox chainskills/chainskills-box-truffle5

## Run contract
- truffle migrate --compile-all --reset --network ganache
- truffle console --network ganache
- ChainList.deployed().then(function(instance){app=instance;})
- app.getArticle()
- app.sellArticle("iPhone 7", "sell iPhone 7", web3.utils.toWei("3", "ether"), {from: "0x6aCB53bbF1E54FF6C9842bc74714D4680098Ef79"})
- app.getArticle()

## Test
- truffle test --network ganache

## UI
- npm install
- npm run dev
