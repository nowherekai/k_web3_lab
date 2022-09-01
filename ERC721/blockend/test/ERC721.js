const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("ERC721", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC721 = await ethers.getContractFactory("ERC721");
    const erc721 = await ERC721.deploy("test", "test");

    return { erc721, owner, otherAccount };
  }

  describe("deployment", function () {
    it("should has correct name and symbol", async function() {
      const { erc721, owner } = await loadFixture(deployContract);
      expect(await erc721.name()).to.equal("test");
      expect(await erc721.symbol()).to.equal("test");
    })
  })

  describe("mintTo", function() {
    it("should mint token with increment id", async function() {
      const { erc721, owner, otherAccount } = await loadFixture(deployContract);
      await erc721.mintTo(otherAccount.address);
      await erc721.mintTo(owner.address);

      expect(await erc721.ownerOf(1)).to.equal(otherAccount.address);
      expect(await erc721.ownerOf(2)).to.equal(owner.address);
    })
  })

  describe("transferFrom", function() {
    it("should not transfer token if not owner", async function() {
      const { erc721, owner, otherAccount } = await loadFixture(deployContract);
      await erc721.mintTo(otherAccount.address);

      await expect(erc721.transferFrom(owner.address, otherAccount.address, 1))
        .to.be.revertedWith("not token owner");
    })

    it("should transfer token", async function() {
      const { erc721, owner, otherAccount } = await loadFixture(deployContract);
      await erc721.mintTo(owner.address);

      await expect(
        erc721.transferFrom(owner.address, otherAccount.address, 1)
      ).to.changeTokenBalances(erc721, [owner, otherAccount], [-1, 1]);

      expect(await erc721.ownerOf(1)).to.equal(otherAccount.address);
    })
  })
})
