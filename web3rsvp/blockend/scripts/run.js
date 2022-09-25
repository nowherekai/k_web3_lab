const hre = require("hardhat");

async function main() {
  const Web3RSVP = await hre.ethers.getContractFactory("Web3RSVP");
  const web3rsvp = await Web3RSVP.deploy();

  await web3rsvp.deployed();

  console.log(
    `Web3RSVP deployed to ${web3rsvp.address}`
  );

  const [deployer, address1, address2] = await hre.ethers.getSigners();
  let deposit = hre.ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = new Date();
  timestamp.setDate(timestamp.getDate() + 1);
  let eventDataCID =
      "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

  let txn = await web3rsvp.createEvent(
    timestamp.getTime(),
    deposit,
    maxCapacity,
    eventDataCID
  );
  let wait = await txn.wait();
  console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);

  let eventID = wait.events[0].args.eventID;
  console.log("EVENT ID:", eventID);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
