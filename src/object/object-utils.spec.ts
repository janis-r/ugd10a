import {findObjectKeyForValue, removeObjectNullValues, uniqueValues, valueBelongsToEnum} from "./object-utils";

describe("Object utils", () => {
    it("Can find object key name for value", () => {
        expect(findObjectKeyForValue(Enumuration, Enumuration.A)).toBe("A");
        expect(findObjectKeyForValue(StringEnumuration, StringEnumuration.B)).toBe("B");
    });
    it("Can detect if value is of enum type", () => {
        expect(valueBelongsToEnum(StringEnumuration, "a")).toBe(true);
        expect(valueBelongsToEnum(StringEnumuration, "b")).toBe(true);
        expect(valueBelongsToEnum(StringEnumuration, "c")).toBe(false);
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
        expect(data.b).toBe(undefined);
        expect(data.c.b).toBe(undefined);
    });
    it("Can select unique values from list", () => {
        const list = [1, 2, 3, 4, 4, 5];
        expect(uniqueValues(list).length).toBe(5);
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
