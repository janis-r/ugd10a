/**
 * Find key in object by value
 * @param {{}} object
 * @param value Value to lookup
 * @returns {string | null}
 */
export function findObjectKeyForValue(object: {[key:string]:any}, value: any): string | null {
    const keys = Object.keys(object);
    while (keys && keys.length > 0) {
        const key = keys.shift()!;
        if (object.hasOwnProperty(key) && object[key] === value) {
            return key;
        }
    }
    return null;
}

/**
 * Generic Enum object type guard
 * @param {T} object
 * @param value
 * @returns {value is T}
 */
export function valueBelongsToEnum<T>(object: T, value: any): value is T {
    return findObjectKeyForValue(object, value) !== null;
}

/**
 * Clean object by removing all keys that has got a null value, recursively
 * @param {{}} object
 * @returns {{}} Object passed in as argument with null values deleted
 */
export function removeObjectNullValues<T>(object: T): T {
    for (const i in object) {
        if (!object.hasOwnProperty(i)) {
            continue;
        }
        if (object[i] === null) {
            delete object[i];
            continue;
        }
        if (typeof object[i] === "object") {
            object[i] = removeObjectNullValues(object[i]);
        }
    }
    return object;
}

/**
 * Extract only unique, non duplicating values from set
 * @param {T[]} values
 * @returns {T[]}
 */
export function uniqueValues<T>(values: T[]): T[] {
    const newSet: T[] = [];
    for (const entry of values) {
        if (newSet.indexOf(entry) === -1) {
            newSet.push(entry);
        }
    }
    return newSet;
}