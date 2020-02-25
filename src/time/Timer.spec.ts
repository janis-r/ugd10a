import {Timer} from "./Timer";

describe("Timer utility", () => {
    it("Should return current epoch milliseconds from static accessor", () => {
        const now = Timer.now;
        const epoch = new Date().getTime();
        expect(now).toBe(epoch);
    });
    it("Can measure time via elapsed property", async () => {
        const timer = new Timer();
        const startTime = new Date().getTime();

        await new Promise(resolve => setTimeout(resolve, 10));

        const timerElapsed = timer.elapsed;
        const timeElapsed = new Date().getTime() - startTime;

        expect(timeElapsed).toBe(timerElapsed);
    });
    it("Will reset if asked to", async () => {
        const timer = new Timer();
        await new Promise(resolve => setTimeout(resolve, 10));

        const elapsedValue = timer.elapsed;
        const resetValue = timer.reset();
        expect(timer.elapsed).toBe(0);
        expect(elapsedValue).toBe(resetValue);
    });
});
