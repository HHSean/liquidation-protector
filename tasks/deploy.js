const keccak256 = require('keccak256')
const BigNumber = require("bignumber.js")
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

task("implementation-change")
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners()
    const PlusOptionImplementation = await deployLogic(ethers, "KIPlusOption", owner)
    const MinusOptionImplementation = await deployLogic(ethers, "KIMinusOption", owner)

    const addressRouter = await ethers.getContractAt("AddressRouter", "0x329491B77aADC904b595Fa04a90E78af6167b6B9")

    await addressRouter.setConfig(
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      PlusOptionImplementation.address,
      MinusOptionImplementation.address,
    ).then((tx) => tx.wait())
    
    console.log(await addressRouter.plusOptionImplementation(), ' plus option impl')
    console.log(await addressRouter.minusOptionImplementation(), ' minus option impl')

    console.log('completed.')
  })

task("deploy-market")
  .addParam("optionfactory")
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners()
    const OptionMarketImplementation = await deployLogic(ethers, "OptionMarket", owner)
    // const OptionMarket = await deployProxy(ethers, {
    //   logicContract: OptionMarketImplementation,
    //   initializeSignature: "initialize(address)",
    //   initializeArgs: {
    //     types: ["address"],
    //     args: [taskArgs.optionfactory],
    //   },
    //   signer: owner,
    //   admin: owner.address,
    //   contractFactoryName: "OptionMarket"
    // })

    await upgradeProxy(ethers, "0x89CeeBf66b83323f64e08Fd52066321b4314a824", OptionMarketImplementation.address, owner)

    console.log('option market: ', OptionMarket.address)

    return OptionMarket
  })

task("upgrade-controller")
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners()
    const OptionControllerImplementation = await deployLogic(ethers, "KIOptionController", owner)

    await upgradeProxy(ethers, "0x47e753FC69542894d07Db11F493354D2fE5714e3", OptionControllerImplementation.address, owner)

    console.log('upgrade')

    return OptionController
  })

task("upgrade-addressrouter")
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners()
    const AddressRouterImplementation = await deployLogic(ethers, "AddressRouter", owner)

    const addressRouterAddress = "0x329491B77aADC904b595Fa04a90E78af6167b6B9"

    await upgradeProxy(ethers, addressRouterAddress, AddressRouterImplementation.address, owner)

    console.log('upgrade')
    const AddressRouter = await ethers.getContractAt("AddressRouter", addressRouterAddress)

    await AddressRouter.setConfig(
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      "0x" + "0".repeat(40),
      "0x336d9c19ABb9D21d4F49C975c0b96825873B5c64", // option market
      "0x05396355A66fB6108a45B0E139C431CA5236b4A1", // maker dao vault
      "0xe735687718884B0cad56585743EcAa5E70a13AE9", // maker dao controller
    ).then((tx) => tx.wait())

    return AddressRouter
  })

task("setconfig-addressrouter")
  .addParam("addressrouter")
  .setAction(async(taskArgs, { ethers }) => {
    const AddressRouter = await ethers.getContractAt("AddressRouter", taskArgs.addressrouter)

    console.log("router optionFactory",await AddressRouter.optionFactory());
    console.log("router oracle",await AddressRouter.oracle());
    console.log("router plusOptionImplementation",await AddressRouter.plusOptionImplementation());
    console.log("router minusOptionImplementation",await AddressRouter.minusOptionImplementation());
    console.log("router optionMarket",await AddressRouter.optionMarket());
    await AddressRouter.setConfig(
      "0x" + "0".repeat(40), // _controller
      "0x" + "0".repeat(40), // _oracle
      "0x" + "0".repeat(40), // _optionFactory
      "0x" + "0".repeat(40), // plusOption
      "0x" + "0".repeat(40), // minusOption
      "0x" + "0".repeat(40), // option market
      "0x05396355A66fB6108a45B0E139C431CA5236b4A1", // maker dao vault
      "0xe735687718884B0cad56585743EcAa5E70a13AE9", // maker dao controller
    ).then((tx) => tx.wait())

    console.log('completed')
  })

task("deploy-weth")
  .setAction(async(taskArgs, { ethers }) => {

    const [owner] = await ethers.getSigners()

    const token1 = await deployLogic(ethers, "ERC20Mock")

    await token1.__ERC20__init("WETH", "WETH").then((tx) => tx.wait())

    await token1.mint(owner.address, new BigNumber(10000).multipliedBy(10 ** 18).toString()).then((tx) => tx.wait())
    await token1.mint("0xF8B7d98c3A93433696fEDa23c71b3EcAF977f09d", new BigNumber(10000).multipliedBy(10 ** 18).toString()).then((tx) => tx.wait())
    await token1.mint("0xDF88cB5e358A4Bd3285EA74aee9B3BFe32D7cf09", new BigNumber(10000).multipliedBy(10 ** 18).toString()).then((tx) => tx.wait())

    console.log(token1.address, 'token1.address')
  })

