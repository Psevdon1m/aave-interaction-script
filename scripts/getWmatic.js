const { getNamedAccounts } = require("hardhat");

//wbnb address: 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
const AMOUNT = ethers.utils.parseEther("0.1");
async function getWmatic() {
    const { deployer } = await getNamedAccounts();
    const iWmatic = await ethers.getContractAt("IWmatic", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", deployer);
    const tx = await iWmatic.deposit({ value: AMOUNT });
    await tx.wait();
    const wMaticBalance = await iWmatic.balanceOf(deployer);
    console.log(`My wMatic balance: `, wMaticBalance.toString());
}

module.exports = {
    getWmatic,
    AMOUNT,
};
