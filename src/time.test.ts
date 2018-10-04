import {expect} from "chai";
import {floorEpochTo, Timer, toMilliseconds, toSeconds} from "./time";

describe("Timer utility", () => {
    it("Should return current epoch milliseconds from static accessor", () => {
        const now = Timer.now;
        const epoch = new Date().getTime();
        expect(now).to.equal(epoch);
    });
    it("Can measure time via elapsed property", async () => {
        const timer = new Timer();
        const startTime = new Date().getTime();

        await new Promise(resolve => setTimeout(resolve, 10));

        const timerElapsed = timer.elapsed;
        const timeElapsed = new Date().getTime() - startTime;

        expect(timeElapsed).to.equal(timerElapsed);
    });
    it("Will reset if asked to", async () => {
        const timer = new Timer();
        await new Promise(resolve => setTimeout(resolve, 10));

        const elapsedValue = timer.elapsed;
        const resetValue = timer.reset();
        expect(elapsedValue).to.equal(resetValue);
        expect(timer.elapsed).to.equal(0);
    });
});

describe("To milliseconds converter", () => {
    it("Convert from seconds", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 1000).to.equal(toMilliseconds(value, "seconds"));
    });
    it("Convert from minutes", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 1000).to.equal(toMilliseconds(value, "minutes"));
    });
    it("Convert from hours", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60* 1000).to.equal(toMilliseconds(value, "hours"));
    });
    it("Default unit will leave value unchanged", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value).to.equal(toMilliseconds(value));
    });
});

describe("To seconds converter", () => {
    it("Convert from milliseconds", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(Math.round(value / 1000)).to.equal(toSeconds(value, "milliseconds"));
    });
    it("Convert from minutes", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60).to.equal(toSeconds(value, "minutes"));
    });
    it("Convert from hours", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value * 60 * 60).to.equal(toSeconds(value, "hours"));
    });
    it("Default unit will leave value unchanged", () => {
        const value = Math.floor(Math.random() * 0xFFFFFF);
        expect(value).to.equal(toSeconds(value));
    });
});

describe("Floor epoch time", () => {
    it("To seconds", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "seconds")).to.equal(epoch - epoch % toMilliseconds(1, "seconds"));
    });
    it("To minutes", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "minutes")).to.equal(epoch - epoch % toMilliseconds(1, "minutes"));
    });
    it("To hours", () => {
        const epoch = new Date().getTime();
        expect(floorEpochTo(epoch, "hours")).to.equal(epoch - epoch % toMilliseconds(1, "hours"));
    });
});