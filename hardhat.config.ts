import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // You can define settings for the local Hardhat network here
    },
    // base_sepolia: {
    //   url: "https://sepolia.base.org", // Example URL for Base Sepolia
    //   accounts: ["YOUR_PRIVATE_KEY_HERE"] // Replace with your private key for testing
    // }
  },
  etherscan: {
    apiKey: {
      // base_sepolia: "YOUR_BASESCAN_API_KEY", // Replace with your BaseScan API key
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;