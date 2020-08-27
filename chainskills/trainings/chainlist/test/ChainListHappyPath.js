
var ChainList = artifacts.require("./ChainList.sol")

//test suit
contract ("ChainList", function (accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var articleName = "test";
  var description = "description";
  var price = 10;


   it("should be init with empty", function() {
     return ChainList.deployed()
     .then(function(instance) {return instance.getArticle()})
     .then(function (data) {
       assert.equal(data[0], 0x0, "seller is empty");
       assert.equal(data[1], "", "article name is empty");
       assert.equal(data[2], "", "description is empty");
       assert.equal(data[3].toNumber(), 0, "article price is 0");
     })
   });

   it ("should sell an article", function () {
     return ChainList.deployed()
     .then(function (instance) {
       chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from : seller});

     })
     .then(function () {
       return chainListInstance.getArticle();
     })
     .then(function (data) {
       assert.equal(data[0], seller, "seller is "+ seller);
       assert.equal(data[1], articleName, "article name is "+ articleName);
       assert.equal(data[2], description, "description is "+ description);
       assert.equal(data[3].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));
     })
   });
});
