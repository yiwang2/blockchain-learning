pragma solidity >=0.4.22 <0.8.0;

contract Ownable {
    // State variable
    address payable owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "This function can only be called by the contract owner");
        _;
    }

    // constructor
    constructor() public {
        owner = msg.sender;
    }
}
