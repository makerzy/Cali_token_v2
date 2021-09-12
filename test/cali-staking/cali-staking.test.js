// const chai = require("chai");
// const { BigNumber, Contract, constants, utils } = require("ethers");
// const {
//   solidity,
//   MockProvider,
//   createFixtureLoader,
//   deployContract,
// } = require("ethereum-waffle");
// const { ecsign } = require("ethereumjs-util");
// const {
//   mineBlock,

//   expandTo18Decimals,
//   toBigNumber,
//   DELAY,
// } = require("../utils/utils");
// const {
//   expandToEthers,
//   subNumbers,
//   addNumbers,
//   toBNumber,
// } = require("../utils/mathHelp");
// const {
//   takeSnapshot,
//   advanceTime,
//   revertTime,
// } = require("../utils/time-trave");
// const { doesNotMatch } = require("assert");
// const { expect } = chai;
// chai.use(solidity);
// const provider = new MockProvider({
//   ganacheOptions: {
//     hardfork: "istanbul",
//     mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
//     gasLimit: 9999999,
//   },
// });
// const overrides = {
//   gasLimit: 9999999,
// };
// const duration = toBigNumber("30"); // 60*60*24*60 or two months
// const max_cap = expandTo18Decimals("100");
// const [wallet, other0, other1] = provider.getWallets();
// let caliToken, caliStaking, caliLP;
// beforeEach(async () => {
//   const Cali = await ethers.getContractFactory("Cali_V2", wallet);
//   caliToken = await Cali.deploy();
//   const CaliLP = await ethers.getContractFactory("Cali_V2", wallet);
//   caliLP = await CaliLP.deploy();
//   const CaliStaking = await ethers.getContractFactory("CaliStaking", wallet);
//   caliStaking = await CaliStaking.deploy(
//     caliLP.address,
//     caliToken.address,
//     expandTo18Decimals(10),
//   );
//   await caliToken.addStakingContract(caliStaking.address, overrides);
//   expect(await caliToken.owner()).to.equal(wallet.address);
//   expect(await caliStaking.owner()).to.equal(wallet.address);
// });

// describe("Cali Staking ", () => {
//   // it("deploy", async () => {
//   //   expect(await caliToken.owner()).to.equal(wallet.address);
//   //   expect(await caliStaking.owner()).to.equal(wallet.address);
//   //   expect(await caliStaking.CaliTokenLP()).to.equal(caliLP.address);
//   //   expect(await caliStaking.caliPerBlock()).to.equal(expandTo18Decimals(10));
//   //   expect(await caliStaking.CaliToken()).to.equal(caliToken.address);
//   // });
//   // it("Initialize", async () => {
//   //   await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//   //   const blockNumber = await caliStaking._blockNumber();
//   //   const timeStamp = await caliStaking._timestamp();
//   //   expect(await caliStaking.maxCap()).to.equal(max_cap);
//   //   expect(await caliStaking.duration()).to.equal(duration);
//   //   expect(await caliStaking.startTime()).to.equal(timeStamp);
//   //   const closeTime = await caliStaking.getCloseTime();
//   //   expect(closeTime).to.equal(duration.add(timeStamp));
//   //   expect(await caliStaking.startBlock()).to.equal(blockNumber);
//   //   const closeBlock = blockNumber.add(closeTime.sub(timeStamp).div(3));
//   //   const _closeBlock = await caliStaking.getCloseBlock();
//   //   expect(_closeBlock).to.equal(closeBlock);
//   // });

//   // it("allows staking", async () => {
//   //   await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//   //   await caliLP.approve(
//   //     caliStaking.address,
//   //     expandTo18Decimals(5000000),
//   //     overrides,
//   //   );
//   //   await caliStaking.deposit(expandTo18Decimals(500), false, overrides);
//   //   expect(await caliLP.balanceOf(caliStaking.address)).to.equal(
//   //     expandTo18Decimals(500),
//   //   );
//   // });
//   // it("allow withdrawal", async () => {
//   //   await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//   //   await caliLP.approve(
//   //     caliStaking.address,
//   //     expandTo18Decimals(5000000),
//   //     overrides,
//   //   );
//   //   await caliStaking.deposit(expandTo18Decimals(500), false, overrides);
//   //   await caliStaking.withdraw(expandTo18Decimals(500), true, overrides);
//   //   expect(await caliLP.balanceOf(caliStaking.address)).to.equal(
//   //     expandTo18Decimals(0),
//   //   );
//   // });

