# Seeding Script: Borrowing and Repaying DAI on Lending Pool

This script demonstrates the borrowing and repaying functionality on a AAVE lending pool using the Hardhat framework and Ethereum smart contracts. It interacts with the lending pool contract to perform operations such as depositing collateral, borrowing DAI, repaying borrowed DAI, and retrieving user account data. It is a part of FreeCodeCamp solidity tutorial.

## Prerequisites

Before running the script, make sure you have the following:

- Hardhat installed and configured.
- Access to an Ethereum network with the lending pool and required token contracts deployed.
- Proper configuration of the contract addresses in the script.

## Usage

1. Install dependencies by running `npm install` or `yarn install`.
2. Configure the contract addresses and other parameters in the script.
3. Run the script using `npx hardhat run script.js` or `yarn hardhat run script.js`.
4. The script will perform the following actions:
   - Retrieve the WMATIC token.
   - Approve the lending pool to spend WMATIC.
   - Deposit WMATIC into the lending pool.
   - Retrieve available borrowing data.
   - Calculate the amount of DAI to borrow.
   - Borrow DAI from the lending pool.
   - Retrieve updated borrowing data.
   - Repay the borrowed DAI to the lending pool.
   - Retrieve final borrowing data.

## Note

Make sure to configure the lending pool address, token addresses, and other required parameters in the script to match your specific environment.

## License

This script is released under the UNLICENSED SPDX-License-Identifier.