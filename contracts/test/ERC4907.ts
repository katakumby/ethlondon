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
        const [owner, otherAccount1, otherAccount2] = await hre.ethers.getSigners();

        const ERC4907 = await hre.ethers.getContractFactory("ERC4907");
        const erc4907 = await ERC4907.deploy("BMW Lottery","BMWL", owner);

        return { erc4907, owner, otherAccount1,otherAccount2};
    }

    describe("Deployment", function () {
        it("Should mint new NFT's ", async function () {
            const { erc4907, owner,otherAccount1,otherAccount2 } = await loadFixture(deployOneYearLockFixture);
            const nft1 = await erc4907.mint(otherAccount1,"ipfs1",new Date().valueOf()+1000);
            const nft2 = await erc4907.mint(otherAccount2,"ipfs2",new Date().valueOf()+1000);
            const nft3 = await erc4907.mint(owner,"ipfs3",new Date().valueOf()+1000);

            expect(await erc4907.userOf(0)).to.equal(otherAccount1.address.toString())
            expect(await erc4907.userOf(1)).to.equal(otherAccount2.address.toString())
            expect(await erc4907.userOf(2)).to.equal('0x0000000000000000000000000000000000000000')

            expect(await erc4907.ownerOf(0)).to.equal(owner.address.toString())
            expect(await erc4907.ownerOf(1)).to.equal(owner.address.toString())
            expect(await erc4907.ownerOf(2)).to.equal(owner.address.toString())


        });

    });

});
