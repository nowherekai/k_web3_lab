// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ExampleExternalContract.sol";

contract Staker {
  ExampleExternalContract public exampleExternalContract;

  mapping(address => uint) balances;
  uint public totalAmount;
  bool private completed;

  uint256 public constant threshold = 1 ether;
  uint256 public deadline = block.timestamp + 3 minutes;

  constructor(address exampleExternalContractAddress) {
    exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  //Collect funds
  function stake() external payable {
    require(block.timestamp <= deadline, "deadline passed");

    balances[msg.sender] += msg.value;
    totalAmount += msg.value;
  }

  function balanceOf(address account) public view returns (uint) {
    return balances[account];
  }

  function timeLeft() external view returns (uint) {
    if (block.timestamp > deadline) {
      return 0;
    }

    return deadline - block.timestamp;
  }


  function execute() external {
    require(!completed, "already complete");
    require(block.timestamp >= deadline, "deadline not passed");
    require(totalAmount >= threshold, "threadhold not meet");

    exampleExternalContract.complete{value: totalAmount}();
    completed = true;
  }

  function withDraw() external {
    require(!completed, "only withdraw if not complete");
    uint amount = balances[msg.sender];
    require(amount > 0, "You have no balance to withdraw");

    (bool sent, bytes memory data) = msg.sender.call{value: amount}("");
    require(sent, "RIP; withdrawal failed :( ");
  }

}
