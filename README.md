# UGD10A!

A small bunch of data, time and object utilities placed into public scope for easier reuse.

##In memory data caching
```typescript
import {Cached, toMilliseconds} from "ugd10a";

const randomNumberCache = new Cached(
    // Async function that knows where to get new data
    async () => Math.floor(Math.random() * 0xFFFFFF),
    // Time in milliseconds which defines data update interval
    toMilliseconds(10, "seconds")
);
// This will output new random number every 10 seconds.
setInterval(
    async () => console.log(await randomNumberCache.getData()),
    toMilliseconds(1, "seconds")
);
```
Typical use case for this functionality would be to limit requests to scarce resource, like DB and keep last 
known value in memory between updates within single entry point.

```
TODO: More docs object utils, execution queue and time utils?
```
