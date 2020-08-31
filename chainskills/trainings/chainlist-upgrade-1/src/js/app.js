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
      let article = await chainListInstance.getArticle();
      App.loading = false;
      App.displayArticle(article);
    }catch(error) {
      console.error(error);
      App.loading = false;
    }
  },

  displayArticle: (article)=> {
    const articlesRow = $('#articlesRow');
    // retrieve the article placeholder and clear it
    $('#articlesRow').empty();
    // retrieve the article template and fill it
    var articleTemplate = $('#articleTemplate');
    articleTemplate.find('.panel-title').text(article[1]);
    articleTemplate.find('.article-description').text(article[2]);
    articleTemplate.find('.article-price').text(web3.utils.fromWei(article[3].toString(), "ether"));

    var seller = article[0];
    if (seller == App.account) {
      seller = "You";
    }
    articleTemplate.find('.article-seller').text(seller);
    // add this article
    articlesRow.append(articleTemplate.html());
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
        $('#' + event.id).remove();
        $('#events').append('<li class="list-group-item" id="' + event.id + '">' + event.returnValues._name + ' is for sale</li>');
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
