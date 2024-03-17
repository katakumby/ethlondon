// import {
//   time,
//   loadFixture,
// } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import hre from "hardhat";

// // import { solidity } from "ethereum-waffle";
// // use(solidity);
// describe("Groups", function () {
//   // chai.use(solidity);
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   let token;
//   // let signers;
//   async function deployFactoryGroup() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount, ...signers] = await hre.ethers.getSigners();

//     const Factory = await hre.ethers.getContractFactory("FactoryGroup");
//     const factory = await Factory.deploy();
//     const Token = await hre.ethers.getContractFactory("Token");
//     console.log("before deploy token");
//     const token = await Token.deploy(1000000000);

//     // await factory.deployed();
//     // console.log("factory deployed to:", factory.address);
//     return { factory, token, owner, otherAccount, signers };
//   }

//   describe("aa", function () {
//     it("Should mint new Factory ", async function () {
//       const { factory, token, owner, otherAccount } =
//         await loadFixture(deployFactoryGroup);

//       // Transfer 50 tokens from owner to addr1
//       await token.transfer(otherAccount, 500000);
//       expect(await token.balanceOf(otherAccount)).to.equal(500000);

//       // create new groupd
//       // const contract = await hre.ethers.getContractAt(
//       //   "FactoryGroup",
//       //   await factory.getAddress(),
//       // );
//       console.debug(await factory.getAddress());
//       console.debug("baby");
//       await factory.createNewGroup(token.getAddress(), 1500, 6, 3);
//       console.debug("addr of new group", await factory.GroupArray(0));
//       await token
//         .connect(otherAccount)
//         .approve(await factory.GroupArray(0), 500000);
//       console.debug("approve");
//       await factory.connect(otherAccount).joinGroup(0);

//       for (let i = 0; i < 6; i++) {
//         await time.advanceBlock();
//       }
//     });
//   });
// });
