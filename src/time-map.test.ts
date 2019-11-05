import {expect} from "chai";
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

        expect(parsed.date).to.equal(date);
        expect(parsed.month).to.equal(month);
        expect(parsed.year).to.equal(year);
        expect(parsed.hours).to.equal(hours);
        expect(parsed.minutes).to.equal(minutes);
        expect(parsed.seconds).to.equal(seconds);
    });

    it("Time to map is parsed correctly", () => {
        const date = 11;
        const month = 10;
        const year = 2001;
        const hours = 12;
        const minutes = 21;
        const seconds = 22;

        const parsed = timeToMap(new Date(`${year}-${month}-${date}T${hours}:${minutes}:${seconds}`));

        expect(parsed.get(TimePart.Date)).to.equal(date);
        expect(parsed.get(TimePart.Month)).to.equal(month);
        expect(parsed.get(TimePart.Year)).to.equal(year);
        expect(parsed.get(TimePart.Hours)).to.equal(hours);
        expect(parsed.get(TimePart.Minutes)).to.equal(minutes);
        expect(parsed.get(TimePart.Seconds)).to.equal(seconds);
    });

});
