import {Timer} from "../time";
import {uniqueValues} from "../object";

/**
 * Cached data collection that'll provide a set of cached values of same type.
 */
export class CachedCollection<I, O> {

    private readonly dataCache = new Map<I, { data: O, lastAccess: number }>();
    private readonly dataFetchesInProgress = new Map<I, Promise<void>>();

    private cleanupInterval: ReturnType<typeof setInterval> | null = null;

    /**
     * Create new instance
     * @param fetchFunction Function that will provide values for requested inputs.
     * @param ttl Data time to live in milliseconds after last access.
     * @param inputTypeGuard Optional input data type guard.
     */
    constructor(private readonly fetchFunction: (ids: Set<I>) => Promise<Map<I, O>>,
                public readonly ttl: number,
                public readonly inputTypeGuard?: (entry: unknown) => entry is I) {
        if (!fetchFunction) {
            throw new Error(`CachedCollection error - fetchFunction is not provided`);
        }
        if (isNaN(ttl) || ttl <= 0) {
            throw new Error(`CachedCollection error - ttl (${ttl}) is not usable`);
        }
    }

    /**
     * Get collection data
     * @param itemIds
     */
    async getData(itemIds: Set<I>): Promise<Map<I, O>> {
        const {inputTypeGuard, dataCache, dataFetchesInProgress, fetchFunction} = this;

        const response = new Map<I, O>();
        if (!itemIds || !itemIds.size) {
            return response;
        }
        if (inputTypeGuard !== undefined && [...itemIds].some(entry => !inputTypeGuard!(entry))) {
            throw new Error(`CachedCollection error - some of item ids ${JSON.stringify([...itemIds])} are invalid according to type guard`);
        }

        const dataPromises = new Set<Promise<void>>();
        const entriesToFetch = new Set<I>();

        for (const itemId of itemIds) {
            if (dataCache.has(itemId)) {
                const data = dataCache.get(itemId);
                data!.lastAccess = Timer.now;
                response.set(itemId, data!.data);
            } else if (dataFetchesInProgress.has(itemId)) {
                dataPromises.add(dataFetchesInProgress.get(itemId)!);
            } else {
                entriesToFetch.add(itemId);
            }
        }

        if (entriesToFetch.size > 0) {
            const fetchCall = async () => {
                const dataPromise = new Promise<void>(async resolve => {
                    const newEntries = await fetchFunction(entriesToFetch);
                    const {now: lastAccess} = Timer;
                    for (const [input, data] of newEntries) {
                        dataCache.set(input, {data, lastAccess});
                    }
                    resolve();
                });
                entriesToFetch.forEach(input => dataFetchesInProgress.set(input, dataPromise));
                await dataPromise;
                entriesToFetch.forEach(input => dataFetchesInProgress.delete(input));
            };
            dataPromises.add(fetchCall());
        }

        if (dataPromises.size > 0) {
            await Promise.all([...dataPromises]);
            [...itemIds].filter(input => !response.has(input)).forEach(input => {
                if (!dataCache.has(input)) {
                    console.debug(`CachedCollection error while fetching data for ${input}`);
                } else {
                    response.set(input, dataCache.get(input)!.data);
                }
            });
        }

        this.checkCleanupStatus();

        return response;
    }

    /**
     * Delete items from collection
     * @param itemsIds
     * @return number of entries successfully deleted
     */
    delete(...itemsIds: I[]): number {
        return uniqueValues(itemsIds).map(id => this.dataCache.delete(id)).filter(state => state).length;
    }

    /**
     * Clear all overdue entries.
     * @return number of purged entries
     */
    purge(): number {
        const {dataCache, ttl} = this;
        const {now} = Timer;
        let deleteCount = 0;
        for (const [input, {lastAccess}] of dataCache) {
            if (lastAccess + ttl < now) {
                dataCache.delete(input);
                deleteCount++;
            }
        }
        if (deleteCount > 0) {
            this.checkCleanupStatus();
        }
        return deleteCount;
    }

    /**
     * Get size of cached collection entries
     */
    get size(): number {
        return this.dataCache.size;
    }

    /**
     * Get size of collection entries that currently are fetched
     */
    get entriesInProgress(): number {
        return this.dataFetchesInProgress.size;
    }

    private checkCleanupStatus(): void {
        const {dataCache, ttl} = this;
        if (dataCache.size > 0 && !this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => this.purge(), ttl);
        } else if (dataCache.size === 0 && !!this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

}
