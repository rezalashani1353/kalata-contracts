const {readWebAssets} = require("../utils/assets");
const {updateWebContracts} = require("../utils/resources");
const {readWBNB, saveWBNB} = require("../utils/assets")
const {toUnitString} = require("../utils/maths");
const {deployToken} = require("../utils/contract")

const ASSETS = {
    name: "Token Wrapped BNB",
    symbol: "WBNB",
    initialSupply: toUnitString(10000000000),
    addresses: {
        mainnet: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        //testnet: "0xae13d989dac2f0debff460ac112a837c89baa7cd"
    }
};

async function deploy(hre) {
    let deployedWebAssets = readWebAssets(hre) || {};
    const accounts = await hre.ethers.getSigners();
    let deployer = accounts[0];
    let {name, symbol, initialSupply} = ASSETS;
    let address = ASSETS.addresses[hre.network.name];
    if (address) {
        saveWBNB(hre, {name, symbol, address})
        return;
    }
    let config = readWBNB(hre) || {name, symbol, initialSupply, deployer: deployer.address, address: null, deploy: true,};
    if (config.deploy) {
        let token = await deployToken(hre, name, symbol, initialSupply);
        config.address = token.address;
        config.deploy = false;
        saveWBNB(hre, config)
        console.log(`MockWBNB deployed to network ${hre.network.name} with address ${token.address}`);
    }
}

module.exports = {
    deploy
}
