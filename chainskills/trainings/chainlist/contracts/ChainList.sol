pragma solidity >=0.4.22 <0.8.0;

contract ChainList {
  //state variables
  address seller;
  string name;
  string description;
  uint256 price;

  //sell an article
  function sellArticle (string memory _name, string memory _description, uint256 _price) public {
    seller = msg.sender;
    name = _name;
    description = _description;
    price = _price;
  }

  //get article
  function getArticle () public view returns (
    address _seller,
    string memory _name,
    string memory _description,
    uint256 _price) {
    return (seller, name, description, price);
  }
}
