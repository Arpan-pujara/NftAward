// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Leaderboard} from "./Leaderboard.sol";

error NFTAwards__OnlyOncePerMonth(uint256, uint256);
error NFTAwards__NoUserToAwarded();

contract NFTAwards is ERC721 {
    // Leader Board contracts will gave Top performers
    Leaderboard private leaderboardContract;
    // According to criteria monthly award count will be choosen eg 10 awards need to be given in a month then monthlyAwardsCount will be 10
    uint256 private monthlyAwardsCount;
    uint256 private awardTimestamp;
    uint256 private counter;

    mapping(address => bool) private alreadyAwarded;

    constructor(
        address _leaderboardContractAddress,
        uint256 _monthlyAwardsCount
    ) ERC721("NFT Awards", "NFTA") {
        leaderboardContract = Leaderboard(_leaderboardContractAddress);
        monthlyAwardsCount = _monthlyAwardsCount;
        // after first award it can only be triggerd after 30 days
        awardTimestamp = 0;
    }

    function awardNFTs() external {
        if (block.timestamp <= awardTimestamp + 30 days) {
            revert NFTAwards__OnlyOncePerMonth(
                block.timestamp,
                awardTimestamp + 30 days
            );
        }

        address[] memory topUsers;

        // Get Top n number of players from leaderBoard
        (topUsers, ) = leaderboardContract.getTopUsers(monthlyAwardsCount);

        if (topUsers.length == 0) {
            revert NFTAwards__NoUserToAwarded();
        }

        for (uint256 i = 0; i < topUsers.length; i++) {
            address userAddress = topUsers[i];

            // Mint NFT Award to user
            _mint(userAddress, counter);
            counter++;
        }

        awardTimestamp = block.timestamp;
    }

    function getUserNFT(address user) external view returns (uint256[] memory) {

        uint256[] memory tokenIds = new uint256[](balanceOf(user));
        uint256 tokenIdCounter = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (ownerOf(i) == user) {
                tokenIds[tokenIdCounter] = i;
                tokenIdCounter++;
            }
        }

        return tokenIds;
    }
}
