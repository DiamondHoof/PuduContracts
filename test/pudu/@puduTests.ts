import {transfer} from "./transfer";
import {transferFrom} from "./transferFrom";
import {deployment} from "./deployment";

export function puduTests() {
    describe('deployment', deployment);
    describe('function transfer', transfer);
    describe('function transferFrom', transferFrom);
}