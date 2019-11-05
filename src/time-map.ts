/**
 * Transform date object into Map object representing Date object components
 * @param time
 */
export const timeToObject = (time: Date): TimeMap & { toMap: () => Map<TimePart, number> } => {
    const values: [TimePart, number][] = [
        [TimePart.Date, time.getDate()],
        [TimePart.Month, time.getMonth() + 1],
        [TimePart.Year, time.getFullYear()],
        [TimePart.Hours, time.getHours()],
        [TimePart.Minutes, time.getMinutes()],
        [TimePart.Seconds, time.getSeconds()],
        [TimePart.Epoch, time.getTime()]
    ];

    const timeMap: Partial<TimeMap> = {};
    values.forEach(([key, value]) => timeMap[key] = value);
    return {
        ...timeMap as TimeMap,
        toMap: () => new Map(values)
    };
};

/**
 * Transform date object into Map object representing Date object components
 * @param time
 */
export const timeToMap = (time: Date): Map<TimePart, number> => timeToObject(time).toMap();

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


