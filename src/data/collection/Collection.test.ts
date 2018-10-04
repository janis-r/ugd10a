import {expect} from "chai";
import {Collection} from "./Collection";

describe("Data Collection", () => {
    it("Can be initialized with values", () => {
        const data = [1,2,3,4,5];
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
    it("Subscriptions to collection change can be made", () => {
        const collection = new Collection<number>();

        let onAddSuccess: boolean = false;
        let onRemoveSuccess: boolean = false;
        let onCommitSuccess: boolean = false;
        let onClearSuccess: boolean = false;

        const subscription = collection.subscribe()
            .onAdd(item => {
                if (onAddSuccess) {
                    throw new Error('This should not happen');
                }
                onAddSuccess = item === 1;
                // Remove callback
                subscription.onAdd(null);
            })
            .onRemove(item => {
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
        expect(() => collection.removeItemAt(5)).to.throw(Error);
        expect(() => collection.removeItemAt(0)).not.to.throw(Error);
        collection.commit();
        collection.clear();

        expect(onAddSuccess).to.equal(true);
        expect(onRemoveSuccess).to.equal(true);
        expect(onCommitSuccess).to.equal(true);
        expect(onClearSuccess).to.equal(true);
    });
});
