import {ValueType} from "./ValueType";
import {Validator} from "../Validator";

/**
 * Object field validation configuration entry
 * @template T Object type that is described within this configuration instance
 */
export type FieldConfiguration<T extends Record<string | number, any> = any> = {
    // Field name within object to validate
    field: keyof T,
    // Defines if it's fine for this field to be missing (default = false)
    optional?: true,
    // Check entry for exact value
    exactValue?: any,
    // Type of data or list of types
    type?: ValueType | ValueType[],
    // Value validator function - boolean returned indicate simple (pass/not pass) value while string returned
    // will be taken as failure with reason to be inserted into error message.
    // Or separate instance of validator serving same purpose and same semantics.
    validator?: ((value: any, field?: keyof T) => boolean | string) | Validator<any>,
    // Array item validator that will be used only in conjunction with array data type
    itemValidator?: (value: any) => boolean,
    // Defines that empty values, such as empty strings, should not be accepted as valid ones
    notEmpty?: boolean,
};
