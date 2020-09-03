pragma solidity >=0.4.22 <0.8.0;

contract ChainList {
  //state variables
  address payable seller;
  address buyer;
  string name;
  string description;
  uint256 price;

  // Events
  event LogSellArticle (
      address indexed _seller,
      string _name,
      uint256 _price);

  event LogBuyArticle (
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  //sell an article
  function sellArticle (string memory _name, string memory _description, uint256 _price) public {
    seller = msg.sender;
    name = _name;
    description = _description;
    price = _price;

    emit LogSellArticle(msg.sender, _name, _price);
  }

  //get article
  function getArticle () public view returns (
    address _seller,
    address _buyer,
    string memory _name,
    string memory _description,
    uint256 _price) {
    return (seller, buyer, name, description, price);
  }

  function buyArticle () payable public{
    //whether there is an article for sale
    require (seller != address(0x0));
    //article not sold
    require (buyer == address(0x0));
    //don't buy yourself
    require (msg.sender != seller);
    //check corresponds
    require (msg.value == price);

    buyer = msg.sender;
    //pay to seller
    seller.transfer(msg.value);
    //trigger Events
    emit LogBuyArticle(seller, buyer, name, price);
  }
}
