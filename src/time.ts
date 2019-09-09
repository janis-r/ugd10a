/**
 * Timer utility class
 */
export class Timer {

    /**
     * Get current epoch time
     * @returns {number}
     */
    static get now(): number {
        return Date.now();
    }

    private start = Timer.now;

    /**
     * Reset timer and get elapsed time
     * @returns {number}
     */
    reset(): number {
        const elapsed = this.elapsed;
        this.start = Timer.now;
        return elapsed
    }

    /**
     * Get elapsed time
     * @returns {number}
     */
    get elapsed(): number {
        return Timer.now - this.start;
    }
}

export type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours";

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
            return value * 60 * 1000;
        case "hours" :
            return value * 3600 * 1000;
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
