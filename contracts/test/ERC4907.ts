import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Lock2", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {


        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const ERC4907 = await hre.ethers.getContractFactory("ERC4907");
        const erc4907 = await ERC4907.deploy("BMW Lottery","BMWL", owner);

        return { erc4907, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should mint new ", async function () {
            const { erc4907, owner,otherAccount } = await loadFixture(deployOneYearLockFixture);
            const mint1 = await erc4907.mint(otherAccount,"ipfs",new Date().valueOf());
            const mint2 = await erc4907.mint(otherAccount,"ipfs",new Date().valueOf());

            // const xyz2 = await erc4907.ownerOf(1)
            const xyz2 = await erc4907.balanceOf(owner);
            const minnn = await erc4907.ownerOf(1);
            const userof = await erc4907.userOf(1);
            // console.debug("XYZ",minnn.toString())
            console.debug("owner",owner.address.toString())
            console.debug("otherAccountAddr",otherAccount.address.toString())
            console.debug("userof",userof.toString())
            console.debug("minnn",minnn.toString())
            console.debug("xyz2",xyz2.toString())
            // console.debug("XYZ",xyz)
            // expect(await lock.unlockTime()).to.equal(unlockTime);
        });

    });

});
