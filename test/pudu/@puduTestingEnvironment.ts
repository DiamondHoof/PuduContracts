import {ethers} from "hardhat";
import {Contract} from "ethers";
import {deployPudu} from "../../scripts/deployPudu";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

export class PuduTestingEnvironment {
    // Account signers
    accountSigners: SignerWithAddress[];
    deployerSigner: SignerWithAddress;
    developmentFundSigner: SignerWithAddress;
    nftDropSigner: SignerWithAddress;
    guest1Signer: SignerWithAddress;
    guest2Signer: SignerWithAddress;
    // Proxy Contracts
    puduContract: Contract;
    // Initialize this testing environment
    async initialize() {
        // Set Signers
        this.accountSigners = await ethers.getSigners();
        this.deployerSigner = this.accountSigners[0];
        this.developmentFundSigner = this.accountSigners[1];
        this.nftDropSigner = this.accountSigners[2];
        this.guest1Signer = this.accountSigners[3];
        this.guest2Signer = this.accountSigners[4];
        // Set Contracts
        this.puduContract = await deployPudu(
            await this.developmentFundSigner.getAddress(),
            await this.nftDropSigner.getAddress(),
        );
    };
}