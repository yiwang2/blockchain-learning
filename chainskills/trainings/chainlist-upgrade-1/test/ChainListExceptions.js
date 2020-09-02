const ChainList = artifacts.require("./ChainList.sol");


contract ("ChainList", function (accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "testException";
  var description = "description exception";
  var price = 2;

  before("set up contract instance for each test", async () => {
        chainListInstance = await ChainList.deployed();
  });

  it ("If no article for sale", async ()=> {
    try {
      await chainListInstance.buyArticle({
             from: buyer,
             value: web3.utils.toWei(price.toString(), "ether")
      });
      assert.fail();
    } catch (error) {
      assert(true);
    }

    let data = await chainListInstance.getArticle();
    assert.equal(data[0], 0x0, "seller is empty");
    assert.equal(data[1], 0x0, "buyer is empty");
    assert.equal(data[2], "", "article name is empty");
    assert.equal(data[3], "", "description is empty");
    assert.equal(data[4].toNumber(), 0, "article price is 0");
  });

  it ("if buy yourself", async ()=> {
    await chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from : seller});
    try {
      await chainListInstance.buyArticle({
             from: seller,
             value: web3.utils.toWei(price.toString(), "ether")
      });
      assert.fail();
    }catch(error) {
      assert(true);
    }

    let data = await chainListInstance.getArticle();
    assert.equal(data[0], seller, "seller is "+ seller);
    assert.equal(data[1], 0x0, "buyer is empty");
    assert.equal(data[2], articleName, "article name is "+ articleName);
    assert.equal(data[3], description, "description is "+ description);
    assert.equal(data[4].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));
  });

  it ("if buy with bad price", async ()=> {
    //await chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from : seller});
    try {
      await chainListInstance.buyArticle({
             from: buyer,
             value: web3.utils.toWei((price+1).toString(), "ether")
      });
      assert.fail();
    }catch(error) {
      assert(true);
    }

    let data = await chainListInstance.getArticle();
    assert.equal(data[0], seller, "seller is "+ seller);
    assert.equal(data[1], 0x0, "buyer is empty");
    assert.equal(data[2], articleName, "article name is "+ articleName);
    assert.equal(data[3], description, "description is "+ description);
    assert.equal(data[4].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));
  });

  it ("if article is already sold", async ()=> {
      //await chainListInstance.sellArticle(articleName, description, web3.utils.toWei(price.toString(), "ether"), {from : seller});
      await chainListInstance.buyArticle({
             from: buyer,
             value: web3.utils.toWei((price).toString(), "ether")
      });
      try {
        await chainListInstance.buyArticle({
               from: buyer,
               value: web3.utils.toWei((price).toString(), "ether")
        });
        assert.fail();
      }catch (error) {
        assert(true);
      }
      let data = await chainListInstance.getArticle();
      assert.equal(data[0], seller, "seller is "+ seller);
      assert.equal(data[1], 0x0, "buyer is empty"); //is buyer empty? 
      assert.equal(data[2], articleName, "article name is "+ articleName);
      assert.equal(data[3], description, "description is "+ description);
      assert.equal(data[4].toString(), web3.utils.toWei(price.toString(), "ether").toString(), "article price is "+web3.utils.toWei(price.toString(), "ether"));

  });

});
