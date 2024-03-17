import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    //   // for mainnet
    //   "base-mainnet": {
    //     url: 'https://mainnet.base.org',
    //     accounts: [PRIVATE_KEY as string],
    //     gasPrice: 1000000000,
    //   },
    //   // for Sepolia testnet
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
    //   // for local dev environment
    //   "base-local": {
    //     url: "http://localhost:8545",
    //     accounts: [PRIVATE_KEY as string],
    //     gasPrice: 1000000000,
    //   },
  },
  defaultNetwork: "base-sepolia",
};

export default config;
