import {signIn} from "./signIn";
import {updateTokenRewards} from "./updateTokenRewards";
import {finishAirDropAndWithdrawTokens} from "./finishAirDropAndWithdrawTokens";

export function puduAirDropTests() {
    describe('signIn', signIn);
    describe('updateTokenRewards',updateTokenRewards);
    describe('finishAirDropAndWithdrawTokens', finishAirDropAndWithdrawTokens);
}