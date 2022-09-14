const { loadWallet } = require('./wallet');
const {ExecutionResult} = require('./enum');
const { ethers } = require("ethers");
const abi = require("../artifacts/contracts/KIOptionController.sol/KIOptionController.json");

const kiOptionControllerAbi = abi.abi;
const kiOptionControllerAddress = '0x47e753FC69542894d07Db11F493354D2fE5714e3';

async function executeOption(option) {
    const wallet = loadWallet();

    const kiOptionController = new ethers.Contract(kiOptionControllerAddress, kiOptionControllerAbi, wallet.signer);
    try{
        console.log("Trying to execute the option ", option.id);
        const canExecute = await kiOptionController.canExecute(option.id, option.barrier_hit_round_Id);
        if (canExecute){
            const tx = await kiOptionController.execute(option.id, option.barrier_hit_round_Id, {  maxFeePerGas: "21500000000", maxPriorityFeePerGas:"21500000000" });
            const receipt = await tx.wait();
            if (receipt.status){
                console.log("Execute Transaction succeed :", tx.hash);
                return ExecutionResult.TXSUCCEED;
            }
            console.log("Execute Transaction failed");
            return ExecutionResult.TXFAILED;
        }
        console.log("Execute Transaction not reached - Cannot Execute");
        return ExecutionResult.TXUNREACHED;
    }catch(e){
        console.log("ExecuteOption helper Error - ", e.message);
        return ExecutionResult.TXFAILED;
    }
}

module.exports = { executeOption }