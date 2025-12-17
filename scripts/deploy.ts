import { ethers } from "hardhat";

async function main() {
  const initialSupply = ethers.parseEther("1000"); // 1000 tokens with 18 decimals

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);

  await myToken.waitForDeployment();

  console.log(`MyToken deployed to ${myToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
