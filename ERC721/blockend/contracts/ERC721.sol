// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract ERC721 {
  using Strings for uint256;

  //nft id to owner address
  mapping(uint256 => address) private _ownerOf;
  mapping(address => uint256) private _balances;

  uint256 private currentItemId;

  string public name;
  string public symbol;

  constructor(string memory _name, string memory _symbol) {
    name = _name;
    symbol = _symbol;
  }

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }

  function ownerOf(uint id) public view returns (address) {
    require(id <= currentItemId && id > 0, "item id not present");
    return _ownerOf[id];
  }

  function _mint(uint256 id, address to) internal {
    _ownerOf[id] = to;
    _balances[to] += 1;
  }

  //free mint
  function mintTo(address to) external {
    currentItemId += 1;
    _mint(currentItemId, to);
  }

  function transferFrom(address from, address to, uint256 tokenId) external {
    require(msg.sender == from, "not token owner");
    require(ownerOf(tokenId) == from, "not token owner");

    _ownerOf[tokenId] = to;
    _balances[from] -= 1;
    _balances[to] += 1;
  }

  //generate onchain meta-data nft

  function getTextOf(uint256 tokenId) internal pure returns (string memory) {
    return tokenId.toString();
  }

  function generateSvg(uint256 tokenId) public pure returns (string memory) {
    return string.concat('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">'
                         '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>'
                         '<rect width="100%" height="100%" fill="black" />'
                         '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle"># ',
                         getTextOf(tokenId),
                         '</text></svg>');
  }

  function generateSvgBase64(uint256 tokenId) public pure returns (string memory) {
    return Base64.encode(abi.encodePacked(generateSvg(tokenId)));
  }

  function generateInlineSvg(uint256 tokenId) public pure returns (string memory) {
    return string.concat('data:image/svg+xml;base64,', generateSvgBase64(tokenId));
  }

  function generateMetadata(uint256 tokenId) public pure returns (string memory) {
    return string.concat('{',
                         '"name": "Badge #',
                         tokenId.toString(),
                         '",',
                         '"description": "onchain nft",',
                         '"image": "', generateInlineSvg(tokenId), '"',
                         '}'
                        );
  }

  function tokenURI(uint256 tokenId) public pure returns (string memory) {
    return string.concat("data:application/json;base64,", Base64.encode(bytes(generateMetadata(tokenId))));
  }
}
