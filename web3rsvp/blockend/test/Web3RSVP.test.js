const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Web3RSVP", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Web3RSVP = await ethers.getContractFactory("Web3RSVP");
    const web3rsvp = await Web3RSVP.deploy();

    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 1);
    const deposit = ethers.utils.parseEther("1")

    await web3rsvp.createEvent(
      startTime.getTime(),
      deposit,
      3,
      ""
    )
    const web3Event = await web3rsvp.idToEvent(1)

    return { web3rsvp, owner, otherAccount, startTime, web3Event, deposit };
  }

  describe("createEvent", function () {
    it("Should create event", async function () {
      const { web3rsvp, owner, startTime, web3Event } = await loadFixture(deployContract);

      expect(web3Event.creator).to.equal(owner.address)
      expect(web3Event.startTime).to.equal(startTime.getTime())
    });
  });

  describe("createRSVP", function () {
    it("Should not create duplicate RSVP", async function () {
      const { web3rsvp, otherAccount, startTime, web3Event } = await loadFixture(deployContract);
      await web3rsvp.connect(otherAccount).createRSVP(web3Event.eventId, {value: web3Event.deposit});
      await expect(web3rsvp.connect(otherAccount).createRSVP(web3Event.eventId, {value: web3Event.deposit})).to.revertedWith("ALREADY CONFIRMED");
    });
  });

  describe("confirmAttendee", function () {
    it("Should confrim attendee", async function () {
      const { web3rsvp, otherAccount, startTime, web3Event } = await loadFixture(deployContract);
      await web3rsvp.connect(otherAccount).createRSVP(web3Event.eventId, {value: web3Event.deposit});
      await web3rsvp.confirmAttendee(web3Event.eventId, otherAccount.address);
      const claimedRSVPs = await web3rsvp.claimedRSVPs(web3Event.eventId);
      expect(claimedRSVPs.includes(otherAccount.address)).to.eq(true);
    });
  });
});
