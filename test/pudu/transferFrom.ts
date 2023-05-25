import {PuduTestingEnvironment} from "./@puduTestingEnvironment";
import {parseEther} from "ethers/lib/utils";
import {expect} from "chai";
import {BigNumber} from "ethers";

export function transferFrom() {
    let environment: PuduTestingEnvironment = new PuduTestingEnvironment();
    before(async () => {
        await environment.initialize();
        // Distribute wealth among guest signers
        await environment.puduContract.transfer(environment.guest1Signer.address, parseEther("10"));
        await environment.puduContract.transfer(environment.guest2Signer.address, parseEther("5"));
    });

    it('Should fail if the recipient is the zero address', async () => {
        await expect(environment.puduContract.transferFrom(environment.guest1Signer.address, "0x0000000000000000000000000000000000000000", parseEther("2")))
            .to.be.revertedWith("Cannot transfer to the zero address");
    });

    it("Should fail if sender doesn't have enough balance", async () => {
        await expect(environment.puduContract.transferFrom(
            environment.guest1Signer.address,
            environment.guest2Signer.address,
            parseEther("200")
        )).to.be.revertedWith("Not enough balance");
    });

    it("Should fail if sender doesn't have enough allowance", async () => {
        await expect(environment.puduContract.transferFrom(
            environment.guest1Signer.address,
            environment.guest2Signer.address,
            parseEther("5")
        )).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it('Should pay tax fees and execute the transfer', async () => {
        const amountTransferred = parseEther("7");
        // Read balances before transfer
        const guest1Balance: BigNumber = await environment.puduContract.balanceOf(environment.guest1Signer.address);
        const guest2Balance: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);
        const developmentFundBalance: BigNumber = await environment.puduContract.balanceOf(environment.developmentFundSigner.address);
        // Calculate the expected tax fees for a transfer
        const [recipientReceives, amountTaxedNumber]: [BigNumber, BigNumber] = await environment.puduContract.connect(environment.guest1Signer)
            .calculateTax(environment.guest1Signer.address, environment.guest2Signer.address, amountTransferred);
        // Give guest3 allowance to spend guest1 funds
        await environment.puduContract.connect(environment.guest1Signer).approve(environment.guest3Signer.address, parseEther("9999"));
        // Execute the transfer
        await environment.puduContract.connect(environment.guest3Signer).transferFrom(environment.guest1Signer.address, environment.guest2Signer.address, amountTransferred);
        // Read balances after transfer
        const guest1BalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.guest1Signer.address);
        const guest2BalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);
        const developmentFundBalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.developmentFundSigner.address);
        // Validate that guest2 had received the expected amount
        await expect(guest2Balance.add(recipientReceives)).to.be.equal(guest2BalanceAfter);
        // Validate guest1 subtracted amounts
        await expect(guest1Balance.sub(recipientReceives).sub(amountTaxedNumber)).to.be.equal(guest1BalanceAfter);
        // Validate that taxes were received
        await expect(developmentFundBalance.add(amountTaxedNumber)).to.be.equal(developmentFundBalanceAfter);
    });

}