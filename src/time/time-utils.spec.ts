import {floorEpochTo, toMilliseconds, toSeconds} from "./time-utils";

describe("To milliseconds converter", () => {
    it("Convert from seconds", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 1000).toBe(toMilliseconds(value, "seconds"));
    });
    it("Convert from minutes", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 1000).toBe(toMilliseconds(value, "minutes"));
    });
    it("Convert from hours", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60 * 1000).toBe(toMilliseconds(value, "hours"));
    });
    it("Convert from days", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60 * 1000 * 24).toBe(toMilliseconds(value, "days"));
    });
    it("Default unit will leave value unchanged", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value).toBe(toMilliseconds(value));
    });
});

describe("To seconds converter", () => {
    it("Convert from milliseconds", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(Math.round(value / 1000)).toBe(toSeconds(value, "milliseconds"));
    });
    it("Convert from minutes", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60).toBe(toSeconds(value, "minutes"));
    });
    it("Convert from hours", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60).toBe(toSeconds(value, "hours"));
    });
    it("Convert from days", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60 * 24).toBe(toSeconds(value, "days"));
    });
    it("Default unit will leave value unchanged", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value).toBe(toSeconds(value));
    });
});

describe("Floor epoch time", () => {
    it("To seconds", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "seconds")).toBe(epoch - epoch % toMilliseconds(1, "seconds"));
    });
    it("To minutes", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "minutes")).toBe(epoch - epoch % toMilliseconds(1, "minutes"));
    });
    it("To hours", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "hours")).toBe(epoch - epoch % toMilliseconds(1, "hours"));
    });
    it("To days", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "days")).toBe(epoch - epoch % toMilliseconds(1, "days"));
    });
});
