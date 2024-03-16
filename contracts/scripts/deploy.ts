import { ethers } from 'hardhat'

async function main() {


    const ContractFactory = await ethers.getContractFactory('Contract')
    const contract = await ContractFactory.deploy(	'0x42FF98C4E85212a5D31358ACbFe76a621b50fC02',"app_staging_5b179dc5f0ba2b412b0af12ca60ce74c","testx")

    await contract.deployed()

    console.log('Contract deployed to:', contract.address)
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
