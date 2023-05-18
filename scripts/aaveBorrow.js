const { ethers } = require("hardhat");
const { getWmatic, AMOUNT } = require("./getWmatic");

async function main() {
    await getWmatic();
    const { deployer } = await getNamedAccounts();
    //lending pool address provider : 0xd05e3E715d945B59290df0ae8eF85c1BdB684744
    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending pool address: ${lendingPool.address}`);
    const wMaticTokenAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    await approveErc20(wMaticTokenAddress, lendingPool.address, AMOUNT, deployer);

    console.log("depositing...");
    await lendingPool.deposit(wMaticTokenAddress, AMOUNT, deployer, 0);
    console.log("deposited!!!");
    let { availableBorrowMatic, totalDebtMatic } = await getBorrowUserData(lendingPool, deployer);
    const daiAmountForOneMatic = await getDaiPrice();
    const amountDaiToBorrow = (availableBorrowMatic.toString() * 0.95 * (1 / daiAmountForOneMatic)).toFixed(8);
    console.log({ amountDaiToBorrow });
    const amountDaiToBorrowWei = ethers.utils.parseEther(`${amountDaiToBorrow}`);
    const daiTokenAddress = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";
    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer);
    await getBorrowUserData(lendingPool, deployer);

    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer);
    await getBorrowUserData(lendingPool, deployer);
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account);
    const repayTx = await lendingPool.repay(daiAddress, amount, 2, account);
    await repayTx.wait();
    console.log("repayed");
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrowWei, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowWei, 2, 0, account);
    await borrowTx.wait();
    console.log(`Successfully borrowed`);
}
async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH: totalColleteralMatic,
        totalDebtETH: totalDebtMatic,
        availableBorrowsETH: availableBorrowMatic,
    } = await lendingPool.getUserAccountData(account);

    console.log(`You have ${totalColleteralMatic} worth of Matic deposited.`);
    console.log(` You have ${totalDebtMatic} worth of Matic borrowed`);
    console.log(` You can borrow ${availableBorrowMatic} worth of Matic`);
    return { availableBorrowMatic, totalDebtMatic };
}

async function getDaiPrice() {
    //matic -> usd 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
    //dai -> usd 0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D
    const maticUsdPrice = await ethers.getContractAt("AggregatorV3Interface", "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0");
    const daiUsdPrice = await ethers.getContractAt("AggregatorV3Interface", "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D");
    const maticPrice = (await maticUsdPrice.latestRoundData())[1]; // $0.50
    const daiPrice = (await daiUsdPrice.latestRoundData())[1]; // $0.10
    console.log(
        `The MATIC/USD price is ${maticPrice.toString()}. \nThe DAI/USD price is ${daiPrice.toString()} \n1 MATIC costs ${(
            Number(maticPrice) / Number(daiPrice)
        ).toFixed(4)} DAI. `
    );
    return ethers.utils.parseEther((Number(maticPrice) / Number(daiPrice)).toFixed(4));
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", "0xd05e3E715d945B59290df0ae8eF85c1BdB684744", account);
    const address = await lendingPoolAddressesProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt("ILendingPool", address, account);
    return lendingPool;
}

async function approveErc20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account);
    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    await tx.wait();
    console.log("tokens approved");
}
main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
