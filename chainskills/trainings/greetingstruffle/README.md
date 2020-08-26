# Development based on truffle 5

## Develop

- Terminal: truffle develop / truffle develop --log
- migrate --compile-all --reset
- Greetings.deployed().then(function(instance){app=instance;}) 
- app.getGreetings()
- app.setGreetings("Hello")
- app.getGreetings()

## Deploy to Ganache

- truffle migrate --compile-all --reset --network ganache


