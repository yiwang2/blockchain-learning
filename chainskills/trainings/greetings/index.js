const Web3 = require('web3');
const fs = require("fs");
const solc = require('solc');

letsTryThis();

async function letsTryThis () {
  let web3;
  if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
  } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  //编译合约
  let source = fs.readFileSync('./Greetings.sol', 'UTF-8');
  let compiledCode = solc.compile(source, 1);
  let contractABI = JSON.parse(compiledCode.contracts[':Greetings'].interface);
  let bytecode = compiledCode.contracts[':Greetings'].bytecode
  let account0 = await getFirstAccount(web3);
  let greetingsContract = new web3.eth.Contract(contractABI,null,{
      data: '0x'+bytecode,
      gas:'4700000'
  });
  //greetingsContract.options.address = '0x1234567890123456789012345678901234567891';
  let greetingsDeployedPromise = greetingsContract.deploy().send({
    from: account0
  })
  .on('error', (error) => {
    console.error(error)
  })

  let newContractInstance = await greetingsDeployedPromise.then((newContractInstance) => {
    //console.log(newContractInstance)
    //console.log(newContractInstance.options.address)
    return newContractInstance;
  });
  console.log(await newContractInstance.methods.getGreetings().call({from: account0}).then(console.log));
  console.log(await newContractInstance.methods.setGreetings("too complicated").send({from: account0}).then(console.log));
  console.log(await newContractInstance.methods.getGreetings().call({from: account0}).then(console.log));
}


async function getFirstAccount(web3) {
  let accounts = web3.eth.getAccounts();
  return accounts.then(
    (results) => {
      return results[0];
    }
  );
}
