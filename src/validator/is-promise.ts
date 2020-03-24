/**
 * Promise type guard
 * @param entry
 */
export const isPromise = (entry: unknown): entry is Promise<any> => Promise.resolve(entry) === entry;
