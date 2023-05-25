import {transfer} from "./transfer";
import {transferFrom} from "./transferFrom";

export function puduTests() {
    describe('function transfer', transfer);
    describe('function transferFrom', transferFrom);
}