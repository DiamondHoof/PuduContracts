import {transfer} from "./transfer";
import {transferFrom} from "./transferFrom";
import {deployment} from "./deployment";
import {calculateTax} from "./calculateTax";
import {_updateTaxExclusion} from "./_updateTaxExclusion";
import {_updateTaxStatus} from "./_updateTaxStatus";

export function puduTests() {
    describe('deployment', deployment);
    describe('function calculateTax', calculateTax);
    describe('function transfer', transfer);
    describe('function transferFrom', transferFrom);
    describe('function _updateTaxExclusion', _updateTaxExclusion);
    describe('function _updateTaxStatus', _updateTaxStatus);
}