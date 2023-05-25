import {PuduTestingEnvironment} from "./@puduTestingEnvironment";
import {expect} from "chai";

export function _updateTaxExclusion() {
    let environment: PuduTestingEnvironment = new PuduTestingEnvironment();
    before(async () => {
        await environment.initialize();
    });

    it('Should fail if not called by the owner', async() => {
        await expect(environment.puduContract
            .connect(environment.guest1Signer) // <----- REVERT
            ._updateTaxExclusion(environment.guest1Signer.address, true))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
}