const { ethers } = require("hardhat");
const { deployLogic, deployProxy } = require("../test/proxyUtil");
const { MAX_UINT } = require("../test/util");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);
  console.log("");

  const weth = "0x7bd398f3C157AD7351228C757d3D085356214630";
  const oracle = "0xF3021338C81eD72f0f0410CB0DCFf590717E21B4";
  console.log("WETH : " + weth);
  console.log("ORACLE : " + oracle);

  const DaiLogicContract = await deployLogic("Dai", deployer);
  const DaiProxyContract = await deployProxy({
    logicContract: DaiLogicContract,
    admin: deployer.address,
    initializeSignature: `initialize()`,
    initializeArgs: {
      types: [],
      args: [],
    },
    signer: deployer,
    contractFactoryName: "Dai",
  });
  const dai = DaiProxyContract.address;
  console.log("DAI (Proxy) : " + DaiProxyContract.address);
  console.log("DAI (Logic) : " + DaiLogicContract.address);

  // MakerDAO
  const MakerDaoController = await ethers.getContractFactory(
    "MakerDaoController"
  );
  const makerDaoController = await MakerDaoController.deploy();
  await makerDaoController.deployed();
  const MakerDaoVault = await ethers.getContractFactory("MakerDaoVault");
  const makerDaoVault = await MakerDaoVault.deploy();
  await makerDaoVault.deployed();
  console.log("MakerDao Controller : " + makerDaoController.address);
  console.log("MakerDao Vault : " + makerDaoVault.address);

  await makerDaoController.setConfig(
    oracle,
    makerDaoVault.address,
    dai,
    weth,
    8000
  );
  await makerDaoVault.setVaultManager(makerDaoController.address, true);
  await DaiProxyContract.setDaiMinter(makerDaoController.address, true);

  const WETH = await ethers.getContractAt("ERC20", weth);
  await WETH.connect(deployer)
    .approve(makerDaoController.address, MAX_UINT)
    .then((tx) => tx.wait());
  await DaiProxyContract.connect(deployer)
    .approve(makerDaoController.address, MAX_UINT)
    .then((tx) => tx.wait());

  console.log("========== MakerDAO Deploy complete ==========");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
