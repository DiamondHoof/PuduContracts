import {PuduAirDropTestingEnvironment} from "./@puduAirDropTestingEnvironment";
import {expect} from "chai";
import {parseEther} from "ethers/lib/utils";

export function updateTokenRewards() {
    let environment: PuduAirDropTestingEnvironment;

    before(async () => {
        environment = new PuduAirDropTestingEnvironment();
        await environment.initialize();
    });

    it('Should only allow the contract owner to update the token rewards', async () => {
        const newTokensPerSignIn = parseEther('500');
        const newTokensPerReferral = parseEther('1000');
        await expect(
            environment.puduAirDropContract.connect(environment.guest1Signer).updateTokenRewards(newTokensPerSignIn, newTokensPerReferral)
        ).to.be.revertedWith('Ownable: caller is not the owner');

        expect(await environment.puduAirDropContract._tokensPerSignIn()).to.not.equal(newTokensPerSignIn);
        expect(await environment.puduAirDropContract._tokensPerReferral()).to.not.equal(newTokensPerReferral);
    });

    it('Should update the token rewards by changing the tokensPerSignIn and tokensPerReferral values', async () => {
        const newTokensPerSignIn = parseEther('500');
        const newTokensPerReferral = parseEther('1000');

        await environment.puduAirDropContract.updateTokenRewards(newTokensPerSignIn, newTokensPerReferral);

        expect(await environment.puduAirDropContract._tokensPerSignIn()).to.equal(newTokensPerSignIn);
        expect(await environment.puduAirDropContract._tokensPerReferral()).to.equal(newTokensPerReferral);
    });
}
