require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    polygon: {
      chainId: 137,
      blockConfirmations: 1,
      url: process.env.POLYGON_MUMBAI_RPC_URL
    },
  },
};