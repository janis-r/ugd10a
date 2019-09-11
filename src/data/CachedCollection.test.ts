import {expect} from "chai";
import {CachedCollection} from "./CachedCollection";

const fetchFunction = async (setOfI: Set<number>) => new Map([...setOfI].map((i): [number, string] => ([i, i.toString()])));

describe("CachedCollection", () => {

    it("Will check if fetch function is provided", () => {
        expect(() => new CachedCollection(null as any, 1)).to.throw(Error);
        expect(() => new CachedCollection(fetchFunction, 1)).not.to.throw(Error);
    });

    it("Will check if valid TTL is provided", () => {
        expect(() => new CachedCollection(fetchFunction, -1)).to.throw(Error);
        expect(() => new CachedCollection(fetchFunction, 0)).to.throw(Error);
        expect(() => new CachedCollection(fetchFunction, 1)).not.to.throw(Error);
    });

    it("Will provide value returned by update function", async () => {
        const collection = new CachedCollection(fetchFunction, 1);
        const inputs = new Set([1, 2, 3]);
        const outputs = await collection.getData(inputs);
        inputs.forEach(i => expect(outputs.get(i)).to.equal(i.toString()));
    });

    it("Will fetch only new values", async () => {
        const requestSizeReport: number[] = [];
        const localFetchFun = async (setOfI: Set<number>) => {
            requestSizeReport.push(setOfI.size);
            return fetchFunction(setOfI);
        };

        const requests = [
            [1, 2, 3],
            [4, 5],
            [1, 2, 3, 4, 5, 6],
        ];

        const collection = new CachedCollection(localFetchFun, 10);
        for (const request of requests) {
            await collection.getData(new Set(request));
        }

        const itemIdTrack = new Set<number>();
        requests.forEach((request, index) => {
            const uniqueItemCount = request.filter(i => !itemIdTrack.has(i)).length;
            expect(uniqueItemCount).to.equal(requestSizeReport[index]);
            request.forEach(v => itemIdTrack.add(v));
        });
    });

    it("Collection size is reported correctly", async () => {
        const collection = new CachedCollection(fetchFunction, 1);
        const inputs = new Set([1, 2, 3]);
        const dataPromise = collection.getData(inputs);
        expect(collection.size).to.equal(0);
        expect(collection.entriesInProgress).to.equal(inputs.size);
        await dataPromise;
        expect(collection.size).to.equal(inputs.size);
    });

    it("Collection is cleaned up within value provided for TTL", async () => {
        const collection = new CachedCollection(fetchFunction, 1);
        const inputs = new Set([1, 2, 3]);
        await collection.getData(inputs);
        expect(collection.size).to.equal(inputs.size);
        await new Promise(resolve => setTimeout(resolve, 20));
        expect(collection.size).to.equal(0);
    });

    it("Input type guard will notice invalid inputs", async () => {
        const collection = new CachedCollection(
            fetchFunction,
            1,
            (value: unknown): value is number => typeof value === 'number'
        );
        const inputs = new Set([1, "2" as any, 3]);

        let errorEncountered: boolean = false;
        try {
            await collection.getData(inputs);
        } catch (e) {
            errorEncountered = true;
        }
        expect(errorEncountered).to.equal(true);
    });
});
