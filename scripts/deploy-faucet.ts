import { ethers } from "hardhat";

async function main() {
  // Dirección de TU token MyToken en Base Sepolia (la que ya desplegamos)
  const myTokenAddress = "0x0EBa516262dC64647608cFCB7Cddb6afA77ab974"; 

  console.log("🏗️  Desplegando Faucet para el token:", myTokenAddress);

  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(myTokenAddress);
  await faucet.waitForDeployment();

  console.log("✅ Faucet desplegada en:", faucet.target);
  console.log("⚠️  IMPORTANTE: Ahora debes enviar tokens MTK a esta dirección para financiar la Faucet.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
