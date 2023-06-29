# Leaderboard and NFTAward Contracts

This repository contains the contracts for a Leaderboard and NFTAward on the Ethereum blockchain. These contracts provide functionality for tracking and displaying a leaderboard ranking and awarding NFTs to top-performing addresses.

## Contracts

### Leaderboard.sol

The `Leaderboard.sol` contract is responsible for tracking and managing the leaderboard ranking. It provides functions to update the ranking based on a score and retrieve the current leaderboard.

### NFTAward.sol

The `NFTAward.sol` contract handles the distribution of NFTs to top-performing addresses on the leaderboard. It contains functions to award NFTs to specific addresses based on their ranking.

## Getting Started

1. Clone the repository:

   ```shell
   git clone https://github.com/Arpan-pujara/NftAward.git
  ```

2. Install the necessary dependencies:

  ```shell
  yarn
  ```
3. Compile the contracts:

  ```shell
    yarn hardhat compile
  ```
4. Test the contracts:
  ```shell 
    yarn hardhat test
  ```
5. Deploy the contracts to the mumbai network
  ```shell
  yarn hardhat deploy --network polygon
  ```

