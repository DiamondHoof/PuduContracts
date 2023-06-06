import {BigNumber, Contract} from "ethers";
import {deployPuduAirDrop} from "../../scripts/deployPuduAirDrop";
import {PuduTestingEnvironment} from "../pudu/@puduTestingEnvironment";
import {parseEther} from "ethers/lib/utils";

export class PuduAirDropTestingEnvironment extends PuduTestingEnvironment{
    puduAirDropContract: Contract;
    tokensPerReferral = parseEther('25');
    tokensPerSignIn: BigNumber = parseEther('100');
    // Initialize this testing environment
    async initialize() {
        await super.initialize();
        this.puduAirDropContract = await deployPuduAirDrop(
            this.tokensPerReferral,
            this.tokensPerSignIn,
            await this.puduContract.address,
        );
        const puduAirDropContractAddress = await this.puduAirDropContract.address;
        await this.puduContract._updateTaxExclusion(puduAirDropContractAddress, true);
        await this.puduContract.transfer(puduAirDropContractAddress, parseEther('1000000'));
    };
}