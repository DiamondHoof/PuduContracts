import {PuduTestingEnvironment} from "./@puduTestingEnvironment";
import {expect} from "chai";
import {BigNumber} from "ethers";

export function deployment() {
    let environment: PuduTestingEnvironment = new PuduTestingEnvironment();
    before(async () => {
        await environment.initialize();
    });
    it('Tax amount should be set to 200 (0.5%, one half of one percent)', async () => {
        expect(await environment.puduContract._taxAmount()).to.be.equal(BigNumber.from(200));
    });
}