//   // it("get pending rewards", async () => {
//   //   await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//   //   await caliLP.approve(
//   //     caliStaking.address,
//   //     expandTo18Decimals(5000000),
//   //     overrides,
//   //   );
//   //   await caliStaking.deposit(expandTo18Decimals(500), false, overrides);
//   //   await advanceBlock(7);
//   //   await advanceTime(provider, 21);
//   //   const reward = await caliStaking.pendingCali(wallet.address);
//   //   await expect(caliStaking.claim(overrides))
//   //     .to.emit(caliStaking, "Claimed")
//   //     .withArgs(
//   //       wallet.address,
//   //       caliToken.address,
//   //       reward.add(expandTo18Decimals(10)),
//   //     ); // a new block is mined in the transaction
//   // });
//   // it("mint JUST maxCap ", async () => {
//   //   await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//   //   await caliLP.approve(
//   //     caliStaking.address,
//   //     expandTo18Decimals(5000000),
//   //     overrides,
//   //   );
//   //   await caliStaking.deposit(expandTo18Decimals(500), false, overrides);
//   //   const blkNBefore = await caliStaking._blockNumber();
//   //   await advanceTime(provider, 32);
//   //   await advanceBlock(10);
//   //   const reward = await caliStaking.pendingCali(wallet.address);
//   //   await expect(caliStaking.claim(overrides))
//   //     .to.emit(caliStaking, "Claimed")
//   //     .withArgs(wallet.address, caliToken.address, reward);
//   //   const blkNAfter = await caliStaking._blockNumber();
//   //   console.log(
//   //     "BlockNumber Before is:",
//   //     blkNBefore.toString(),
//   //     "BlockNumber After is:",
//   //     blkNAfter.toString(),
//   //   );
//   //   await caliStaking.withdraw(expandTo18Decimals(500), true, overrides);
//   //   const totalMinted = await caliStaking.mintedReward();
//   //   expect(totalMinted).to.equal(max_cap);
//   // });

//   it("mint JUST max reward", async () => {
//     await caliStaking.connect(wallet).initialize(duration, max_cap, overrides);
//     await caliLP.transfer(
//       other0.address,
//       expandTo18Decimals(5000000),
//       overrides,
//     );
//     await caliLP.transfer(
//       other1.address,
//       expandTo18Decimals(5000000),
//       overrides,
//     );
//     await caliLP
//       .connect(other1)
//       .approve(caliStaking.address, expandTo18Decimals(5000000), overrides);
//     await caliLP
//       .connect(other0)
//       .approve(caliStaking.address, expandTo18Decimals(5000000), overrides);

//     await caliStaking
//       .connect(other1)
//       .deposit(expandTo18Decimals(500), false, overrides);
//     await caliStaking
//       .connect(other0)
//       .deposit(expandTo18Decimals(500), false, overrides);
//     const blkNBefore = await caliStaking._blockNumber();
//     await advanceTime(provider, 32);
//     await advanceBlock(10);
//     const rewardOther1 = await caliStaking.pendingCali(other1.address);
//     const rewardOther0 = await caliStaking.pendingCali(other0.address);

//     await expect(caliStaking.connect(other1).claim(overrides))
//       .to.emit(caliStaking, "Claimed")
//       .withArgs(other1.address, caliToken.address, rewardOther1);
//     await expect(caliStaking.connect(other0).claim(overrides))
//       .to.emit(caliStaking, "Claimed")
//       .withArgs(other0.address, caliToken.address, rewardOther0);

//     const blkNAfter = await caliStaking._blockNumber();
//     console.log(
//       "BlockNumber Before is:",
//       blkNBefore.toString(),
//       "BlockNumber After is:",
//       blkNAfter.toString(),
//     );
//     await caliStaking
//       .connect(other1)
//       .withdraw(expandTo18Decimals(500), true, overrides);
//     await caliStaking
//       .connect(other0)
//       .withdraw(expandTo18Decimals(500), true, overrides);
//     const totalMinted = await caliStaking.mintedReward();
//     expect(totalMinted).to.equal(max_cap);
//     const balance1 = await caliToken.balanceOf(other1.address);
//     const balance0 = await caliToken.balanceOf(other0.address);
//     console.log("balance 1: ", balance1.toString());
//     console.log("balance 0: ", balance0.toString());
//     expect(balance1).to.equal(balance0);
//   });
// });

// async function advanceBlock(times) {
//   for (let i = 0; i < times; i++) {
//     await provider.send("evm_mine");
//   }
// }
