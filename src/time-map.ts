/**
 * Transform date object into Map object representing Date object components
 * @param time
 */
export const timeToMap = (time: Date) => {
    const keys = [TimePart.Date, TimePart.Month, TimePart.Year, TimePart.Hours, TimePart.Minutes, TimePart.Seconds, TimePart.Epoch];
    const values = [
        time.getDate(),
        time.getMonth() + 1,
        time.getFullYear(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getTime()
    ];

    return new (class ExtendedMap extends Map<TimePart, number> {
        /**
         * Get time object representation as an object
         */
        asObject(): TimeMap {
            const data: Partial<TimeMap> = {};
            [...this].forEach(([key, value]) => data[key] = value);
            return data as TimeMap;
        }
    })(keys.map((key, index): [TimePart, number] => ([key, values[index]])))
};

/**
 * Transform date object into Map object representing Date object components
 * @param time
 */
export const timeToObject = (time: Date) => timeToMap(time).asObject();

/**
 * Get current time as map
 */
export const currentDateToMap = () => timeToMap(new Date());

/**
 * Get current time as object
 */
export const currentDateToObject = () => timeToObject(new Date());

/**
 * List of time components it gets spread to.
 */
export enum TimePart {
    Date = "date",
    Month = "month",
    Year = "year",
    Hours = "hours",
    Minutes = "minutes",
    Seconds = "seconds",
    Epoch = "epoch",
}

type TimeMap = {
    [key in TimePart]: number
};


