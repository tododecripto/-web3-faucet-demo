import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ethers } from "hardhat";
import "dotenv/config"; // Import dotenv

// Helper function to get contract instance
async function getMyTokenContract(hre: any, contractAddress: string) {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  return MyToken.attach(contractAddress);
}

// Task para ver el saldo de una dirección específica en un contrato específico
task("check-balance", "Prints the balance of a given account on a specific token contract")
  .addParam("contract", "The address of the MyToken contract")
  .addParam("account", "The address of the account to check the balance of")
  .setAction(async (taskArgs, hre) => {
    const myToken = await getMyTokenContract(hre, taskArgs.contract);
    const balance = await myToken.balanceOf(taskArgs.account);
    const symbol = await myToken.symbol();
    console.log(`El saldo de ${taskArgs.account} es: ${hre.ethers.formatEther(balance)} ${symbol}`);
  });

// Task para transferir tokens desde el deployer a otra dirección en un contrato específico
task("transfer-tokens", "Transfers tokens from deployer to another address on a specific token contract")
  .addParam("contract", "The address of the MyToken contract")
  .addParam("to", "The recipient's address")
  .addParam("amount", "The amount of tokens to transfer")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const myToken = await getMyTokenContract(hre, taskArgs.contract);
    
    const amount = hre.ethers.parseEther(taskArgs.amount);
    const symbol = await myToken.symbol();

    console.log(`Intentando transferir ${taskArgs.amount} ${symbol} a ${taskArgs.to} desde ${deployer.address}`);
    
    // Obtener el balance del deployer antes de la transferencia
    const deployerBalanceBefore = await myToken.balanceOf(deployer.address);
    if (deployerBalanceBefore < amount) {
        console.error(`Error: Fondos insuficientes. Saldo actual: ${hre.ethers.formatEther(deployerBalanceBefore)} ${symbol}`);
        return;
    }

    const tx = await myToken.transfer(taskArgs.to, amount);
    await tx.wait();
    console.log("¡Transferencia exitosa!");

    const deployerBalance = await myToken.balanceOf(deployer.address);
    const recipientBalance = await myToken.balanceOf(taskArgs.to);
    console.log(`Nuevo saldo (deployer): ${hre.ethers.formatEther(deployerBalance)} ${symbol}`);
    console.log(`Nuevo saldo (receptor): ${hre.ethers.formatEther(recipientBalance)} ${symbol}`);
  });


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // You can define settings for the local Hardhat network here
    },
    base_sepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      base_sepolia: process.env.BASESCAN_API_KEY || "", // Optional: for contract verification
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;