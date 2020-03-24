import {uniqueValues} from "ugd10a";
import {FieldConfiguration} from "./data/FieldConfiguration";
import {ValueType} from "./data/ValueType";
import {isArrayOfNumbers, isArrayOfStrings} from "./is-array-of";

/**
 * Object shape validator utility
 */
export class Validator<T extends Record<string | number, any>> {

    readonly arrayTypes = new Set<ValueType>(["array", "string[]", "number[]"]);
    private _lastError: { error: string, field?: string | number };

    readonly configuration: ReadonlyArray<FieldConfiguration<T>>;

    /**
     * Create new instance
     * @param configuration Definition of object fields to be validate values against - an array where each
     * entry represents single field or key/value map where key represents field name and value is its configuration.
     * @param allowExtraFields Defines if fields unlisted in configuration are permitted.
     */
    constructor(configuration: Array<FieldConfiguration<T>> | Record<FieldConfiguration<T>["field"], Omit<FieldConfiguration<T>, "field">>,
                readonly allowExtraFields = false) {
        if (Array.isArray(configuration)) {
            this.configuration = configuration;
        } else {
            this.configuration = Object.keys(configuration).map(field => ({...configuration[field], field}));
        }
    }

    /**
     * Get last validation error
     */
    get lastError() {
        return this._lastError;
    }

    /**
     * Check if object contents can be validated to match field configuration set up within this validator.
     * @param value
     */
    readonly validate = (value: unknown): value is T => {
        const {validateType, validateFieldList, validateValues} = this;
        this._lastError = undefined;
        return ![validateType, validateFieldList, validateValues].some(func => !func(value));
    };

    /**
     * Only objects are accepted in this validation class - check it here
     * @param value
     */
    private readonly validateType = (value: unknown): boolean => {
        if (typeof value !== "object") {
            this._lastError = {error: `Value is not an object: ${value}`};
            return false;
        }
        return true;
    };

    /**
     * Check if all fields listed in configuration as obligatory are present and extra fields if encountered
     * are allowed.
     * @param value
     */
    private readonly validateFieldList = (value: unknown): boolean => {
        const {configuration, allowExtraFields} = this;
        const definedKeys = new Set(Object.keys(value));
        const missingKeys = configuration.filter(({field, optional}) => {
            if (definedKeys.has(field.toString())) {
                definedKeys.delete(field.toString());
                return false;
            }
            return !optional;
        }).map(({field}) => field);

        if ((!definedKeys.size || allowExtraFields) && !missingKeys.length) {
            return true;
        }

        let error = `Field inconsistency:`;
        if (missingKeys.length) {
            error += ` missingKeys: ${missingKeys}`;
        }
        if (definedKeys.size) {
            error += ` unknownKeys: ${[...definedKeys]}`;
        }

        this._lastError = {error};
        return false;
    };

    /**
     * Validate object values by invoking per entry value checks
     * @param value
     */
    private readonly validateValues = (value: Record<string | number, any>): boolean => {
        const {configuration, validateEntryValue, validateEntryType} = this;
        for (const fieldConfig of configuration) {
            const {field} = fieldConfig;
            if (typeof field !== "number" && typeof field !== "string") {
                throw new Error(`Field type (${field}) mystery encountered - call the detective!`)
            }

            if (!(field in value)) {
                // Field list must already be validated in here so missing field is taken to be optional one,
                // which is not set
                continue;
            }

            const entryValue = value[field];
            if ([validateEntryValue, validateEntryType].some(func => !func(entryValue, fieldConfig))) {
                return false;
            }
        }

        return true;
    };

    private readonly validateEntryValue = (value: unknown, config: FieldConfiguration<T>): boolean => {
        const {arrayTypes} = this;
        const {type, field, notEmpty, validator, itemValidator, exactValue} = config;

        if (typeof field !== "number" && typeof field !== "string") {
            throw new Error(`Field type (${field}) mystery encountered - call the detective!`)
        }

        if (isArrayOfStrings(type)) {
            const result = uniqueValues(type).some(type => this.validateEntryValue(value, {...config, type}));
            if (result || this._lastError) {
                this._lastError = undefined;
            }
            return result;
        }

        if (validator && !validator(value)) {
            this._lastError = {field, error: `Value (${value}) rejected by validator function.`};
            return false;
        }

        if (arrayTypes.has(type)) {
            if (!Array.isArray(value)) {
                this._lastError = {field, error: `Array typed value (${value}) is not an array.`};
                return false;
            }
            if (notEmpty && !value.length) {
                this._lastError = {field, error: `Empty array encountered where it's not allowed.`};
                return false;
            }
            if (itemValidator) {
                for (const entry of value) {
                    if (!itemValidator(entry)) {
                        this._lastError = {
                            field,
                            error: `Array entry: ${JSON.stringify(entry)} is not valid as declared by item validator.`
                        };
                        return false;
                    }
                }
            }
            return true;
        }

        if ("exactValue" in config) {
            if (value !== exactValue) {
                const error = `Exact value mismatch. Expected: ${exactValue}, actual: ${value}`;
                this._lastError = {field, error};
                return false;
            }
        }

        if (notEmpty && value === undefined || (typeof value === "string" && !value.length)) {
            this._lastError = {field, error: `String length mismatch - is empty. Value: ${value}`};
            return false;
        }

        return true;
    };

    private readonly validateEntryType = (value: unknown, config: FieldConfiguration<T>): boolean => {
        const {arrayTypes} = this;
        const {field, type} = config;
        if (!type) {
            return true;
        }

        if (typeof field !== "number" && typeof field !== "string") {
            throw new Error(`Field type (${field}) mystery encountered - call the detective!`)
        }

        if (isArrayOfStrings(type)) {
            // Check if any of types listed as array turn out to match provided value
            const result = uniqueValues(type).some(type => this.validateEntryType(value, {...config, type}));
            // Some of values listed could return false and produce error record.
            // Although if any of types returned true, we're fine and error should not be accessible
            if (result || this._lastError) {
                this._lastError = undefined;
            }
            return result;
        }

        if (arrayTypes.has(type)) {
            if (!Array.isArray(value)) {
                this._lastError = {field, error: `Type mismatch. Type (${value}) is expected to be an array.`};
                return false;
            }
            if (type === "string[]" && !isArrayOfStrings(value)) {
                this._lastError = {
                    field,
                    error: `Type mismatch. Type (${value}) is expected to be an array of strings.`
                };
                return false;
            }
            if (type === "number[]" && !isArrayOfNumbers(value)) {
                this._lastError = {
                    field,
                    error: `Type mismatch. Type (${value}) is expected to be an array of numbers.`
                };
                return false;
            }
            return true;
        }

        const actualType = typeof value;
        if (type !== actualType) {
            this._lastError = {field, error: `Type mismatch. Expected: ${type}, actual: ${actualType}`};
            return false;
        }
        return true;
    }
}
