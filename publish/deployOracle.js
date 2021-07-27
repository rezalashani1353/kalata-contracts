const {updateWebContracts} = require("../utils/resources");
const {readContracts, saveContracts,} = require("../utils/resources")
const CONTRACT_CLASS = "Oracle";
const moment = require("moment");

async function deploy(hre) {
    const accounts = await hre.ethers.getSigners();
    let deployer = accounts[0];
    const ContractClass = await hre.ethers.getContractFactory(CONTRACT_CLASS, {});
    const {bytecode, abi} = await hre.artifacts.readArtifact(CONTRACT_CLASS);

    let deployedContracts = readContracts(hre) || {};
    let deployedContract = deployedContracts[CONTRACT_CLASS] || {
        name: CONTRACT_CLASS,
        upgrade: false,
        address: null,
        initialize: null,
        deployer: deployer.address,
        abi,
        bytecode,
        deploy: true
    };

    if (deployedContract.deploy || deployedContract.upgrade) {
        if (deployedContract.upgrade) {
            const instance = await hre.upgrades.upgradeProxy(deployedContract.address, ContractClass, {});
            deployedContract.abi = abi;
            deployedContract.bytecode = bytecode;
            deployedContract.upgradeTime = moment().format();
            console.log(`${CONTRACT_CLASS} upgraded:`, instance.address);
        } else {
            let chainlinkOracle = deployedContracts['ChainlinkOracle'].address;
            let kalataOracle = deployedContracts['KalataOracle'].address;
            let consumers = [chainlinkOracle, kalataOracle]
            const instance = await hre.upgrades.deployProxy(ContractClass, [consumers], {
                initializer: 'initialize',
            });
            await instance.deployed();
            deployedContract.address = instance.address;
            deployedContract.initialize = {consumers};
            console.log(`${CONTRACT_CLASS} deployed to network ${hre.network.name} with address ${instance.address}`);
        }
        deployedContract.deploy = false;
        deployedContract.upgrade = false;
        deployedContracts[CONTRACT_CLASS] = deployedContract
        saveContracts(hre, deployedContracts);
    }
    {
        const {abi} = await hre.artifacts.readArtifact("IOracle");
        updateWebContracts(hre, CONTRACT_CLASS, {address: deployedContract.address, abi});
    }

}


module.exports = {
    deploy
}
