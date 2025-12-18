import { ethers } from "hardhat";

async function main() {
  const myTokenAddress = "0x0EBa516262dC64647608cFCB7Cddb6afA77ab974"; 

  console.log("🏦 Desplegando el Banco de Staking...");

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(myTokenAddress);
  await staking.waitForDeployment();

  console.log("✅ Banco de Staking desplegado en:", staking.target);
  console.log("⚠️  RECORDATORIO: Debes enviar MTK al contrato para pagar las recompensas.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
