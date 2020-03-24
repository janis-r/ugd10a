import {isArrayOfNumbers, isArrayOfStrings} from "./is-array-of";

describe('Is array of check', () => {
    it ('Can validate array of strings', () => {
        expect(isArrayOfStrings(['1', '2', '3'])).toBe(true);
        expect(isArrayOfStrings([])).toBe(true);
        expect(isArrayOfStrings(['1', '2', 3])).toBe(false);
        expect(isArrayOfStrings(null)).toBe(false);
    });
    it ('Can validate array of numbers', () => {
        expect(isArrayOfNumbers([1, 2, 3])).toBe(true);
        expect(isArrayOfNumbers([])).toBe(true);
        expect(isArrayOfNumbers(['1', '2', 3])).toBe(false);
        expect(isArrayOfNumbers(null)).toBe(false);
    });
});
