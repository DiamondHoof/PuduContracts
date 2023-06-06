import {PuduAirDropTestingEnvironment} from "./@puduAirDropTestingEnvironment";
import {expect} from "chai";
import {ethers} from "hardhat";

export function finishAirDropAndWithdrawTokens() {
    let environment: PuduAirDropTestingEnvironment;

    before(async () => {
        environment = new PuduAirDropTestingEnvironment();
        await environment.initialize();
    });

    it('Should only allow the contract owner to finish the airdrop and withdraw tokens', async () => {
        await expect(environment.puduAirDropContract.connect(environment.guest1Signer).finishAirDropAndWithdrawTokens()).to.be.revertedWith(
            'Ownable: caller is not the owner'
        );
    });

    it('Should withdraw remaining tokens to the contract owner', async () => {
        const contractDeployerBalanceBefore = await environment.puduContract.balanceOf(environment.deployerSigner.address);
        const contractBalanceBefore = await environment.puduContract.balanceOf(environment.puduAirDropContract.address);

        await environment.puduAirDropContract.finishAirDropAndWithdrawTokens();

        const contractDeployerBalanceAfter = await environment.puduContract.balanceOf(environment.deployerSigner.address);
        const contractBalanceAfter = await environment.puduContract.balanceOf(environment.puduAirDropContract.address);

        expect(contractDeployerBalanceAfter).to.equal(contractDeployerBalanceBefore.add(contractBalanceBefore));
        expect(contractBalanceAfter).to.equal(ethers.constants.Zero);
    });

    it('Should revert if there are no tokens available in the contract', async () => {
        await expect(environment.puduAirDropContract.finishAirDropAndWithdrawTokens()).to.be.revertedWith('No PUDU available');
    });
}