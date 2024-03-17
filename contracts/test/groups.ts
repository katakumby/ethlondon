import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, use } from "chai";
import hre from "hardhat";
import { EventLog } from "ethers/src.ts/contract/wrappers";
import { Log } from "ethers/src.ts/providers/provider";

import { BigNumberish } from "ethers";
// import { solidity } from "ethereum-waffle";
// use(solidity);
const DEMO_PROOF = {
  verification_level: "orb",
  proof:
    "0x1e8b4eafbbd4ec0fe6d5ece904ee67084d24ce194ce511ee80cf9c312fcc5301252d35d4d3b16a2a7430b7f8f33ae6cc09ce679fd1c9d620b86431ea2404d6f92633408674916d1b3072513e52bde4beae413f0351c25eefb26f38b515db437722c4c5476880216be0b8c9affce7fd07c25f66c203e3fd5681153f14e46e90f012d2135cb08c745dc46976a8f3ab6ba38aeaf2155eaedb2f960af5502dd40a76052866807c26d0139e52b2c55070a9e8a4f6cc71d0ac69494589684910b9baca0e4a726f874faaf396ff2a90b7f0af74f6a3e1afe17885981b1e1e1c3dceca9a089e4ce17998276da7a8a1afa66bfcbb5a6b58c6d8eb559e7d8ebd6331735f57",
  merkle_root:
    "0x1e28120c18d4a1025fbcbc2401462cfce8406fc87b7c8a0468c474649687df70",
  nullifier_hash:
    "0x0e0b399da23436c89f585545fda23fa682c291fed6cf730df6f396c273316b45",
  credential_type: "orb",
};

describe("Groups", function () {
  // chai.use(solidity);
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  let token;
  // let signers;
  async function deployFactoryGroup() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, ...signers] = await hre.ethers.getSigners();

    const Factory = await hre.ethers.getContractFactory("FactoryGroup");
    const factory = await Factory.deploy();
    const Token = await hre.ethers.getContractFactory("Token");
    console.log("before deploy token");
    const token = await Token.deploy(10000000000);

    const ERC4907 = await hre.ethers.getContractFactory("ERC4907");
    const erc4907 = await ERC4907.deploy("BMW Lottery", "BMWL", owner);
    // await factory.deployed();

    // console.log("factory deployed to:", factory.address);

    return { factory, token, owner, otherAccount, signers, erc4907 };
  }

  describe("Happy path", function () {
    it("Should mint new Factory ", async function () {
      const { factory, token, owner, otherAccount, signers, erc4907 } =
        await loadFixture(deployFactoryGroup);

      // Transfer 50 tokens from owner to addr1
      await token.transfer(otherAccount, 500000);
      expect(await token.balanceOf(otherAccount)).to.equal(500000);

      // create new groupd
      // const contract = await hre.ethers.getContractAt(
      //   "FactoryGroup",
      //   await factory.getAddress(),
      // );
      console.debug(await factory.getAddress());
      console.debug("baby");
      await factory.createNewGroup(
        token.getAddress(),
        erc4907.getAddress(),
        1500,
        6,
        3,
      );
      console.debug("addr of new group", await factory.GroupArray(0));
      await erc4907.transferOwnership(await factory.GroupArray(0));
      await token
        .connect(otherAccount)
        .approve(await factory.GroupArray(0), 500000);
      console.debug("approve");
      await factory
        .connect(otherAccount)
        .joinGroup(
          0,
          otherAccount.address,
          DEMO_PROOF.merkle_root,
          DEMO_PROOF.nullifier_hash,
          [0, 0, 0, 0, 0, 0, 0, DEMO_PROOF.proof],
        );

      for (let i = 0; i < 5; i++) {
        await token.transfer(signers[i], 500000);
        await token
          .connect(signers[i])
          .approve(await factory.GroupArray(0), 500000);
        console.debug("approve");
        await factory
          .connect(signers[i])
          .joinGroup(
            0,
            otherAccount.address,
            DEMO_PROOF.merkle_root,
            DEMO_PROOF.nullifier_hash,
            [0, 0, 0, 0, 0, 0, 0, DEMO_PROOF.proof],
          );
      }
      const tx = await factory.startLotteryForGroup(0);
      const result = await tx.wait();

      console.log(await erc4907.userOf(0));
      // console.log(result?.logs);
      // function findEventArgs(logs: Array<EventLog | Log>, eventName: string) {
      //   let _event = null;

      //   for (const event of logs) {
      //     if ("fragment" in event)
      //       if (event.fragment && event.fragment.name === eventName) {
      //         _event = event.args;
      //       }
      //   }
      //   return _event;
      // }
      // const logs = result?.logs;
      // if (logs) {
      //   // @ts-ignore
      //   console.log(findEventArgs(logs, "LottertWinners"));
      // }
    });
  });
});
