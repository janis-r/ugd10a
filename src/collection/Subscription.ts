/**
 * Subscription to manage changes in data Collection
 */
export interface Subscription<T> {

    /**
     * Apply filter to data collection items to mark those which are of interest for current subscription.
     * Once this callback is applied onAdd() and onRemove() callbacks will be invoked only on data changes that pass
     * through filter set in here.
     * @param {(item: T) => boolean} callback
     * @returns {this}
     */
    filter(callback: (item: T) => boolean): this;

    /**
     * Set subscription destroy condition by providing callback that check current state of a collection and
     * whenever it will return true - subscription will be destroyed.
     * If no callback of this kind is provided direct call to destroy() method should be used to remove subscription
     * @param {(items: T[]) => boolean} callback
     * @returns {this}
     */
    destroyWhen(callback: ((items: T[]) => boolean) | null): this;

    /**
     * Set item add callback.
     * @param {ItemChangeCallback<T>} callback
     * @returns {this}
     */
    onAdd(callback: ItemChangeCallback<T> | null): this;

    /**
     * Set remove item from collection callback.
     * @param {ItemChangeCallback<T>} callback
     * @returns {this}
     */
    onRemove(callback: ItemChangeCallback<T> | null): this;

    /**
     * Set collection clear callback.
     * @param {CollectionChangeCallback<T>} callback
     * @returns {this}
     */
    onClear(callback: CollectionChangeCallback<T> | null): this;

    /**
     * Set callback for commit action
     * @param {CollectionChangeCallback<T>} callback
     * @returns {this}
     */
    onCommit(callback: CollectionChangeCallback<T> | null): this;

    /**
     * Destroy data subscription
     */
    destroy(): void;
}

/**
 * Single data item change callback shape
 */
export type ItemChangeCallback<T> = {
    /**
     * Data subscription callback
     * @param {T} item Item that is a target of action
     * @param {T[]} items List of all items in collection after operation has been completed
     * @param {Subscription<T>} subscription Data subscription instance provided in here only for sake of being able
     * to invoke destroy from any of data callbacks
     * @returns {boolean}
     */
    (item: T, items?: T[], subscription?: Subscription<T>): void;
}

/**
 * Collection level data change callback shape
 */
export type CollectionChangeCallback<T> = {
    /**
     * Data subscription callback
     * @param {T[]} items List of all items in collection after operation has been completed
     * @param {Subscription<T>} subscription Data subscription instance provided in here only for sake of being able
     * to invoke destroy from any of data callbacks
     * @returns {boolean}
     */
    (items?: T[], subscription?: Subscription<T>): void;
}