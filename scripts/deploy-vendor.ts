import { ethers } from "hardhat";

async function main() {
  // Dirección de TU token MyToken en Base Sepolia
  const myTokenAddress = "0x0EBa516262dC64647608cFCB7Cddb6afA77ab974"; 

  console.log("🏪 Desplegando la Tiendita (Vendor)...");

  const Vendor = await ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(myTokenAddress);
  await vendor.waitForDeployment();

  console.log("✅ Tiendita desplegada en:", vendor.target);
  console.log("⚠️  RECORDATORIO: Debes enviar MTK a esta dirección para que tenga inventario.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
