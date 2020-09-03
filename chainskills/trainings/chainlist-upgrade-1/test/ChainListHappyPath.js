
var ChainList = artifacts.require("./ChainList.sol")

//test suit
contract ("ChainList", function (accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "test";
  var description = "description";
  var price = 1;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy

  before("set up contract instance for each test", async () => {
        chainListInstance = await ChainList.deployed();
  });


   it("should be init with empty", async()=> {
     let data = await chainListInstance.getArticle();
     assert.equal(data[0], 0x0, "seller is empty");
     assert.equal(data[1], 0x0, "buyer is empty");
     assert.equal(data[2], "", "article name is empty");
     assert.equal(data[3], "", "description is empty");
     assert.equal(data[4].toNumber(), 0, "article price is 0");
   });

   it ("should sell an article", async ()=> {

     let sellAnArticle = await chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from : seller});
     let data = await chainListInstance.getArticle();
     assert.equal(data[0], seller, "seller is "+ seller);
     assert.equal(data[1], 0x0, "buyer is empty");
     assert.equal(data[2], articleName, "article name is "+ articleName);
     assert.equal(data[3], description, "description is "+ description);
     assert.equal(data[4].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));
   });

//remember:  test function will inherit state from last one
   it("should buy an article", async ()=> {

     sellerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
     buyerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether"));
     const receipt = await chainListInstance.buyArticle({
            from: buyer,
            value: web3.utils.toWei(price.toString(), "ether")
     });
     assert.equal(receipt.logs.length, 1, "one event should have been triggered");
     assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
     assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
     assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
     assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
     assert.equal(receipt.logs[0].args._price, web3.utils.toWei(price.toString(), "ether").toString(), "event article price must be " + web3.utils.toWei(price.toString(), "ether"));

     sellerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
     buyerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether"));

     assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + price, "seller should have earned: "+ price);
     assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - price, "buyer should have payed: "+ price);

     let data = await chainListInstance.getArticle();
     assert.equal(data[0], seller, "seller is "+ seller);
     assert.equal(data[1], buyer, "buyer is "+buyer);
     assert.equal(data[2], articleName, "article name is "+ articleName);
     assert.equal(data[3], description, "description is "+ description);
     assert.equal(data[4].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));
   });

   it("should trigger an event when a new article is sold", function() {
   return ChainList.deployed().then(function(instance) {
     chainListInstance = instance;
     return chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from: seller});
   }).then(function(receipt) {
     assert.equal(receipt.logs.length, 1, "one event should have been triggered");
     assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
     assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
     assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
     assert.equal(receipt.logs[0].args._price, web3.utils.toWei(price.toString(), "ether").toString(), "event article price must be " + web3.utils.toWei(price.toString(), "ether"));
   });
 });
});
