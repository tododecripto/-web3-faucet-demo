import { ethers } from "hardhat";

async function main() {
  // 1. OBTENER LAS CUENTAS (WALLETS)
  const [deployer, friend] = await ethers.getSigners();

  console.log("----------------------------------------------------\n");
  console.log("👋 ¡Hola, Profesor Cripto!");
  console.log(`👛 Tu dirección de billetera simulada es: ${deployer.address}`);
  console.log("----------------------------------------------------\n");

  // 2. DESPLEGAR EL CONTRATO
  console.log("\n🏗️  Desplegando tu contrato MyToken...");
  const initialSupply = ethers.parseEther("1000"); 
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();

  console.log(`✅ ¡Contrato desplegado en la dirección: ${myToken.target}!`);
  console.log("----------------------------------------------------\n");

  // 3. CONSULTAR DATOS DEL TOKEN
  const name = await myToken.name();
  const symbol = await myToken.symbol();
  console.log(`\n🔎 Inspeccionando el token:`);
  console.log(`   Nombre: ${name}`);
  console.log(`   Símbolo: ${symbol}`);

  // 4. CONSULTAR TU SALDO
  let myBalance = await myToken.balanceOf(deployer.address);
  console.log(`\n💰 Tu saldo inicial: ${ethers.formatEther(myBalance)} ${symbol}`);

  // 5. HACER UNA TRANSFERENCIA
  const amountToSend = ethers.parseEther("50");
  console.log(`\n💸 Enviando 50 ${symbol} a tu amigo (${friend.address})...`);
  
  const tx = await myToken.transfer(friend.address, amountToSend);
  await tx.wait(); 
  console.log("✅ ¡Transacción confirmada!");

  // 6. VERIFICAR NUEVOS SALDOS
  myBalance = await myToken.balanceOf(deployer.address);
  const friendBalance = await myToken.balanceOf(friend.address);

  console.log("\n📊 Saldos actualizados:");
  console.log(`   Tu saldo:    ${ethers.formatEther(myBalance)} ${symbol}`);
  console.log(`   Saldo amigo: ${ethers.formatEther(friendBalance)} ${symbol}`);
  console.log("----------------------------------------------------\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});