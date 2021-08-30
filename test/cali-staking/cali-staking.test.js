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
