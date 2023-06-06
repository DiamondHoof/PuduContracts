import { ethers } from 'hardhat';
import { expect } from 'chai';
import {PuduAirDropTestingEnvironment} from "./@puduAirDropTestingEnvironment";
import {BigNumber} from "ethers";

export function signIn() {
    let environment: PuduAirDropTestingEnvironment = new PuduAirDropTestingEnvironment();
    before(async () => {
        await environment.initialize();
    });

    it('Should allow a participant to sign in without a referrer', async () => {
        const guest2Balance: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);
        await environment.puduAirDropContract.connect(environment.guest2Signer).signIn(ethers.constants.AddressZero);
        const participantData = await environment.puduAirDropContract._participants(environment.guest2Signer.address);
        const airDropStats = await environment.puduAirDropContract._airDropStats();
        const guest2BalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);

        expect(participantData.signedIn).to.be.true;
        expect(participantData.referrer).to.equal(ethers.constants.AddressZero);
        expect(participantData.referralCount).to.equal(0);
        expect(participantData.tokensReceived).to.equal(environment.tokensPerSignIn);

        expect(airDropStats.totalSigns).to.equal(1);
        expect(airDropStats.totalReferred).to.equal(0);
        expect(airDropStats.puduGiven).to.equal(environment.tokensPerSignIn);

        expect(guest2Balance.add(environment.tokensPerSignIn)).to.equal(guest2BalanceAfter);
    });

    it('Should allow a participant to sign in with a referrer', async () => {
        const referrerBalance: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);
        await environment.puduAirDropContract.connect(environment.guest1Signer).signIn(environment.guest2Signer.address);
        const participantData = await environment.puduAirDropContract._participants(environment.guest1Signer.address);
        const referrerData = await environment.puduAirDropContract._participants(environment.guest2Signer.address);
        const referrerBalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.guest2Signer.address);
        const airDropStats = await environment.puduAirDropContract._airDropStats();

        expect(participantData.signedIn).to.be.true;
        expect(participantData.referrer).to.be.equal(environment.guest2Signer.address);
        expect(participantData.referralCount).to.be.equal(0);
        expect(participantData.tokensReceived).to.be.equal(environment.tokensPerSignIn);

        // At this point the referrer should have received both the singIn and referral rewards
        expect(referrerData.referralCount).to.equal(1);
        expect(referrerData.tokensReceived).to.equal(environment.tokensPerSignIn.add(environment.tokensPerReferral));
        expect(referrerBalance.add(environment.tokensPerReferral)).to.be.equal(referrerBalanceAfter);

        expect(airDropStats.totalSigns).to.equal(2);
        expect(airDropStats.totalReferred).to.equal(1);
        expect(airDropStats.puduGiven).to.equal(environment.tokensPerSignIn.mul(2).add(environment.tokensPerReferral));
    });

    it('Should not allow a participant to sign in multiple times', async () => {
        await expect(environment.puduAirDropContract.connect(environment.guest2Signer).signIn(ethers.constants.AddressZero))
            .to.be.revertedWith('You have already signed in');
    });

    it('Should not allow self-referral', async () => {
        await expect(environment.puduAirDropContract.connect(environment.guest3Signer).signIn(environment.guest3Signer.address))
            .to.be.revertedWith('Cannot refer yourself');
    });

    it('Should not transfer referral tokens if referrer has not signed in', async () => {
        const referrerBalance: BigNumber = await environment.puduContract.balanceOf(environment.guest5Signer.address);
        // Sign in a participant with a referrer who has not signed in
        await environment.puduAirDropContract.connect(environment.guest4Signer).signIn(environment.guest5Signer.address);

        const participantData = await environment.puduAirDropContract._participants(environment.guest4Signer.address);
        const referrerData = await environment.puduAirDropContract._participants(environment.guest5Signer.address);
        const referrerBalanceAfter: BigNumber = await environment.puduContract.balanceOf(environment.guest5Signer.address);

        expect(participantData.signedIn).to.be.true;
        expect(participantData.referrer).to.be.equal(ethers.constants.AddressZero);
        expect(participantData.referralCount).to.be.equal(0);
        expect(participantData.tokensReceived).to.be.equal(environment.tokensPerSignIn);

        expect(referrerData.referralCount).to.equal(0);
        expect(referrerData.tokensReceived).to.equal(0);
        expect(referrerBalance).to.be.equal(referrerBalanceAfter);
    });

    it('Should not allow signing in when no PUDU tokens are available', async () => {
        await environment.puduAirDropContract.finishAirDropAndWithdrawTokens();
        await expect(environment.puduAirDropContract.connect(environment.guest3Signer).signIn(environment.guest2Signer.address))
            .to.be.revertedWith('No PUDU available');
    });

}