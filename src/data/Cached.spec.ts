import {Cached} from "./Cached";

describe("Data Cache", () => {
    it("Will throw error if TTL is unusable", () => {
        expect(() => new Cached<number>(async () => 1, 0)).toThrowError();
    });
    it("Will provide value returned by update function", async () => {
        const data = new Cached<number>(async () => 0xFF,1);
        expect(await data.getData()).toBe(0xFF);
    });
    it("Will cache data for time set in TTL and request new as time has passed", async () => {
        let iterator = 0;
        const data = new Cached<number>(async () => ++iterator, 10, true);
        // Data is cached for 10 ms, so both calls must return 1
        expect(await data.getData()).toBe(1);
        expect(await data.getData()).toBe(1);
        // Sleep for 10+1 ms
        await new Promise(resolve => setTimeout(resolve, data.ttl + 1));
        // First call to data should return cached value and request new data
        expect(await data.getData()).toBe(1);
        // That should be preset now
        expect(await data.getData()).toBe(2);
        expect(await data.getData()).toBe(2);
    });
    it("Will comply with no cache while updating policy", async () => {
        let iterator = 0;
        const data = new Cached<number>(
            () => new Promise<number>(resolve => setTimeout(() => resolve(++iterator), 3)),
            10,
            false
        );
        // Request first data entry and check that it's still first iteration
        expect(await data.getData()).toBe(1);
        // Sleep for ttl + 1 ms
        await new Promise(resolve => setTimeout(resolve, data.ttl + 1));
        // No cache policy implies that no outdated data should be returned and this must return a new one
        expect(await data.getData()).toBe(2);

    });
    it("Update can be enforced", async () => {
        let iterator = 0;
        const data = new Cached<number>(
            () => new Promise<number>(resolve => setTimeout(() => resolve(++iterator), 3)),
            10
        );
        // Request first data entry and check that it's still first iteration
        expect(await data.getData()).toBe(1);
        // Data should be cached but I break the cycle by forcing update
        expect(await data.forceUpdate()).toBe(2);

    });
});
