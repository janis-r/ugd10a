import {TimePart, timeToMap, timeToObject} from "./time-map";

describe("Time mapping", () => {

    it("Time to object is parsed correctly", () => {
        const date = 11;
        const month = 10;
        const year = 2001;
        const hours = 12;
        const minutes = 21;
        const seconds = 22;

        const parsed = timeToObject(new Date(`${year}-${month}-${date}T${hours}:${minutes}:${seconds}`));

        expect(parsed.date).toBe(date);
        expect(parsed.month).toBe(month);
        expect(parsed.year).toBe(year);
        expect(parsed.hours).toBe(hours);
        expect(parsed.minutes).toBe(minutes);
        expect(parsed.seconds).toBe(seconds);
    });

    it("Time to map is parsed correctly", () => {
        const date = 11;
        const month = 10;
        const year = 2001;
        const hours = 12;
        const minutes = 21;
        const seconds = 22;

        const parsed = timeToMap(new Date(`${year}-${month}-${date}T${hours}:${minutes}:${seconds}`));

        expect(parsed.get(TimePart.Date)).toBe(date);
        expect(parsed.get(TimePart.Month)).toBe(month);
        expect(parsed.get(TimePart.Year)).toBe(year);
        expect(parsed.get(TimePart.Hours)).toBe(hours);
        expect(parsed.get(TimePart.Minutes)).toBe(minutes);
        expect(parsed.get(TimePart.Seconds)).toBe(seconds);
    });

});
