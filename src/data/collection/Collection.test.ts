import {expect} from "chai";
import {Collection} from "./Collection";

describe("Data Collection", () => {
    it("Can be initialized with values", () => {
        const data = [1, 2, 3, 4, 5];
        const collection = new Collection<number>(() => true, data);
        expect(collection.items.toString()).to.equal(data.toString());
    });
    it("Valid items won't and invalid items will throw an error", () => {
        const collection = new Collection<number>(item => item < 10);
        expect(() => collection.add(1)).to.not.throw(Error);
        expect(() => collection.add(2)).to.not.throw(Error);
        expect(() => collection.add(10)).to.throw(Error);
    });
    it("Collection state is properly updated", () => {
        const collection = new Collection<number>();
        collection.add(1);
        collection.add(2);
        collection.add(3);
        expect(collection.length).to.equal(3);
        collection.remove(2);
        expect(collection.length).to.equal(2);
        // Removal of item that is not preset should throw an error
        expect(() => collection.remove(2)).to.throw(Error);
    });
    it("Subscriptions to collection change work", () => {
        const collection = new Collection<number>();

        let onAddSuccess: boolean = false;
        let onRemoveSuccess: boolean = false;
        let onCommitSuccess: boolean = false;
        let onClearSuccess: boolean = false;

        const subscription = collection.subscribe()
            .onAdd(item => {
                if (onAddSuccess) {
                    throw new Error("This should not happen");
                }
                onAddSuccess = item === 1;
                // Remove callback
                subscription.onAdd(null);
            })
            .onRemove(item => {
                if (onRemoveSuccess) {
                    throw new Error("This should not happen");
                }
                onRemoveSuccess = item === 1;
                // Remove callback
                subscription.onRemove(null);
            })
            .onCommit(() => onCommitSuccess = true)
            .onClear(() => onClearSuccess = true);

        collection.add(1);
        collection.add(2);
        collection.add(3);
        collection.remove(1);
        // Removing item at non existent index must produce error
        expect(() => collection.removeItemAt(5)).to.throw(Error);
        // Removing at valid index should not
        expect(() => collection.removeItemAt(0)).not.to.throw(Error);

        collection.commit();
        collection.clear();

        expect(onAddSuccess).to.equal(true);
        expect(onRemoveSuccess).to.equal(true);
        expect(onCommitSuccess).to.equal(true);
        expect(onClearSuccess).to.equal(true);
    });
    it("Filtering work", () => {

        const collection = new Collection<number>();

        let onAddSuccess: boolean = false;
        let onRemoveSuccess: boolean = false;

        // Filter out only values between 10 and 20 and expect that only add/remove
        // notifications we'll receive will be for data within that range
        collection.subscribe()
            .filter(item => item >= 10 && item <= 20)
            .onAdd(() => {
                if (onAddSuccess) {
                    throw new Error("This should not happen");
                }
                onAddSuccess = true;
            })
            .onRemove(() => {
                if (onRemoveSuccess) {
                    throw new Error("This should not happen");
                }
                onRemoveSuccess = true;
            });
        // We expect that even though add/remove is called twice callbacks will be fired only once
        collection.add(1);
        collection.add(11);
        collection.remove(1);
        collection.remove(11);

        expect(onAddSuccess).to.equal(true);
        expect(onRemoveSuccess).to.equal(true);
    });

    it("Mass update work", () => {

        const collection = new Collection<number>();
        while (collection.length < 10) {
            collection.add(collection.length);
        }

        expect(collection.length).to.equal(10);

        // We're updating items to new state where 5 of existing items are gone and 3 new items are added
        // and we want to hear callbacks

        let onAddCallCount = 0;
        let onRemoveCallCount = 0;
        collection.subscribe()
            .onAdd(() => onAddCallCount++)
            .onRemove(() => onRemoveCallCount++);

        collection.items = [...collection.items.slice(0, 5), 11, 12, 13];

        expect(onAddCallCount).to.equal(3);
        expect(onRemoveCallCount).to.equal(5);
    });
});
