const { network } = require("hardhat");

const developmentChains = ["hardhat", "localhost"];

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("###########", deployer);

  log("----------------------------------------------------");
  log("Deploying Leaderboard and waiting for confirmations...");
  const leaderboard = await deploy("Leaderboard", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: 1,
  });

  log("----------------------------------------------------");
  log("Deploying NFTAwards and waiting for confirmations...");

  // Deploy NFTAwards contract
  const NFTAwards = await deploy("NFTAwards", {
    from: deployer,
    args: [leaderboard.address, 10],
    log: true,
    waitConfirmations: 1,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(leaderboard.address, []);
    await verify(NFTAwards.address, [leaderboard.address, 10]);
  }

  log("----------------------------------------------------");
};
