const { loadWallet } = require('../execution_bot/wallet');
const {ExecutionResult: ResultType} = require('../execution_bot/enum');
const { ethers } = require("ethers");
const ControllerAbi = require("../artifacts/contracts/MakerDaoController.sol/MakerDaoController.json");
const VaultAbi = require("../artifacts/contracts/MakerDaoVault.sol/MakerDaoVault.json");

const makerDAOControllerAbi = ControllerAbi.abi;
const makerVaultABI = VaultAbi.abi;
const makerDAOControllerAddress = '0xe735687718884B0cad56585743EcAa5E70a13AE9';
const makerDaoVaultAddress = '0x05396355A66fB6108a45B0E139C431CA5236b4A1';

async function liquidateVault(vault) {
    const wallet = loadWallet();

    const makerDaoController = new ethers.Contract(makerDAOControllerAddress, makerDAOControllerAbi, wallet.signer);
    const makerDaoVault = new ethers.Contract(makerDaoVaultAddress,makerVaultABI, wallet.signer);

    try{

        console.log("In liquidate vault - vault.id :", vault.id);


        const alreadyLiquidate = await makerDaoVault.isLiquidated(vault.id);
        console.log("----AlreadyLiquidate: ", alreadyLiquidate);
        if (!alreadyLiquidate){
            const tx = await makerDaoController.settle(vault.id, vault.liquidation_hit_round_Id, {  maxFeePerGas: "21500000000", maxPriorityFeePerGas:"21500000000" });
            const receipt = await tx.wait();
            console.log("receipt : ", receipt.status);
            const Liquidated = await makerDaoVault.isLiquidated(vault.id);
            if (receipt.status && Liquidated){
                return ResultType.TXSUCCEED;
            }
            return ResultType.TXFAILED;
        }
        return ResultType.TXUNREACHED;
    }catch(e){
        console.log("Liquidation tx failed :", e.message);
        return ResultType.TXFAILED;
    }
}

module.exports = { liquidateVault }