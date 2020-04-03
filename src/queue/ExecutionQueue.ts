/**
 * Enqueue list of actions and execute them in linear manner
 */
export class ExecutionQueue {

    private readonly queue = new Array<EnqueuedAction<any>>();
    /**
     * Add action to queue
     * @template T Return type of an action
     * @param action
     */
    readonly enqueue = async <T>(action: Action<T>) => new Promise<ReturnType<Action<T>>>((resolve, reject) => {
        const {queue} = this;
        queue.push(
            async () => {
                try {
                    const response = await action();
                    resolve(response);
                    return response;
                } catch (e) {
                    reject(e);
                    return null;
                }
            }
        );

        if (queue.length === 1) {
            this.executeNext();
        }
    });

    private async executeNext() {
        const {queue} = this;
        if (queue.length === 0) {
            return;
        }

        await queue[0]();
        queue.shift();
        this.executeNext();
    }

}

/**
 * @template T Return type of an action
 */
type Action<T> = () => T | Promise<T>;

/**
 * @template T Return type of an action
 */
type EnqueuedAction<T> = () => Promise<ReturnType<Action<T>>>;
