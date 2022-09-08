// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initialSupply = ethers.utils.parseEther('100.0')

  const ETHFaucet = await hre.ethers.getContractFactory("ETHFaucet");
  const faucet = await ETHFaucet.deploy({value: initialSupply});

  await faucet.deployed();

  console.log(
    `ETHFaucet deployed to ${faucet.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
