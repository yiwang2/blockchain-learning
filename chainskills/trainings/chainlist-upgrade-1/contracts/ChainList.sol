pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

contract ChainList is Ownable {
//custom types
struct Article {
  uint id;
  //state variables
  address payable seller;
  address buyer;
  string name;
  string description;
  uint256 price;
}
mapping (uint => Article) public articles;
uint articleCounter;
  // Events
  event LogSellArticle (
    uint indexed _id,
      address indexed _seller,
      string _name,
      uint256 _price);

  event LogBuyArticle (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // kill the smart contract
  function kill() public onlyOwner {
      selfdestruct(owner);
  }

  //sell an article
  function sellArticle (string memory _name, string memory _description, uint256 _price) public {
    articleCounter ++;
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      address(0x0),
      _name,
      _description,
      _price
    );

    emit LogSellArticle(articleCounter, msg.sender, _name, _price);
  }

  // fetch the number of articles in the contract
  function getNumberOfArticles() public view returns (uint) {
    return articleCounter;
  }

  function buyArticle (uint _id) payable public{
    //whether there is an article for sale
    require (articleCounter > 0, "There should be at least one article");
    //if article is existing
    require (_id > 0 && _id <= articleCounter, "Article with this id does not exist");
    //retrieve article from mapping
    Article storage article = articles[_id];
    //article not sold
    require (article.buyer == address(0x0), "Article was already sold");
    //don't buy yourself
    require (msg.sender != article.seller, "Seller cannot buy his own article");
    //check corresponds
    require (msg.value == article.price, "Value provided does not match price of article");

    article.buyer = msg.sender;
    //pay to seller
    article.seller.transfer(msg.value);
    //trigger Events
    emit LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
  }

  // fetch and returns all article IDs available for sale
  function getArticlesForSale() public view returns (uint[]memory) {
      // we check whether there is at least one article
      if(articleCounter == 0) {
          return new uint[](0);
      }
      // prepare output arrays
      uint[] memory articleIds = new uint[](articleCounter);
      uint numberOfArticlesForSale = 0;
        // iterate over articles
      for (uint i = 1; i <= articleCounter; i++) {
          // keep only the ID for the article not already sold
          if (articles[i].buyer == address(0)) {
              articleIds[numberOfArticlesForSale] = articles[i].id;
              numberOfArticlesForSale++;
          }
      }
      // copy the articleIds array into the smaller forSale array
     uint[] memory forSale = new uint[](numberOfArticlesForSale);
     for (uint j = 0; j < numberOfArticlesForSale; j++) {
         forSale[j] = articleIds[j];
     }
     return forSale;

    }
}
