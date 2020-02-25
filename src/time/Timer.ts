/**
 * Timer utility class
 */
export class Timer {

    /**
     * Get current epoch time
     * @returns {number}
     */
    static get now(): number {
        return Date.now();
    }

    private start = Timer.now;

    /**
     * Reset timer and get elapsed time
     * @returns {number}
     */
    reset(): number {
        const elapsed = this.elapsed;
        this.start = Timer.now;
        return elapsed
    }

    /**
     * Get elapsed time
     * @returns {number}
     */
    get elapsed(): number {
        return Timer.now - this.start;
    }
}
