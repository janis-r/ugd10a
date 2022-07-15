export class CallbackCollection<T> {

    private readonly callbacks = new Map<CallbackFunction<T>, CallbackProperties<T>>();

    constructor() {
        this.manage = this.manage.bind(this);
    }

    /**
     * Add callback to collection
     * @param callback
     */
    readonly add = (callback: CallbackFunction<T>): CallbackManager<T> => {
        const { callbacks } = this;
        if (callbacks.has(callback)) {
            return { success: false };
        }

        const callbackProps: CallbackProperties<T> = {};
        callbacks.set(callback, callbackProps);

        const onComplete = (callback: OnCompleteCallback) => callbackProps.onComplete = callback;
        const times = (count: number) => {
            callbackProps.executionLimit = count;
            return { onComplete };
        };
        const once = () => times(1);
        const twice = () => times(2);
        const guard = (func: GuardFunction<T>) => {
            callbackProps.guard = func;
            return { once, twice, times };
        };

        return { success: true, guard, once, twice, times };
    };
    /**
     * Check if collection has registered callback
     * @param callback
     */
    readonly has = (callback: CallbackFunction<T>) => this.callbacks.has(callback);
    /**
     * Remove callback
     * @param callback
     */
    readonly remove = (callback: CallbackFunction<T>): boolean => {
        const { callbacks } = this;
        if (callbacks.has(callback)) {
            callbacks.delete(callback);
            return true;
        }
        return false;
    };
    /**
     * Remove all callbacks
     */
    readonly clear = () => this.callbacks.clear();

    /**
     * Add callback to collection, if it's provided and return CallbackManager
     * @param callback
     */
    manage(callback: CallbackFunction<T>): CallbackManager<T>;
    /**
     * If no callback is specified proceed to collection management methods
     */
    manage(): Pick<this, "has" | "remove" | "clear">;
    manage(callback?: CallbackFunction<T>) {
        if (callback) {
            return this.add(callback);
        }
        const { has, remove, clear } = this;
        return { has, remove, clear };
    }

    /**
     * Execute all callbacks
     * @param data
     */
    readonly execute = (data: T): number => {
        const { callbacks } = this;
        let executed = 0;
        for (const [callback, properties] of callbacks) {
            if (properties.guard && !properties.guard(data)) {
                continue;
            }

            callback(data);
            executed++;
            if (properties.executionLimit) {
                if (!properties.executionCount) {
                    properties.executionCount = 1;
                } else {
                    properties.executionCount++;
                }
                if (properties.executionCount === properties.executionLimit) {
                    if (properties.onComplete) {
                        properties.onComplete();
                    }
                    callbacks.delete(callback);
                }
            }
        }

        return executed;
    };
}

type CallbackFunction<T> = (data: T) => unknown;
type GuardFunction<T> = (data: T) => boolean;
type OnCompleteCallback = () => void;
type CallbackProperties<T> = {
    executionLimit?: number,
    executionCount?: number,
    guard?: GuardFunction<T>,
    onComplete?: OnCompleteCallback
};

export type CallbackManager<T> = {
    /**
     * Defines if callback adding was a success - one callback can be added only once and so this property will
     * be true on first attempt and false on all following calls with same callback.
     */
    success: boolean;
    /**
     * Limit callback execution times to 1
     */
    once?: () => { onComplete: (callback: OnCompleteCallback) => void };
    /**
     * Limit callback execution times to 2
     */
    twice?: () => { onComplete: (callback: OnCompleteCallback) => void };
    /**
     * Limit callback execution times to value defined in param
     * @param count
     */
    times?: (count: number) => { onComplete: (callback: OnCompleteCallback) => void };
    /**
     * Guard callback execution by interpreting executed callback data.
     * @param func
     */
    guard?: (func: GuardFunction<T>) => Pick<CallbackManager<T>, "once" | "twice" | "times">;
};

type AddCallback<T> = (callback: CallbackFunction<T>) => CallbackManager<T>;
type ManageCallbacks<T> = () => Pick<CallbackCollection<T>, "has" | "remove" | "clear">;
export type Callback<T> = AddCallback<T> | ManageCallbacks<T>;
