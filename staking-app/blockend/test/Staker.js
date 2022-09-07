const {
  loadFixture, time
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Staker", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Example = await hre.ethers.getContractFactory("ExampleExternalContract");
    const example = await Example.deploy();
    await example.deployed();


    const Staker = await ethers.getContractFactory("Staker");
    const staker = await Staker.deploy(example.address);

    return { staker, example, owner, otherAccount };
  }

  describe("stake", function () {
    it("Should stake within deadline", async function () {
      const { staker, owner } = await loadFixture(deployContract);
      const amount = ethers.utils.parseEther("1");
      await staker.stake({value: amount});
      expect(await staker.totalAmount()).to.equal(amount);
    });
  });

  describe("execute", function () {
    it("Should stake within deadline", async function () {
      const { staker, example, owner } = await loadFixture(deployContract);
      const amount = ethers.utils.parseEther("1");
      await staker.stake({value: amount});

      await time.increaseTo(await staker.deadline());
      await await expect(staker.execute()).to.changeEtherBalances([example], [amount])
    });
  });
});
