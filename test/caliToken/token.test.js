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
  addNumbers,
  subNumbers,
  toBigNumber,
} = require("../utils");
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
const [wallet, other0, other1] = provider.getWallets();
let caliToken;
beforeEach(async () => {
  const Cali = await ethers.getContractFactory("Cali_V2", wallet);
  caliToken = await Cali.deploy();
  expect(await caliToken.owner()).to.equal(wallet.address);
});
describe("ERC20 Basics", () => {
  it("transfer", async () => {
    const walletBal1 = await caliToken.balanceOf(wallet.address);
    await caliToken
      .connect(wallet)
      .transfer(other0.address, expandTo18Decimals("50"), overrides);
    const bal = await caliToken.balanceOf(other0.address);
    const walletBal2 = await caliToken.balanceOf(wallet.address);
    expect(walletBal1).to.equal(addNumbers(bal, walletBal2));
  });
  it("approve", async () => {
    await caliToken
      .connect(wallet)
      .approve(other0.address, expandTo18Decimals("500"), overrides);
    expect(await caliToken.allowance(wallet.address, other0.address)).to.equal(
      expandTo18Decimals("500"),
    );
  });
  it("transfer from", async () => {
    await caliToken
      .connect(wallet)
      .approve(other0.address, expandTo18Decimals("500"), overrides);
    await caliToken
      .connect(other0)
      .transferFrom(
        wallet.address,
        other0.address,
        expandTo18Decimals("500"),
        overrides,
      );
    expect(await caliToken.balanceOf(other0.address)).to.equal(
      expandTo18Decimals("500"),
    );
  });
  it("burn && burnFrom", async () => {
    const walletBal = await caliToken.balanceOf(wallet.address);
    await caliToken
      .connect(wallet)
      .burn(wallet.address, expandTo18Decimals("500"), overrides);
    expect(await caliToken.balanceOf(wallet.address)).to.equal(
      subNumbers(walletBal, expandTo18Decimals("500")),
    );
    await caliToken
      .connect(wallet)
      .transfer(other0.address, expandTo18Decimals("50"), overrides);
    await caliToken
      .connect(wallet)
      .burn(other0.address, expandTo18Decimals("50"), overrides);
    expect(await caliToken.balanceOf(other0.address)).to.equal(toBigNumber(0));
  });
  it("only Auth to burn", async () => {
    await caliToken
      .connect(wallet)
      .transfer(other0.address, expandTo18Decimals("50"), overrides);
    await expect(
      caliToken
        .connect(other0)
        .burn(other0.address, expandTo18Decimals("50"), overrides),
    ).to.be.revertedWith("CaliERC20: FORBIDDEN");
  });
  it("only minters can mint", async () => {
    await expect(
      caliToken
        .connect(other0)
        .mint(other0.address, expandTo18Decimals("10000"), overrides),
    ).to.be.revertedWith("CaliERC20: FORBIDDEN");
  });
});
