import {Timer} from "../time/Timer";

/**
 * Cached data instance - holds last known value and manages data updates.
 * @template T Cached data type
 */
export class Cached<T> {

    /**
     * TTL steps after which data becomes so invalid that should not be returned
     * even with useCacheWhileUpdating set to true
     * @type {number}
     */
    private readonly invalidDataStep = 5;

    private data: T | null = null;
    private updatePromise: Promise<T> | null = null;
    private lastUpdateTime: number = 0;

    /**
     * Create new instance
     * @param {() => Promise<T>} updateFunction Update function to be invoked each time required data is missing or is
     * outdated
     * @param {number} ttl Data time to live in milliseconds
     * @param {boolean} useCacheWhileUpdating Define if cached value should be returned while data is updating or any
     * request should await for current update to finish
     */
    constructor(private readonly updateFunction: () => Promise<T>,
                public readonly ttl: number,
                public readonly useCacheWhileUpdating: boolean = true) {
        if (!updateFunction) {
            throw new Error(`Cached instance error - updateFunction is not provided`);
        }
        if (isNaN(ttl) || ttl <= 0) {
            throw new Error(`Cached instance error - ttl (${ttl}) is not usable`);
        }
    }

    /**
     * Det cached data or data promise
     * @returns {Promise<T>}
     */
    async getData(): Promise<T | null> {

        const timeSinceLastUpdate = this.lastUpdateTime ? Timer.now - this.lastUpdateTime : NaN;

        /**
         * Request data update in case if we ain't got data set or data is outdated and
         * there's no active update in progress
         */
        if (!this.updatePromise && (!this.data || isNaN(timeSinceLastUpdate) || timeSinceLastUpdate > this.ttl)) {
            // Nullify data in case if it's older than this and should not be returned even if
            // useCacheWhileUpdating is set to true
            if (timeSinceLastUpdate > this.ttl * this.invalidDataStep) {
                this.data = null;
            }
            this.update();
        }

        /**
         * If data is set and there's no running update (regular data return) or there is active
         * update but response tactic tells us to use cached data before update is here
         */
        if (this.data && (!this.updatePromise || this.useCacheWhileUpdating)) {
            return this.data;
        }

        /**
         * We can get here only in case if there's no data and data update is in progress and
         * response tactic does not favor cached data
         */
        return this.updatePromise;
    }

    /**
     * Force data update and retrieve newly acquired data.
     * @returns {Promise<T>}
     */
    async forceUpdate(): Promise<T | null> {
        if (!this.updatePromise) {
            this.update();
        }
        return this.updatePromise;
    }

    /**
     * Get time in milliseconds data will be valid for.
     * Any negative value in here indicate outdated or missing data.
     * @returns {number}
     */
    get validFor(): number {
        if (!this.lastUpdateTime) {
            return -1;
        }
        const validUntil = this.lastUpdateTime + this.ttl;
        return validUntil - Timer.now;
    }

    private update(): void {
        this.updatePromise = this.updateFunction();
        this.updatePromise.then(value => {
            this.data = value;
            this.updatePromise = null;
            this.lastUpdateTime = Timer.now;
        });
    }
}
