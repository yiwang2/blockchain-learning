App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: async () => {
        return App.initWeb3();
    },

    initWeb3: async () => {
      if(window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          try {
              await window.ethereum.enable();
              App.displayAccountInfo();
              return App.initContract();
          } catch(error) {
              //user denied access
              console.error("Unable to retrieve your accounts! You have to approve this application on Metamask");
          }
      } else if(window.web3) {
          window.web3 = new Web3(web3.currentProvider || "ws://localhost:8545");
          App.displayAccountInfo();
          return App.initContract();
      } else {
          //no dapp browser
          console.log("Non-ethereum browser detected. You should consider trying Metamask");
      }
    },

    displayAccountInfo: async () => {
        const accounts = await window.web3.eth.getAccounts();
        App.account = accounts[0];
        $('#account').text(App.account);
        const balance = await window.web3.eth.getBalance(App.account);
        $('#accountBalance').text(window.web3.utils.fromWei(balance, "ether") + " ETH");
    },

    initContract: async () => {
            $.getJSON('ChainList.json', chainListArtifact => {
                App.contracts.ChainList = TruffleContract(chainListArtifact);
                App.contracts.ChainList.setProvider(window.web3.currentProvider);
                App.listenToEvents();
                return App.reloadArticles();
            });
        },


  reloadArticles: async()=> {
    // avoid reentry
     if (App.loading) {
         return;
     }
     App.loading = true;

    // refresh account information because the balance might have changed
    App.displayAccountInfo();
    try {
      const chainListInstance = await App.contracts.ChainList.deployed();
      const articleIds = await chainListInstance.getArticlesForSale();
      $('#articlesRow').empty();
      for(let i = 0; i < articleIds.length; i++) {
          const article = await chainListInstance.articles(articleIds[i]);
          App.displayArticle(article);
      }
      App.loading = false;
    }catch(error) {
      console.error(error);
      App.loading = false;
    }
  },

//article[0], article[1], article[3], article[4], article[5]
//id, seller, name, description, price
  displayArticle: (article)=> {
    const articlesRow = $('#articlesRow');
    var price = web3.utils.fromWei(article[5].toString(), "ether");
    var id = article[0];
    // retrieve the article template and fill it
    var articleTemplate = $('#articleTemplate');
    articleTemplate.find('.panel-title').text(article[3]);
    articleTemplate.find('.article-description').text(article[4]);
    articleTemplate.find('.article-price').text(price);
    articleTemplate.find('.btn-buy').attr('data-id', id);
    articleTemplate.find('.btn-buy').attr('data-value', price);

    var seller = article[1];
    if (seller == App.account) {
      seller = "You";
    }
    articleTemplate.find('.article-seller').text(seller);
    // buyer
    var buyer = article[2];
    if(buyer == App.account){
      buyer = "You";
    } else if(buyer == 0X0) {
      buyer = "No one yet";
    }
    articleTemplate.find('.article-buyer').text(buyer);

    if(article[1] == App.account || article[2] != 0X0) {
      articleTemplate.find('.btn-buy').hide();
    } else {
      articleTemplate.find('.btn-buy').show();
    }
    // add this article
    articlesRow.append(articleTemplate.html());
  },

  buyArticle: async () => {
    event.preventDefault();
    var _articleId = $(event.target).data('id');
    var articlePriceValue = parseFloat($(event.target).data('value'));
    var articlePrice = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
    var _price = window.web3.utils.toWei(articlePrice, "ether");
    var chainListInstance = await App.contracts.ChainList.deployed();
    var transactionReceipt = await chainListInstance.buyArticle(_articleId,
                {
                    from: App.account,
                    value: _price,
                    gas: 500000
                }
    ).on("transactionHash", hash => {
      console.log("transaction hash", hash);
    });
    console.log("transaction receipt", transactionReceipt);
  },

  sellArticle: async () => {
      const articlePriceValue = parseFloat($('#article_price').val());
      const articlePrice = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
      const _name = $('#article_name').val();
      const _description = $('#article_description').val();
      const _price = window.web3.utils.toWei(articlePrice, "ether");
      if(_name.trim() == "" || _price === "0") {
          return false;
      }
      try {
          const chainListInstance = await App.contracts.ChainList.deployed();
          const transactionReceipt = await chainListInstance.sellArticle(
              _name,
              _description,
              _price,
              {from: App.account, gas: 5000000}
          ).on("transactionHash", hash => {
              console.log("transaction hash", hash);
          });
          console.log("transaction receipt", transactionReceipt);
      } catch(error) {
          console.error(error);
      }
    },

  listenToEvents: async ()=> {
    const chainListInstance = await App.contracts.ChainList.deployed();
    chainListInstance.LogSellArticle({fromBlock: '0'})
    .on("data", event => {
        $("#events").append('<li class="list-group-item">' + event.args._name + ' is now for sale</li>');
        App.reloadArticles();
    })
    .on("error", error => {
        console.error(error);
    });

    chainListInstance.LogBuyArticle({fromBlock: '0'})
    .on("data", event => {
      $("#events").append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name + '</li>');
      App.reloadArticles();
    })
    .on("error", error => {
        console.error(error);
    });

  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
