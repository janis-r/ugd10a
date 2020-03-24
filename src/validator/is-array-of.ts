export const isArrayOfStrings = (entry: unknown): entry is Array<string> =>
    Array.isArray(entry) && !entry.some(v => typeof v !== "string");

export const isArrayOfNumbers = (entry: unknown): entry is Array<number> =>
    Array.isArray(entry) && !entry.some(v => typeof v !== "number");
