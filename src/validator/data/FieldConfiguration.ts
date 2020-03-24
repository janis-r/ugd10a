import {ValueType} from "./ValueType";

/**
 * Object field validation configuration entry
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
    // Value validator function
    validator?: (value: any, field?: keyof T) => boolean,
    // Array item validator that will be used only in conjunction with array data type
    itemValidator?: (value: any) => boolean,
    // Defines that empty values, such as empty strings, should not be accepted as valid ones
    notEmpty?: boolean,
};
