const { ethers } = require("hardhat");

const getUserRankAndScore = async(userAddress) => {
  const provider = ethers.getDefaultProvider();
  const leaderboardContract = await ethers.getContractAt("Leaderboard", "0x0BE9C8A1eC1E2f1baC5Dc90bE1ab8445305DceC0", provider);
  const [rank, score] = await leaderboardContract.getUserRankAndScore(userAddress);
  console.log("Rank:", rank);
  console.log("Score:", score);
}

const fetchUserNFTs = async(contractAddress, userAddress) => {
  // Get the provider and connect to the deployed contract
  const provider = ethers.getDefaultProvider();
  const contract = await ethers.getContractAt("NFTAwards", "0xb321131f7bF79d674Ad73f53F81253fbF7246955", provider);

  // Call the getUserNFT function on the contract
  const tokenIds = await contract.getUserNFT(userAddress);

  return tokenIds;
}

// Replace <USER_ADDRESS> with the actual user  address
getUserRankAndScore("<USER_ADDRESS>");