const deployAll = async (taskArgs, { ethers }) => {
  const [owner] = await ethers.getSigners()

  let addressRouter
  if (!taskArgs.addressrouter) {
    const addressRouterImplemenation = await deployLogic(ethers, "AddressRouter")
    addressRouter = await deployProxy(ethers, {
      contractFactoryName: "AddressRouter",
      logicContract: addressRouterImplemenation,
      admin: owner.address,
      initializeSignature: "initialize()",
      initializeArgs: {
        types: [],
        args: [],
      },
      signer: owner,
    })
  } else {
    addressRouter = await ethers.getContractAt("AddressRouter", taskArgs.addressrouter)
  }

  let controller
  if (!taskArgs.controller) {
    const controllerImplementation = await deployLogic(ethers, "KIOptionController")
    controller = await deployProxy(ethers, {
      contractFactoryName: "KIOptionController",
      logicContract: controllerImplementation,
      admin: owner.address,
      initializeSignature: "initialize(address)",
      initializeArgs: {
        types: ['address'],
        args: [addressRouter.address],
      },
      signer: owner,
    })
  } else {
    controller = await ethers.getContractAt("KIOptionController", taskArgs.optioncontroller)
  }

  // If already deployed, use that.
  const oracle = taskArgs.oracleaddress
    ? await ethers.getContractAt("OracleMock", taskArgs.oracleaddress)
    : await deployLogic(ethers, "OracleMock")

  const plusOptionImplemenation = await deployLogic(ethers, "KIPlusOption")
  const minusOptionImplemenation = await deployLogic(ethers, "KIMinusOption")

  const optionFactoryImplemenation = await deployLogic(ethers, "KIOptionFactory")
  const optionFactory = await deployProxy(ethers, {
    contractFactoryName: "KIOptionFactory",
    logicContract: optionFactoryImplemenation,
    admin: owner.address,
    initializeSignature: "initialize(address)",
    initializeArgs: {
      types: ['address'],
      args: [addressRouter.address],
    },
    signer: owner,
  })

  // Add OptionFactory to address router's operator
  await addressRouter.setOperator(optionFactory.address, true).then((tx) => tx.wait())

  // test tokens (WETH)
  // const token1 = await deployLogic(ethers, "ERC20Mock")

  // await token1.__ERC20__init("WETH", "WETH").then((tx) => tx.wait())

  // await token1.mint(owner.address, new BigNumber(10000).multipliedBy(10 ** 18).toString()).then((tx) => tx.wait())

  const optionMarketImplementation = await deployLogic(ethers, "OptionMarket")
  const optionMarket = await deployProxy(ethers, {
    contractFactoryName: "OptionMarket",
    logicContract: optionMarketImplementation,
    admin: owner.address,
    initializeSignature: "initialize(address)",
    initializeArgs: {
      types: ['address'],
      args: [optionFactory.address],
    },
    signer: owner,
  })

  await addressRouter.setConfig(
    controller.address,
    oracle.address,
    optionFactory.address,
    plusOptionImplemenation.address,
    minusOptionImplemenation.address,
    optionMarket.address,
    "0x" + "0".repeat(40), // makerDaoVault.address,
    "0x" + "0".repeat(40), // makerDaoController.address
  ).then((tx) => tx.wait())

  return {
    controller,
    addressRouter,
    optionFactory,
    oracle,
    // weth: token1,
    // dai: token2,
    optionMarket,
  }
}

async function deployLogic(ethers, contractFactoryName, signer) {

  const LogicContract = await ethers.getContractFactory(contractFactoryName, signer)
    .then((c) => c.deploy())
    .then((c) => c.deployed())

  return ethers.getContractAt(contractFactoryName, LogicContract.address, signer)
}

async function deployProxy(ethers, { logicContract, admin, initializeSignature, initializeArgs, contractFactoryName, signer }) {

  const abiCoder = new ethers.utils.AbiCoder()

  const _proxy = await ethers.getContractFactory("contracts/proxy/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy", signer)
  const signature = keccak256(initializeSignature).toString('hex')

  const data = `0x` + signature.slice(0, 8) + abiCoder.encode(
    initializeArgs.types,
    initializeArgs.args,
  ).slice(2)

  const proxy = await _proxy.deploy(logicContract.address, admin, data)
  const proxyContract = await proxy.deployed()

  return ethers.getContractAt(contractFactoryName, proxyContract.address, signer)
}

async function upgradeProxy(ethers, proxyAddress, implementationAddress, signer) {
  const _proxy = await ethers.getContractAt("contracts/proxy/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy", proxyAddress, signer)
  const response = await _proxy.upgradeTo(implementationAddress)

  return response
}

module.exports = {
  deployAll,
  upgradeProxy
}

