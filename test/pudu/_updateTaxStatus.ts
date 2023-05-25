import {PuduTestingEnvironment} from "./@puduTestingEnvironment";
import {expect} from "chai";

export function _updateTaxStatus() {
    let environment: PuduTestingEnvironment = new PuduTestingEnvironment();
    before(async () => {
        await environment.initialize();
    });

    it('Should fail if not called by the owner', async() => {
        await expect(environment.puduContract
            .connect(environment.guest1Signer) // <----- REVERT
            ._updateTaxStatus(false))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
}