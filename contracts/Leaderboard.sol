// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error Leaderboard__InvalidCount();

// Leader board that records user score and update ranking as well
contract Leaderboard {
    struct User {
        uint256 score;
        uint256 lastUpdated;
    }

    mapping(address => User) public users;
    address[] public leaderboard;

    function updateScore(uint256 score) external {
        User storage user = users[msg.sender];
        if (user.lastUpdated == 0) {
            leaderboard.push(msg.sender);
        }
        user.score = score;
        user.lastUpdated = block.timestamp;
        updateLeaderboard();
    }

    function updateLeaderboard() internal {
        uint256 n = leaderboard.length;
        uint256 i = n - 1;
        // if user A score is greater than user B then make user A position above user B
        // Note: as calculations are gas consumptions usually this is done on backend
        while (
            i > 0 &&
            users[leaderboard[i]].score > users[leaderboard[i - 1]].score
        ) {
            (leaderboard[i], leaderboard[i - 1]) = (
                leaderboard[i - 1],
                leaderboard[i]
            );
            i--;
        }
    }

    function getTopUsers(
        uint256 count
    ) external view returns (address[] memory, uint256[] memory) {
        if (count < 0) {
            revert Leaderboard__InvalidCount();
        }

        uint256 userCount = count;
        if (userCount > leaderboard.length) {
            userCount = leaderboard.length;
        }

        address[] memory topUsers = new address[](userCount);
        uint256[] memory topScores = new uint256[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            topUsers[i] = leaderboard[i];
            topScores[i] = users[leaderboard[i]].score;
        }

        return (topUsers, topScores);
    }

    function getUserRankAndScore(address user) external view returns (uint256, uint256) {
        uint256 rank = 0;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == user) {
                rank = i + 1;
                break;
            }
        }

        uint256 score = users[user].score;
        return (rank, score);
    }
}
