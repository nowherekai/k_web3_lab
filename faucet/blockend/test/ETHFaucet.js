const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("ETHFaucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    const initialSupply = ethers.utils.parseEther('10.0')
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ETHFaucet = await ethers.getContractFactory("ETHFaucet");
    const faucet = await ETHFaucet.deploy({value: initialSupply});

    return { faucet, initialSupply, owner, otherAccount };
  }

  describe("requestEther", function () {
    it("Should sent right amount", async function () {
      const { faucet, otherAccount } = await loadFixture(deployContract);
      await expect(faucet.connect(otherAccount).requestEther()).to.changeEtherBalance(otherAccount, ethers.utils.parseEther("0.1"))
    });
  });
});
