
var ChainList = artifacts.require("./ChainList.sol")

//test suit
contract ("ChainList", function (accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "test";
  var description1 = "description";
  var price1 = 1;
  var articleName2 = "test";
  var description2 = "description";
  var price2 = 3;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy

  before("set up contract instance for each test", async () => {
        chainListInstance = await ChainList.deployed();
  });


   it("should be init with empty", async()=> {
     let data = await chainListInstance.getNumberOfArticles();
     assert.equal(data.toNumber(), 0, "Number of articles is 0");
     let articles = await chainListInstance.getArticlesForSale();
     assert.equal(articles.length, 0, "Articles for sale 0");
   });

   it ("should sell first article", async ()=> {

     let receipt = await chainListInstance.sellArticle(articleName1, description1, web3.utils.toWei(price1.toString(), "ether"), {from : seller});
     //check event
      assert.equal(receipt.logs.length, 1, "should have received one event");
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event name should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName1, "article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price.toString(), web3.utils.toWei(price1.toString(), "ether").toString(),
      "article price must be " + web3.utils.toWei(price1.toString(), "ether"));

      const numberOfArticles = await chainListInstance.getNumberOfArticles();
      assert.equal(numberOfArticles, 1, "number of articles must be one");

      const articlesForSale = await chainListInstance.getArticlesForSale();
      assert.equal(articlesForSale.length, 1, "there must now be 1 article for sale");
      const articleId = articlesForSale[0].toNumber();
      assert.equal(articleId, 1, "article id must be 1");

      const article = await chainListInstance.articles(articleId);
      assert.equal(article[0].toNumber(), 1, "article id must be 1");
      assert.equal(article[1], seller, "seller must be " + seller);
      assert.equal(article[2], 0x0, "buyer must be empty");
      assert.equal(article[3], articleName1, "article name must be " + articleName1);
      assert.equal(article[4], description1, "article description must be " + description1);
      assert.equal(article[5].toString(), web3.utils.toWei(price1.toString(), "ether").toString(), "article price must be " + web3.utils.toWei(price1.toString(), "ether"));
    });

    it ("should sell second article", async ()=> {

      let receipt = await chainListInstance.sellArticle(articleName2, description2, web3.utils.toWei(price2.toString(), "ether"), {from : seller});
      //check event
       assert.equal(receipt.logs.length, 1, "should have received one event");
       assert.equal(receipt.logs[0].event, "LogSellArticle", "event name should be LogSellArticle");
       assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
       assert.equal(receipt.logs[0].args._seller, seller, "seller must be " + seller);
       assert.equal(receipt.logs[0].args._name, articleName2, "article name must be " + articleName2);
       assert.equal(receipt.logs[0].args._price.toString(), web3.utils.toWei(price2.toString(), "ether").toString(),
       "article price must be " + web3.utils.toWei(price2.toString(), "ether"));

       const numberOfArticles = await chainListInstance.getNumberOfArticles();
       assert.equal(numberOfArticles, 2, "number of articles must be two");

       const articlesForSale = await chainListInstance.getArticlesForSale();
       assert.equal(articlesForSale.length, 2, "there must now be 2 articles for sale");
       const articleId = articlesForSale[1].toNumber();
       assert.equal(articleId, 2, "article id must be 2");

       const article = await chainListInstance.articles(articleId);
       assert.equal(article[0].toNumber(), 2, "article id must be 2");
       assert.equal(article[1], seller, "seller must be " + seller);
       assert.equal(article[2], 0x0, "buyer must be empty");
       assert.equal(article[3], articleName2, "article name must be " + articleName2);
       assert.equal(article[4], description2, "article description must be " + description2);
       assert.equal(article[5].toString(), web3.utils.toWei(price2.toString(), "ether").toString(), "article price must be " + web3.utils.toWei(price2.toString(), "ether"));
     });

//remember:  test function will inherit state from last one
   it("should buy first article", async ()=> {

     sellerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
     buyerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether"));
     const receipt = await chainListInstance.buyArticle(1, {
            from: buyer,
            value: web3.utils.toWei(price1.toString(), "ether")
     });
     assert.equal(receipt.logs.length, 1, "one event should have been triggered");
     assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
     assert.equal(receipt.logs[0].args._id.toNumber(), 1, "Must buy article: 1");
     assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
     assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
     assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
     assert.equal(receipt.logs[0].args._price, web3.utils.toWei(price1.toString(), "ether").toString(), "event article price must be " + web3.utils.toWei(price1.toString(), "ether"));

     sellerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
     buyerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether"));

     assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + price1, "seller should have earned: "+ price1);
     assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - price1, "buyer should have payed: "+ price1);

     const article = await chainListInstance.articles(1);

    assert.equal(article[0].toNumber(), 1, "article id must be 1");
    assert.equal(article[1], seller, "seller must be " + seller);
    assert.equal(article[2], buyer, "buyer must be " + buyer);
    assert.equal(article[3], articleName1, "article name must be " + articleName1);
    assert.equal(article[4], description1, "article description must be " + description1);
    assert.equal(article[5].toString(), web3.utils.toWei(price1.toString(), "ether").toString(), "article price must be " + web3.utils.toWei(price1.toString(), "ether"));

    const articlesForSale = await chainListInstance.getArticlesForSale();

    assert(articlesForSale.length, 1, "there should now be only one article left for sale");
   });
});
