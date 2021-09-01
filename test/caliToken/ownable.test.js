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
//   addNumbers,
//   subNumbers,
//   toBigNumber,
//   DELAY,
//   ADDRESS_ZERO,
// } = require("../utils");
// const {
//   takeSnapshot,
//   advanceTime,
//   revertTime,
//   timeStamp,
// } = require("../time-trave");
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
// const [wallet, other0, other1] = provider.getWallets();
// let caliToken;
// beforeEach(async () => {
//   const Cali = await ethers.getContractFactory("Cali_V2", wallet);
//   caliToken = await Cali.deploy();
//   expect(await caliToken.owner()).to.equal(wallet.address);
//   takeSnapshot(provider);
// });
// afterEach(async () => {
//   revertTime(provider);
// });
// describe("owner and minter roles, pausable", () => {
//   it("add minter", async () => {
//     await caliToken.connect(wallet).setMinter(other0.address, overrides);
//     expect(await caliToken.isPendingMinter(other0.address)).to.be.true;
//     expect(await caliToken.isMinter(other0.address)).to.be.false;
//   });
//   it("revert minter add if not owner", async () => {
//     await expect(
//       caliToken.connect(other1).setMinter(other1.address, overrides),
//     ).to.be.revertedWith("CaliERC20: FORBIDDEN");
//   });
//   it("accept minter", async () => {
//     await caliToken.connect(wallet).setMinter(other0.address, overrides);
//     await advanceTime(provider, DELAY());
//     await caliToken.connect(wallet).applyMinter(other0.address, overrides);
//     expect(await caliToken.isMinter(other0.address)).to.be.true;
//     expect(await caliToken.isPendingMinter(other0.address)).to.be.false;
//   });
//   it("restrict minter", async () => {
//     await caliToken.connect(wallet).setMinter(other0.address, overrides);
//     await advanceTime(provider, DELAY());
//     await caliToken.connect(wallet).applyMinter(other0.address, overrides);
//     expect(await caliToken.isMinter(other0.address)).to.be.true;
//     expect(await caliToken.isPendingMinter(other0.address)).to.be.false;
//     await caliToken.connect(wallet).revokeMinter(other0.address, overrides);
//     expect(await caliToken.isMinter(other0.address)).to.be.false;
//   });

//   it("reject pending Minter", async () => {
//     await caliToken.connect(wallet).setMinter(other0.address, overrides);
//     expect(await caliToken.isPendingMinter(other0.address)).to.be.true;
//     await caliToken.connect(wallet).rejectMinter(other0.address, overrides);
//     expect(await caliToken.isPendingMinter(other0.address)).to.be.false;
//   });

//   it("change owner", async () => {
//     await caliToken.connect(wallet).changeOwner(other0.address, overrides);
//     expect(await caliToken.pendingOwner()).to.be.eq(other0.address);
//     expect(await caliToken.owner()).to.be.eq(wallet.address);
//   });
//   it("accept pending owner after delay", async () => {
//     await caliToken.connect(wallet).changeOwner(other0.address, overrides);
//     expect(await caliToken.pendingOwner()).to.be.eq(other0.address);
//     expect(await caliToken.owner()).to.be.eq(wallet.address);
//     await advanceTime(provider, DELAY());
//     await caliToken.connect(wallet).acceptPendingOwner(overrides);
//     expect(await caliToken.owner()).to.be.eq(other0.address);
//     expect(await caliToken.pendingOwner()).to.be.eq(ADDRESS_ZERO());
//   });
//   it("reject pending owner", async () => {
//     await caliToken.connect(wallet).changeOwner(other0.address, overrides);
//     expect(await caliToken.pendingOwner()).to.be.eq(other0.address);
//     expect(await caliToken.owner()).to.be.eq(wallet.address);
//     await caliToken.connect(wallet).rejectPendingOwner(overrides);
//     expect(await caliToken.pendingOwner()).to.be.eq(ADDRESS_ZERO());
//   });
//   it("pause", async () => {
//     await caliToken.connect(wallet).pause(overrides);
//     expect(await caliToken.paused()).to.be.true;
//     await expect(caliToken.connect(other1).pause(overrides)).to.be.revertedWith(
//       "CaliERC20: FORBIDDEN",
//     );
//   });
//   it("unpause", async () => {
//     await caliToken.connect(wallet).pause(overrides);
//     expect(await caliToken.paused()).to.be.true;
//     await caliToken.connect(wallet).unpause(overrides);
//     expect(await caliToken.paused()).to.be.false;
//     await expect(
//       caliToken.connect(other1).unpause(overrides),
//     ).to.be.revertedWith("CaliERC20: FORBIDDEN");
//   });
// });
