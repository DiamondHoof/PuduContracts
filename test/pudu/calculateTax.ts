import {PuduTestingEnvironment} from "./@puduTestingEnvironment";
import {expect} from "chai";
import {BigNumber} from "ethers";
import {parseEther} from "ethers/lib/utils";

export function calculateTax() {
    let environment: PuduTestingEnvironment = new PuduTestingEnvironment();
    before(async () => {
        await environment.initialize();
        // Distribute wealth among guest signers
        await environment.puduContract.transfer(environment.guest1Signer.address, parseEther("25"));
        await environment.puduContract.transfer(environment.guest2Signer.address, parseEther("25"));
    });

    const amountsTransferred = [
        BigNumber.from(1),
        BigNumber.from(250),
        BigNumber.from(500),
        parseEther("0.00001"),
        parseEther("1"),
        parseEther("25"),
    ];

    amountsTransferred.forEach(async (amountTransferred, ) => {
        it(`Should properly calculate fees for ${amountTransferred.toString()} wei on non excluded addresses`, async () => {
            // Calculate the expected tax fees for a transfer
            const [recipientReceives, amountTaxedNumber]: [BigNumber, BigNumber] = await environment.puduContract.connect(environment.guest1Signer)
                .calculateTax(environment.guest1Signer.address, environment.guest2Signer.address, amountTransferred);
            const expectedAmountTaxed = amountTransferred.div(200)
            const expectedRecipientReceives = amountTransferred.sub(expectedAmountTaxed);
            expect(expectedAmountTaxed).to.be.equal(amountTaxedNumber);
            expect(expectedRecipientReceives).to.be.equal(recipientReceives);
        });
    });

    it('Should be free of tax between excluded addresses', async () => {
        const amountTransferred = parseEther("5");
        // Calculate the expected tax fees for a transfer
        const [recipientReceives, amountTaxedNumber]: [BigNumber, BigNumber] = await environment.puduContract
            .calculateTax(environment.deployerSigner.address, environment.nftDropSigner.address, amountTransferred);
        expect(amountTaxedNumber).to.be.equal(BigNumber.from(0));
        expect(recipientReceives).to.be.equal(amountTransferred);
    });

    it('Should be free of tax if taxes are disabled', async () => {
        const amountTransferred = parseEther("5");
        // Disable taxes
        await environment.puduContract._updateTaxStatus(false);
        // Calculate the expected tax fees for a transfer
        const [recipientReceives, amountTaxedNumber]: [BigNumber, BigNumber] = await environment.puduContract.connect(environment.guest1Signer)
            .calculateTax(environment.guest1Signer.address, environment.guest2Signer.address, amountTransferred);
        expect(amountTaxedNumber).to.be.equal(BigNumber.from(0));
        expect(recipientReceives).to.be.equal(amountTransferred);
    });
}