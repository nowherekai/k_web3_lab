// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ETHFaucet {
  uint256 public amountAllowed = 0.1 ether;
  mapping(address => bool) public requestedAddress;

  constructor() payable {
  }

  function requestEther() external {
    require(address(this).balance >= amountAllowed, "amount not enough");
    (bool sent, bytes memory data) = msg.sender.call{value: amountAllowed}("");
    require(sent, "RIP; request failed :( ");
  }

  receive() external payable {}
}
