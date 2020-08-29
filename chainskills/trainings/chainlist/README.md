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

## Run contract with event

- define a event called LogSellArticle at contract
- var sellEvent = app.LogSellArticle({filter: {}, fromBlock: 0}, function(error, event){console.log(event);});
- app.sellArticle("iPhone 7", "sell iPhone 7", web3.utils.toWei("3", "ether"), {from: "0x6aCB53bbF1E54FF6C9842bc74714D4680098Ef79"})

```
logs: [
    {
      logIndex: 0,
      transactionIndex: 0,
      transactionHash: '0x8bb329202f4f846aea58e724675a6626b05074e97b188f3b1c9b631cfe7fbf3b',
      blockHash: '0xa0dfb4c90968a6dd27a29dfee2f7284dabba9efb760ee3bdd22b739bec48dee7',
      blockNumber: 16,
      address: '0xBEf9447a6Ae27F7fDB93339A54DC21E3438cfe74',
      type: 'mined',
      id: 'log_1171b82d',
      event: 'LogSellArticle',
      args: [Result]
    }
  ]
```

## Test
- truffle test --network ganache

## UI
- npm install
- npm run dev
