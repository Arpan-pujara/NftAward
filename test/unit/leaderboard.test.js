const { expect } = require("chai");

describe("Leaderboard", function () {
  let leaderboard;
  let user1, user2, user3;

  beforeEach(async function () {
    const Leaderboard = await ethers.getContractFactory("Leaderboard");
    leaderboard = await Leaderboard.deploy();
    await leaderboard.deployed();

    [user1, user2, user3] = await ethers.getSigners();
  });

  it("should update the score and leaderboard correctly", async function () {
    await leaderboard.connect(user1).updateScore(100);
    await leaderboard.connect(user2).updateScore(200);
    await leaderboard.connect(user3).updateScore(300);

    let topUsers = await leaderboard.getTopUsers(3);
    topUsers = topUsers[0];

    expect(topUsers[0]).to.equal(user3.address); // Highest score
    expect(topUsers[1]).to.equal(user2.address); // Second highest score
    expect(topUsers[2]).to.equal(user1.address); // Third highest score
  });
  it("should return correct rank and score of a user", async function () {
    await leaderboard.connect(user1).updateScore(100);
    await leaderboard.connect(user2).updateScore(200);
    await leaderboard.connect(user3).updateScore(300);
    const [rank1, score1] = await leaderboard.getUserRankAndScore(user1.address);
    expect(rank1).to.equal(3); // User1 should be ranked 3rd based on score
    expect(score1).to.equal(100); // User1's score should be 10

    const [rank2, score2] = await leaderboard.getUserRankAndScore(user2.address);
    expect(rank2).to.equal(2); // User2 should be ranked 2nd based on score
    expect(score2).to.equal(200); // User2's score should be 20

    const [rank3, score3] = await leaderboard.getUserRankAndScore(user3.address);
    expect(rank3).to.equal(1); // User3 should be ranked 1st based on score
    expect(score3).to.equal(300); // User3's score should be 30
  });
});
