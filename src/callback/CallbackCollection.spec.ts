import { CallbackCollection } from "./CallbackCollection";

describe('CallbackCollection', () => {
    it('Can add and execute callbacks', () => {
        const collection = new CallbackCollection<boolean>();
        let counter = 0;
        const callbacks = [
            () => counter++,
            () => counter++,
            () => counter++,
        ];
        callbacks.forEach(callback => collection.add(callback));
        collection.execute(true);
        expect(counter).toBe(callbacks.length);
    });
    it(`Double adding of callback ain't gonna make callback execute twice`, () => {
        const collection = new CallbackCollection<boolean>();
        let counter = 0;
        const callbacks = [
            () => counter++,
            () => counter++,
            () => counter++,
        ];
        callbacks.forEach(callback => collection.add(callback));
        callbacks.forEach(callback => collection.add(callback));
        const executedCount = collection.execute(true);
        expect(counter).toBe(callbacks.length);
        expect(executedCount).toBe(callbacks.length);
    });
    it(`Callback can be marked to execute only once`, () => {
        const collection = new CallbackCollection<void>();
        let counter = 0;
        collection.add(() => counter++).once!();
        collection.execute();
        collection.execute();
        expect(counter).toBe(1);
    });
    it(`Callback can be set to execute number of times`, () => {
        const collection = new CallbackCollection<void>();
        let counter = 0;
        collection.add(() => counter++).times!(4);
        new Array(10).fill(0).forEach(() => collection.execute());
        expect(counter).toBe(4);
    });
    it(`Callback execution can be filtered`, () => {
        const collection = new CallbackCollection<number>();
        let counter = 0;
        collection.add(() => counter++).guard!(data => data > 0);
        collection.execute(0);
        collection.execute(1);
        collection.execute(0);
        collection.execute(1);
        expect(counter).toBe(2);
    });
    it(`On complete will be triggered as execution count is reached`, done => {
        const collection = new CallbackCollection<number>();
        let counter = 0;
        collection.add(() => counter++).guard!(data => data > 0).times!(2).onComplete(done);
        collection.execute(0);
        collection.execute(1);
        collection.execute(0);
        collection.execute(1);
        expect(counter).toBe(2);
    });
});
