import {Subscription, ItemChangeCallback, CollectionChangeCallback} from "./Subscription";
import {Collection} from "./Collection";
import {CollectionAction} from "./CollectionAction";

/**
 * Data subscription manager
 * @template T Data type of a collection subscription manager is attached to
 */
export class SubscriptionManager<T> implements Subscription<T> {

    private filterFunction: ((item: T) => boolean) | null = null;
    private destroyFunction: ((items: T[]) => boolean) | null = null;

    private itemChangeCallbacks = new Map<CollectionAction.Add | CollectionAction.Remove, ItemChangeCallback<T>>();
    private collectionChangeCallbacks = new Map<CollectionAction.Clear | CollectionAction.Commit, CollectionChangeCallback<T>>();

    private isDestroyed: boolean = false;

    constructor(private readonly dataCollection: Collection<T>) {

    }

    //--------------------------------
    //  Public API to support Subscription interface
    //--------------------------------

    /**
     * Apply filter to data collection items to mark those which are of interest for current subscription.
     * Once this callback is applied onAdd() and onRemove() callbacks will be invoked only on data changes that pass
     * through filter set in here.
     * @param {(item: T) => boolean} callback
     * @returns {this}
     */
    filter(callback: (item: T) => boolean): this {
        this.filterFunction = callback;
        return this;
    }

    /**
     * Set subscription destroy condition by providing callback that check current state of a collection and
     * whenever it will return true - subscription will be destroyed.
     * If no callback of this kind is provided direct call to destroy() method should be used to remove subscription
     * @param {(items: T[]) => boolean} callback
     * @returns {this}
     */
    destroyWhen(callback: (items: T[]) => boolean): this {
        this.destroyFunction = callback;
        return this;
    }

    /**
     * Set item add callback.
     * @param {ItemChangeCallback<T>} callback
     * @returns {this}
     */
    onAdd(callback: ItemChangeCallback<T>): this {
        const {itemChangeCallbacks} = this;
        if (callback) {
            itemChangeCallbacks.set(CollectionAction.Add, callback);
        } else {
            itemChangeCallbacks.delete(CollectionAction.Add);
        }
        return this;
    }

    /**
     * Set remove item from collection callback.
     * @param {ItemChangeCallback<T>} callback
     * @returns {this}
     */
    onRemove(callback: ItemChangeCallback<T>): this {
        const {itemChangeCallbacks} = this;
        if (callback) {
            itemChangeCallbacks.set(CollectionAction.Remove, callback);
        } else {
            itemChangeCallbacks.delete(CollectionAction.Remove);
        }
        return this;
    }

    /**
     * Set collection clear callback.
     * @param {CollectionChangeCallback<T>} callback
     * @returns {this}
     */
    onClear(callback: CollectionChangeCallback<T>): this {
        const {collectionChangeCallbacks} = this;
        if (callback) {
            collectionChangeCallbacks.set(CollectionAction.Clear, callback);
        } else {
            collectionChangeCallbacks.delete(CollectionAction.Clear);
        }
        return this;
    }

    /**
     * Set callback for commit action.
     * @param {CollectionChangeCallback<T>} callback
     * @returns {this}
     */
    onCommit(callback: CollectionChangeCallback<T>): this {
        const {collectionChangeCallbacks} = this;
        if (callback) {
            collectionChangeCallbacks.set(CollectionAction.Commit, callback);
        } else {
            collectionChangeCallbacks.delete(CollectionAction.Commit);
        }
        return this;
    }

    /**
     * Destroy data subscription
     */
    destroy(): void {
        if (!this.isDestroyed) {
            this.isDestroyed = true;
            this.dataCollection.removeSubscription(this);
        }
    }

    /**
     * Notify subscribers on data Collection actions
     * @param {T | null} item
     * @param {CollectionAction} action
     */
    notify(item: T | null, action: CollectionAction): void {
        const {
            itemChangeCallbacks, collectionChangeCallbacks,
            filterFunction, destroyFunction,
            dataCollection: {items}
        } = this;

        switch (action) {
            case CollectionAction.Add :
            case CollectionAction.Remove :
                // Filter function is not set or current item is within filtered range
                if ((!filterFunction || filterFunction(item!)) && itemChangeCallbacks.has(action)) {
                    itemChangeCallbacks.get(action)!(item!, items, this);
                }
                break;
            case CollectionAction.Clear :
            case CollectionAction.Commit :
                if (collectionChangeCallbacks.has(action)) {
                    collectionChangeCallbacks.get(action)!(items, this);
                }
                break;
        }

        if (destroyFunction && destroyFunction(items)) {
            this.destroy();
        }
    }

}
