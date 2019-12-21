import {ExecutionQueue} from "./ExecutionQueue";

describe('ExecutionQueue', () => {
    it('Will execute actions in proper order', async (cb) => {

        const input = [1, 2, 3, 4, 5, 6, 7, 8];
        const output = new Array<number>();

        const queue = new ExecutionQueue();
        for (const entry of input) {
            queue.enqueue(
                async () => {
                    await new Promise<number>(resolve => setTimeout(resolve, 1 + Math.floor(Math.random() * 10)));
                    return entry;
                }
            ).then(response => output.push(response));
        }

        queue.enqueue(
            async () => {
                // Resolving value in enqueued action ain't gonna happen synchronously, we have to wait a little bit
                await new Promise<void>(resolve => setTimeout(resolve, 0));
                expect(output.toString()).toBe(input.toString());
                cb();
            }
        );
    })
});

