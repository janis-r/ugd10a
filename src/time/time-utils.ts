export type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days";

/**
 * Convert value provided in some defined time unit to milliseconds
 * @param {number} value Input value to convert
 * @param {TimeUnit} unit Unit of input value
 * @returns {number} Value in milliseconds
 */
export function toMilliseconds(value: number, unit: TimeUnit = "milliseconds"): number {
    switch (unit) {
        case "seconds" :
            return value * 1000;
        case "minutes" :
            return value * 60000;
        case "hours" :
            return value * 3600000;
        case "days":
            return value * 86400000;
    }
    return value;
}

/**
 * Convert value provided in some defined time unit to seconds
 * @param {number} value Input value to convert
 * @param {TimeUnit} unit Unit of input value
 * @returns {number} Value in seconds
 */
export function toSeconds(value: number, unit: TimeUnit = "seconds"): number {
    switch (unit) {
        case "milliseconds" :
            return Math.round(value / 1000);
        case "minutes" :
            return value * 60;
        case "hours" :
            return value * 3600;
        case "days":
            return value * 86400;
    }
    return value;
}

/**
 * Floor epoch time value to selected time unit
 * @param {number} epoch Epoch time in milliseconds
 * @param {TimeUnit} unit Time unit to which to round value to
 * @returns {number} Input value floored to "seconds" | "minutes" | "hours"
 */
export function floorEpochTo(epoch: number, unit: TimeUnit): number {
    return epoch - epoch % toMilliseconds(1, unit);
}
