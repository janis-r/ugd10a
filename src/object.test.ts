import {expect} from "chai";
import {findObjectKeyForValue, removeObjectNullValues, valueBelongsToEnum, uniqueValues} from "./object";

describe("Object utils", () => {
    it("Can find object key name for value", () => {
        expect(findObjectKeyForValue(Enumuration, Enumuration.A)).to.equal("A");
        expect(findObjectKeyForValue(StringEnumuration, StringEnumuration.B)).to.equal("B");
    });
    it("Can detect if value is of enum type", () => {
        expect(valueBelongsToEnum(StringEnumuration, "a")).to.equal(true);
        expect(valueBelongsToEnum(StringEnumuration, "b")).to.equal(true);
        expect(valueBelongsToEnum(StringEnumuration, "c")).to.equal(false);
    });
    it("Can remove null values from object", () => {
        const data = removeObjectNullValues({
            a: 1,
            b: null,
            c: {
                a: 1,
                b: null
            }
        });
        expect(data.b).to.equal(undefined);
        expect(data.c.b).to.equal(undefined);
    });
    it("Can select unique values from list", () => {
        const list = [1,2,3,4,4,5];
        expect(uniqueValues(list).length).to.equal(5);
    });
});


enum Enumuration {
    A,
    B
}

enum StringEnumuration {
    A = "a",
    B = "b"
}