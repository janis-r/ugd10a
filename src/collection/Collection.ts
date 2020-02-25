import {Subscription} from "./Subscription";
import {CollectionAction} from "./CollectionAction";
import {SubscriptionManager} from "./SubscriptionManager";

/**
 * Data collection class that provide a list of data objects with functionality to track collection state.
 */
export class Collection<T> {

    private readonly subscriptions: SubscriptionManager<T>[] = [];
    private readonly validationCallback: ((item: T, items?: T[]) => boolean) | null = null;

    private _items: T[];

    /**
     * Create new instance
     * @param {(item: T, items?: T[]) => boolean} validationCallback Callback function that will identify whether item is
     * valid member of a collection upon adding item
     * @param {T[]} items List of initial items
     */
    constructor(validationCallback?: (item: T, items?: T[]) => boolean, items?: T[]) {
        if (validationCallback) {
            this.validationCallback = validationCallback;
        }

        this._items = items && Array.isArray(items) ? items : [];
    }

    //------------------------------
    // Public properties
    //------------------------------

    /**
     * Get all items in collection.
     * (Any direct manipulations on item property will not affect source collection.)
     * @returns {T[]}
     */
    get items(): T[] { return this._items.concat(); }
    set items(value: T[]) {
        // Check if there are new items in new collection
        const newItems = value.filter(item => this._items.indexOf(item) === -1);
        if (newItems.length) {
            const invalidItems = newItems.filter(item => !this.validate(item));
            if  (invalidItems.length) {
                // Validation is a must even in here
                throw new Error(`Mass update of data Collection failed. ${invalidItems} are not valid members of a collection`);
            }
        }
        // Check if some items are gone
        const removed = this._items.filter(entry => value.indexOf(entry) === -1);

        // Save state
        this._items = value;

        // Run notifications
        if (removed.length) {
            removed.forEach(item => this.notifySubscriptions(item, CollectionAction.Remove));
        }
        if (newItems.length) {
            newItems.forEach(item => this.notifySubscriptions(item, CollectionAction.Add));
        }
        if (removed.length || newItems.length) {
            this.commit();
        }
    }
    /**
     * Collection length
     * @returns {number}
     */
    get length(): number {
        return this._items.length;
    }

    //------------------------------
    // Public methods
    //------------------------------

    /**
     * Check if item can be located within data set.
     * @param {T} item
     * @returns {boolean}
     */
    has(item: T): boolean {
        return this._items.indexOf(item) !== -1;
    }

    /**
     * Add item to collection
     * @param {T} item
     * @returns {this}
     * @throws Error if item is already present in collection or validationCallback is provided and returns
     * false upon added item
     */
    add(item: T): this {
        if (this._items.indexOf(item) !== -1) {
            throw new Error(`Adding item to DataCollection error - this item is already present: ${item}`);
        }
        if (!this.validate(item)) {
            throw new Error(`Adding item to DataCollection error - item [${item}] is not valid member of a collection: [${this._items}]`);
        }
        this._items.push(item);
        this.notifySubscriptions(item, CollectionAction.Add);
        return this;
    }

    /**
     * Remove item from collection
     * @param {T} item
     * @returns {this}
     * @throws Error in case if item is not present in collection
     */
    remove(item: T): this {
        const index = this._items.indexOf(item);
        if (index === -1) {
            throw new Error(`Removing item from DataCollection error - this is not present in collection: ${item}`);
        }
        this._items.splice(index, 1);
        this.notifySubscriptions(item, CollectionAction.Remove);
        return this;
    }

    /**
     * Remove item by index
     * @param {number} index
     * @throws Error in case index is out of valid bounds
     * @returns {this}
     */
    removeItemAt(index: number): this {
        if (index < 0 || index > this._items.length - 1) {
            throw new Error(`Removing item from DataCollection error - index ${index} is out of valid range`);
        }

        const {0:item} = this._items.splice(index, 1);
        this.notifySubscriptions(item, CollectionAction.Remove);
        return this;
    }

    /**
     * Remove all items from collection
     * @returns {this}
     */
    clear(): this {
        if (this._items.length > 0) {
            while (this._items.length > 0) {
                this.remove(this._items[0])
            }
            this.notifySubscriptions(null, CollectionAction.Clear);
        }
        return this;
    }

    /**
     * Mark bulk update of collection data as complete
     * @returns {this}
     */
    commit(): this {
        this.notifySubscriptions(null, CollectionAction.Commit);
        return this;
    }

    /**
     * See if some item is valid member for this collection vai call to validationCallback.
     * If no validationCallback is provided this method will return true at all times.
     * @param {T} item
     * @returns {boolean}
     */
    validate(item: T): boolean {
        if (this.validationCallback) {
            return this.validationCallback(item, this._items);
        }
        return true;
    }

    /**
     * Create subscription to track collection state
     * @returns {Subscription<T>}
     */
    subscribe(): Subscription<T> {
        const subscription = new SubscriptionManager<T>(this);
        this.subscriptions.push(subscription);
        return subscription;
    }

    /**
     * Remove data subscription
     * @param {Subscription<T>} subscription
     * @returns {boolean}
     */
    removeSubscription(subscription: Subscription<T>): boolean {
        const index = this.subscriptions.indexOf(subscription as SubscriptionManager<T>);
        if (index === -1) {
            return false;
        }
        this.subscriptions.splice(index, 1);
        return true;
    }

    //------------------------------
    // Private methods
    //------------------------------

    private notifySubscriptions(item: T | null, action: CollectionAction): void {
        this.subscriptions.forEach(
            subscription => subscription.notify(item, action)
        );
    }

}