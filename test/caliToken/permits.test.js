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
// let caliToken, callReplyAddr;
// beforeEach(async () => {
//   const Cali = await ethers.getContractFactory("Cali_V2", wallet);
//   caliToken = await Cali.deploy();
//   const CallReply = await ethers.getContractFactory("CallsReply", wallet);

//   callReplyAddr = await CallReply.deploy();

//   expect(await caliToken.owner()).to.equal(wallet.address);
// });

// describe("Permits ", () => {
//   it("approve with permit", async () => {
//     const domainSeparator = await caliToken.DOMAIN_SEPARATOR();
//     const PERMIT_TYPEHASH = await caliToken.PERMIT_TYPEHASH();
//     const source = wallet.address;
//     const spender = other0.address;
//     const value = 123;
//     const nonce = await caliToken.nonces(wallet.address);
//     const deadline = constants.MaxUint256;
//     const digest = utils.keccak256(
//       utils.solidityPack(
//         ["bytes1", "bytes1", "bytes32", "bytes32"],
//         [
//           "0x19",
//           "0x01",
//           domainSeparator,
//           utils.keccak256(
//             utils.defaultAbiCoder.encode(
//               [
//                 "bytes32",
//                 "address",
//                 "address",
//                 "uint256",
//                 "uint256",
//                 "uint256",
//               ],
//               [PERMIT_TYPEHASH, source, spender, value, nonce, deadline],
//             ),
//           ),
//         ],
//       ),
//     );

//     const { v, r, s } = ecsign(
//       Buffer.from(digest.slice(2), "hex"),
//       Buffer.from(wallet.privateKey.slice(2), "hex"),
//     );

//     await caliToken.permit(
//       source,
//       spender,
//       value,
//       deadline,
//       v,
//       utils.hexlify(r),
//       utils.hexlify(s),
//       overrides,
//     );
//     expect(await caliToken.allowance(source, spender)).to.eq(value);
//     expect(await caliToken.nonces(source)).to.eq(1);

//     await caliToken
//       .connect(other0)
//       .transferFrom(source, spender, value, overrides);
//     expect(await caliToken.balanceOf(other0.address)).to.equal(
//       toBigNumber(value),
//     );
//   });
//   it("transfer with permit", async () => {
//     const domainSeparator = await caliToken.DOMAIN_SEPARATOR();
//     const TRANSFER_TYPEHASH = await caliToken.TRANSFER_TYPEHASH();
//     const source = wallet.address;
//     const spender = other0.address;
//     const value = 123;
//     const nonce = await caliToken.nonces(wallet.address);
//     const deadline = constants.MaxUint256;
//     const digest = utils.keccak256(
//       utils.solidityPack(
//         ["bytes1", "bytes1", "bytes32", "bytes32"],
//         [
//           "0x19",
//           "0x01",
//           domainSeparator,
//           utils.keccak256(
//             utils.defaultAbiCoder.encode(
//               [
//                 "bytes32",
//                 "address",
//                 "address",
//                 "uint256",
//                 "uint256",
//                 "uint256",
//               ],
//               [TRANSFER_TYPEHASH, source, spender, value, nonce, deadline],
//             ),
//           ),
//         ],
//       ),
//     );

//     const { v, r, s } = ecsign(
//       Buffer.from(digest.slice(2), "hex"),
//       Buffer.from(wallet.privateKey.slice(2), "hex"),
//     );

//     await caliToken.transferWithPermit(
//       source,
//       spender,
//       value,
//       deadline,
//       v,
//       utils.hexlify(r),
//       utils.hexlify(s),
//       overrides,
//     );
//     expect(await caliToken.allowance(source, spender)).to.eq(toBigNumber(0));
//     expect(await caliToken.nonces(source)).to.eq(1);

//     expect(await caliToken.balanceOf(other0.address)).to.equal(
//       toBigNumber(value),
//     );
//   });

//   it("approve and call in", async () => {
//     console.log((await caliToken.balanceOf(wallet.address)).toString());
//     await caliToken
//       .connect(wallet)
//       .approveAndCall(
//         callReplyAddr.address,
//         expandTo18Decimals("20"),
//         "0x0011223344556677",
//         overrides,
//       );

//     expect(await caliToken.balanceOf(callReplyAddr.address)).to.equal(
//       expandTo18Decimals("20"),
//     );
//   });
//   it("transfer and call out", async () => {
//     console.log((await caliToken.balanceOf(wallet.address)).toString());

//     await caliToken
//       .connect(wallet)
//       .transferAndCall(
//         callReplyAddr.address,
//         expandTo18Decimals("20"),
//         "0x0011223344556677",
//         overrides,
//       );

//     expect(await caliToken.balanceOf(caliToken.address)).to.equal(
//       expandTo18Decimals("20"),
//     );
//   });

//   it("swap out", async () => {
//     console.log((await caliToken.balanceOf(wallet.address)).toString());

//     await caliToken.transfer(
//       other0.address,
//       expandTo18Decimals("500"),
//       overrides,
//     );
//     await expect(
//       caliToken
//         .connect(other0)
//         .Swapout(expandTo18Decimals("50"), other0.address, overrides),
//     )
//       .to.emit(caliToken, "LogSwapout")
//       .withArgs(other0.address, other0.address, expandTo18Decimals("50"));
//     console.log(
//       "Bal after: ",
//       (await caliToken.balanceOf(wallet.address)).toString(),
//     );

//     expect(await caliToken.balanceOf(other0.address)).to.equal(
//       expandTo18Decimals("450"),
//     );
//   });
//   it("swap in", async () => {
//     console.log((await caliToken.balanceOf(wallet.address)).toString());

//     const txHash =
//       "0x1187638dc0daeeb9caa2c6d08b304c8087ae777c90569eb67911e9ca4fd9c66d";
//     await expect(
//       caliToken
//         .connect(wallet)
//         .Swapin(txHash, other0.address, expandTo18Decimals("500"), overrides),
//     )
//       .to.emit(caliToken, "LogSwapin")
//       .withArgs(txHash, other0.address, expandTo18Decimals("500"));
//     console.log(
//       "Bal after: ",
//       (await caliToken.balanceOf(wallet.address)).toString(),
//     );
//     expect(await caliToken.balanceOf(other0.address)).to.equal(
//       expandTo18Decimals("500"),
//     );
//   });
// });
