const { expect } = require("chai");

describe("NFTAwards", function () {
  let leaderboardContract;
  let nftAwardsContract;
  let user1, user2, user3;

  beforeEach(async function () {
    const Leaderboard = await ethers.getContractFactory("Leaderboard");
    leaderboardContract = await Leaderboard.deploy();
    await leaderboardContract.deployed();

    const NFTAwards = await ethers.getContractFactory("NFTAwards");
    nftAwardsContract = await NFTAwards.deploy(
      leaderboardContract.address,
      10 // monthlyAwardsCount
    );
    await nftAwardsContract.deployed();

    [user1, user2, user3] = await ethers.getSigners();
  });

  it("should award NFTs to top users", async function () {
    // Set up leaderboard with user scores
    await leaderboardContract.connect(user1).updateScore(100);
    await leaderboardContract.connect(user2).updateScore(200);
    await leaderboardContract.connect(user3).updateScore(300);

    // Call awardNFTs
    await expect(nftAwardsContract.awardNFTs())
      .to.emit(nftAwardsContract, "Transfer")
      .withArgs(
        ethers.constants.AddressZero, // From address is 0x0
        user3.address, // To address is the top user
        0 // Token ID
      );

    // Verify that the NFT was awarded to the top user
    const owner = await nftAwardsContract.ownerOf(0);
    expect(owner).to.equal(user3.address);
  });

  it("should revert if awarding is triggered before 30 days", async function () {
    await leaderboardContract.connect(user1).updateScore(100);
    // Call awardNFTs for the first time
    await nftAwardsContract.awardNFTs();

    // Call awardNFTs again before 30 days have passed
    await expect(nftAwardsContract.awardNFTs()).to.be.revertedWith(
      "NFTAwards__OnlyOncePerMonth"
    );
  });

  it("should revert if no users to award", async function () {
    // Call awardNFTs without any users in the leaderboard
    await expect(nftAwardsContract.awardNFTs()).to.be.revertedWith(
      "NFTAwards__NoUserToAwarded"
    );
  });
});
