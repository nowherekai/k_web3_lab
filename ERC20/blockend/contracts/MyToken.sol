// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract MyToken {
  string public symbol = "MT";
  string public name = "My Token";

  address public owner;

  mapping(address => uint256) private _balances;
  uint256 public totalSupply;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "only allow owner");
    _;
  }

  function _mint(address to, uint256 amount) onlyOwner internal {
    _balances[to] += amount;
    totalSupply += amount;
  }

  function mint(address to, uint256 amount) onlyOwner public {
    _mint(to, amount);
  }

  function balanceOf(address target) public view returns (uint256 amount) {
    return _balances[target];
  }

  function transfer(address to, uint256 amount) external {
    address from = msg.sender;
    require(_balances[from] >= amount, "Not enough");

    _balances[to] += amount;
    _balances[from] -= amount;
  }
}
