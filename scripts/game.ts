import { ethers } from "hardhat";
import * as readline from "readline";

async function main() {
  const [deployer, friend] = await ethers.getSigners();
  const initialSupply = ethers.parseEther("1000"); 
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();

  const symbol = await myToken.symbol();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.clear();
  console.log("🎮 ¡Bienvenido a la Consola de Mando de tu Token! 🎮");
  console.log(`✅ Token desplegado en: ${myToken.target}`);
  console.log(`👤 Tu cuenta (Dueño): ${deployer.address}`);
  console.log(`👤 Cuenta Amigo:     ${friend.address}`);
  console.log("---------------------------------------------------- ");

  const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  let keepPlaying = true;

  while (keepPlaying) {
    console.log("\n¿Qué quieres hacer?");
    console.log("1. 💰 Ver mi saldo");
    console.log("2. 💸 Transferir tokens al Amigo");
    console.log("3. ❌ Salir");

    const answer = await askQuestion("Elige una opción (1-3): ");

    if (answer === "1") {
      const balance = await myToken.balanceOf(deployer.address);
      console.log(`\n💎 Tienes: ${ethers.formatEther(balance)} ${symbol}`);
    } 
    else if (answer === "2") {
      const amountStr = await askQuestion(`\n¿Cuántos ${symbol} quieres enviar? `);
      try {
        const amount = ethers.parseEther(amountStr);
        console.log("Enviando...");
        const tx = await myToken.transfer(friend.address, amount);
        await tx.wait();
        console.log("✅ ¡Transferencia exitosa!");
        
        const friendBalance = await myToken.balanceOf(friend.address);
        console.log(`Ahora tu amigo tiene: ${ethers.formatEther(friendBalance)} ${symbol}`);
      } catch (error) {
        console.log("❌ Error: Cantidad inválida o fondos insuficientes.");
      }
    } 
    else if (answer === "3") {
      console.log("¡Adiós, Profesor Cripto!");
      keepPlaying = false;
    } 
    else {
      console.log("Opción no válida.");
    }
    console.log("---------------------------------------------------- ");
  }

  rl.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
