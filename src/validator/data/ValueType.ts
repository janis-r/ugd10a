/**
 * List of known value types where standard JavaScript types:
 *   "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function"
 * joined with custom array types:
 *   "array" | "string[]" | "number[]"
 */
export type ValueType =
    "undefined"
    | "object"
    | "boolean"
    | "number"
    | "bigint"
    | "string"
    | "symbol"
    | "function"
    | "array"
    | "string[]"
    | "number[]";
