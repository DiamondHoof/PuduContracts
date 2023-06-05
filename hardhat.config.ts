import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        count: 1000
      }
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
         process.env["DEPLOYER_WALLET"]!,
      ],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 3000000000,
      accounts: [
        process.env["DEPLOYER_WALLET"]!
      ],
    },
    localhost: {
      url: "http://localhost:7545",
      chainId: 1337,
      gasPrice: 20000000000,
      accounts: [
        process.env["LOCALHOST_DEPLOYER_WALLET"]!,
      ]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // @ts-ignore
  etherscan: {
    apiKey: {
      bsc: process.env["ETHERSCAN_API_KEY"],
    },
  },
};

export default config;
