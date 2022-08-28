const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("MyToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const mytoken = await MyToken.deploy();

    const amount = ethers.utils.parseEther("1");

    return { mytoken, owner, otherAccount, amount };
  }

  describe("deployment", function () {
    it("should set right owner", async function() {
      const { mytoken, owner } = await loadFixture(deployContract);
      expect(await mytoken.owner()).to.equal(owner.address);
    })
  })

  describe("mint", function() {
    it("should only allow owner to mint", async function() {
      const { mytoken, owner, otherAccount } = await loadFixture(deployContract);
      await expect(mytoken.connect(otherAccount).mint(otherAccount.address, 10000)).to.be.revertedWith("only allow owner");
    })

    it("should mint to target with right amount", async function() {
      const { mytoken, owner, otherAccount } = await loadFixture(deployContract);
      const amount = ethers.utils.parseEther("1");
      await mytoken.mint(otherAccount.address, amount);
      expect(await mytoken.totalSupply()).to.equal(amount);
      expect(await mytoken.balanceOf(otherAccount.address)).to.equal(amount);
    })
  })

  describe("transfer", function() {
    it("should have enough amount", async function() {
      const { mytoken, owner, otherAccount, amount } = await loadFixture(deployContract);

      await mytoken.mint(otherAccount.address, amount);
    })

    it("should mint to target with right amount", async function() {
      const { mytoken, owner, otherAccount, amount } = await loadFixture(deployContract);
      await expect(mytoken.transfer(otherAccount.address, amount)).to.be.revertedWith("Not enough");

      await mytoken.mint(owner.address, amount);
      await expect(mytoken.transfer(otherAccount.address, amount + 1)).to.be.revertedWith("Not enough");
    })

    it("should work", async function() {
      const { mytoken, owner, otherAccount, amount } = await loadFixture(deployContract);
      await mytoken.mint(owner.address, amount);
      await expect(
        mytoken.transfer(otherAccount.address, 50)
      ).to.changeTokenBalances(mytoken, [owner, otherAccount], [-50, 50]);
    })

  })

})
