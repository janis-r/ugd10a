import {ValueType} from "./data/ValueType";
import {Validator} from "./Validator";


const builtInTypeMap = new Map<ValueType, any>([
    ["undefined", undefined],
    ["object", {}],
    ["boolean", true],
    ["number", 1],
    ["bigint", BigInt(1)],
    ["string", "string"],
    ["symbol", Symbol("symbol")],
    ["function", () => 1]
]);

/**
 * Validate that only listed types are returned as matching ones
 * @param property Value
 * @param validTypes list of types that should be matched and all other should not
 */
const validateProperty = (property: any, ...validTypes: ValueType[]) => {
    for (const type of builtInTypeMap.keys()) {
        const result = new Validator<{property: any}>([{field: "property", type: type}]).validate({property});
        if (validTypes.includes(type) && result === true) {
            continue;
        }
        if (!validTypes.includes(type) && result !== true) {
            continue;
        }
        return false;
    }
    return true;
};

describe("Object validation", () => {
    it("Non object will cause error", () => {
        expect(new Validator([]).validate(true)).toBe(false);
    });
    it("Allow extra fields is supported", () => {
        expect(new Validator<{}>([], true).validate({a: 1})).toBe(true);
        expect(new Validator<{}>([], false).validate({a: 1})).toBe(false);
    });
    it("Builtin value types are matched correctly", () => {
        for (const [type, property] of builtInTypeMap) {
            expect(validateProperty(property, type)).toBe(true);
        }
    });
    it("Can match array type", () => {
        expect(validateProperty([1, 2, 3], "array", "object")).toBe(true);
        expect(validateProperty([1, 2, 3], "string[]")).toBe(false);
    });
    it("Can match array of strings", () => {
        const validator = new Validator<{property: string[]}>([{field: "property", type: "string[]"}]);
        expect(validator.validate({property: ["1", "2", "3"]})).toBe(true);
        expect(validator.validate({property: ["1", 2, "3"]})).toBe(false);
    });
    it("Can match array of numbers", () => {
        const validator = new Validator<{property: number[]}>([{field: "property", type: "number[]"}]);
        expect(validator.validate({property: [1, 2, 3]})).toBe(true);
        expect(validator.validate({property: ["1", 2, "3"]})).toBe(false);
    });
    it("Can validate field value", () => {
        expect(new Validator<{property: any}>([{field: "property", validator: v => v === 0}]).validate({property: 0})).toBe(true);
    });
    it("Can detect empty value", () => {
        const validator = new Validator<{property: any}>([{field: "property", notEmpty: true}]);
        expect(validator.validate({property: 0})).toBe(true);
        expect(validator.validate({property: false})).toBe(true);
        expect(validator.validate({property: []})).toBe(true);
        expect(validator.validate({property: ''})).toBe(false);
        expect(validator.validate({property: undefined})).toBe(false);
    });
    it("Can validate array item value", () => {
        const validator = new Validator<{property: any[]}>([{field: "property", type: "array", itemValidator: v => v > 0}]);
        expect(validator.validate({property: [1, 2, 3, 4, 5]})).toBe(true);
        expect(validator.validate({property: [1, 2, 0, 4, 5]})).toBe(false);
    });
    it("Can handle optional fields", () => {
        const validator = new Validator<{property?: any}>([{field: "property", optional: true}]);
        expect(validator.validate({property: 1})).toBe(true);
        expect(validator.validate({})).toBe(true);
    });
});
