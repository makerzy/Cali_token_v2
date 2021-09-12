const chai = require("chai");
const { BigNumber, Contract, constants, utils } = require("ethers");
const {
  solidity,
  MockProvider,
  createFixtureLoader,
  deployContract,
} = require("ethereum-waffle");
const { ecsign } = require("ethereumjs-util");
const {
  mineBlock,

  expandTo18Decimals,
  toBigNumber,
  DELAY,
} = require("../utils/utils");
const {
  expandToEthers,
  subNumbers,
  addNumbers,
  toBNumber,
} = require("../utils/mathHelp");
const {
  takeSnapshot,
  advanceTime,
  revertTime,
} = require("../utils/time-trave");
const { doesNotMatch } = require("assert");
const { expect } = chai;
chai.use(solidity);
const provider = new MockProvider({
  ganacheOptions: {
    hardfork: "istanbul",
    mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
    gasLimit: 9999999,
  },
});
const overrides = {
  gasLimit: 9999999,
};
const duration = toBigNumber("30"); // 60*60*24*60 or two months
const max_cap = expandTo18Decimals("100");
const [wallet, other0, other1] = provider.getWallets();
let caliToken, caliStaking, caliLP;
beforeEach(async () => {
  const Cali = await ethers.getContractFactory("Cali_V2", wallet);
  caliToken = await Cali.deploy();
  const CaliLP = await ethers.getContractFactory("Cali_V2", wallet);
  caliLP = await CaliLP.deploy();
  const CaliStaking = await ethers.getContractFactory("CaliBnbStaking", wallet);
  caliStaking = await CaliStaking.deploy(caliToken.address, caliLP.address);
  await caliToken.addStakingContract(caliStaking.address, overrides);
  expect(await caliToken.owner()).to.equal(wallet.address);
  expect(await caliStaking.owner()).to.equal(wallet.address);
});

const getCurrentDate = () => {
  const date = Math.floor(Date.now() / 1000);
  console.log("Date: ", date);
  return date;
};

describe("Cali Staking 2", () => {
  // it("deploy", async () => {
  //   const rwd = await caliStaking.rewardRate();
  //   const period = await caliStaking.periodFinish();
  //   const calculated = toBigNumber(getCurrentDate()).add(
  //     toBigNumber(86400).mul(60),
  //   );
  //   expect(rwd).to.be.gt(toBigNumber(0));
  //   console.log("reward: ", rwd.toString());
  //   console.log("time: ", period.toString(), calculated.toString());
  //   expect(period).to.be.lte(calculated);
  // });
  // it("allows staking", async () => {
  //   await caliLP.transfer(other0.address, expandTo18Decimals(5000), overrides);
  //   const initialPeriod = await caliStaking.periodFinish();
  //   await caliLP
  //     .connect(other0)
  //     .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
  //   await caliStaking
  //     .connect(other0)
  //     .deposit(expandTo18Decimals(500), overrides);

  //   const period = await caliStaking.periodFinish();
  //   console.log("time: ", period.toString(), initialPeriod.toString());
  //   expect(period).to.be.gt(initialPeriod);
  //   const user = await caliStaking.getUser(other0.address);
  //   const balance = await caliLP.balanceOf(caliStaking.address);
  //   expect(user.amount).to.be.equal(expandTo18Decimals(500));
  //   expect(balance).to.be.equal(expandTo18Decimals(500));
  // });
  // it("allow withdrawal", async () => {
  //   await caliLP.transfer(other0.address, expandTo18Decimals(5000), overrides);
  //   await caliLP
  //     .connect(other0)
  //     .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
  //   await caliStaking
  //     .connect(other0)
  //     .deposit(expandTo18Decimals(500), overrides);
  //   const user = await caliStaking.getUser(other0.address);
  //   const balance = await caliLP.balanceOf(caliStaking.address);
  //   expect(user.amount).to.be.equal(expandTo18Decimals(500));
  //   expect(balance).to.be.equal(expandTo18Decimals(500));
  //   await caliStaking
  //     .connect(other0)
  //     .withdraw(expandTo18Decimals(500), overrides);
  //   const newBalance = await caliLP.balanceOf(caliStaking.address);
  //   console.log("New Balance: ", newBalance.toString());
  //   const userStat = await caliStaking.getUser(other0.address);
  //   expect(newBalance).to.be.equal(toBigNumber(0));
  //   expect(userStat.amount).to.be.equal(toBigNumber(0));
  // });
  // it("get pending rewards", async () => {
  //   await caliLP.transfer(other0.address, expandTo18Decimals(5000), overrides);
  //   await caliLP
  //     .connect(other0)
  //     .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
  //   await caliStaking
  //     .connect(other0)
  //     .deposit(expandTo18Decimals(500), overrides);
  //   await takeSnapshot(provider);
  //   await advanceTime(provider, 17800);
  //   const rwd = await caliStaking.rewardRate();
  //   const total = rwd.mul(17801);
  //   console.log("total rwd: ", total.toString());
  //   const pending = await caliStaking.pendingCali(other0.address);
  //   await expect(caliStaking.connect(other0).claim(overrides)).to.emit(
  //     caliStaking,
  //     "RewardPaid",
  //   );
  //   const userStats = await caliStaking.getUser(other0.address);
  //   expect(pending).to.be.gte(userStats.rewardPerTokenPaid);
  //   console.log(
  //     "User RewardsPaid: ",
  //     userStats.rewardPerTokenPaid.toString(),
  //     "User Rewards: ",
  //     userStats.rewards.toString(),
  //   );
  // });
  // it("stop reward at period finish and revert deposit", async () => {
  //   await caliLP.transfer(other0.address, expandTo18Decimals(5000), overrides);
  //   await caliLP
  //     .connect(other0)
  //     .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
  //   await caliStaking
  //     .connect(other0)
  //     .deposit(expandTo18Decimals(500), overrides);
  //   await takeSnapshot(provider);
  //   await advanceTime(provider, 5_184_001);
  //   await caliStaking.connect(other0).claim(overrides);
  //   expect(await caliStaking.pendingCali(other0.address)).to.equal(
  //     toBigNumber(0),
  //   );
  // });
  it("stop reward at period finish and revert deposit", async () => {
    await caliLP.transfer(other0.address, expandTo18Decimals(5000), overrides);
    await caliLP
      .connect(other0)
      .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
    await caliStaking
      .connect(other0)
      .deposit(expandTo18Decimals(500), overrides);
    await caliLP.transfer(other1.address, expandTo18Decimals(5000), overrides);
    await caliLP
      .connect(other1)
      .approve(caliStaking.address, expandTo18Decimals(5000), overrides);
    await caliStaking
      .connect(other1)
      .deposit(expandTo18Decimals(500), overrides);
    await takeSnapshot(provider);
    await advanceTime(provider, 5_184_001);
    await expect(caliStaking.connect(other0).claim(overrides)).to.emit(
      caliStaking,
      "RewardPaid",
    );
    expect(await caliStaking.pendingCali(other0.address)).to.equal(
      toBigNumber(0),
    );
    await expect(caliStaking.connect(other1).claim(overrides)).to.emit(
      caliStaking,
      "RewardPaid",
    );
    expect(await caliStaking.pendingCali(other1.address)).to.equal(
      toBigNumber(0),
    );
    expect(await caliStaking.totalMinted()).to.be.lte(
      expandTo18Decimals(5_000_000),
    );
  });
});
