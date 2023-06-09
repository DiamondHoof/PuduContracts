import {network} from "hardhat";
export async function txConfirmation(message: string, callData: any, printLogs = true): Promise<boolean> {
    let confirmationBlocks = 3;
    switch (network.name) {
        case 'hardhat':
        case 'localhost':
            confirmationBlocks = 1;
    }
    if (printLogs) {
        console.log(`\t [Confirmations ${confirmationBlocks}] ` + message);
    }
    const tx = await callData;
    const txReceipt = await tx.wait(confirmationBlocks);
    if (txReceipt.status == 1) {
        return true;
    } else {
        console.log('FAILED: ' + message);
        return false;
    }
}