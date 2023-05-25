import {transfer} from "./transfer";
import {transferFrom} from "./transferFrom";
import {deployment} from "./deployment";
import {calculateTax} from "./calculateTax";

export function puduTests() {
    describe('deployment', deployment);
    describe('function calculateTax', calculateTax);
    describe('function transfer', transfer);
    describe('function transferFrom', transferFrom);
}