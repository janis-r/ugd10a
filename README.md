# UGD10A!

A small bunch of data, time and object utilities placed into public scope for easier reuse.

## Runtime data validation

Utility that ensures that incoming data is of required shape a type.

Simple usage example look like this:

```typescript
import {Validator} from "ugd10a/validator";
// Data shape to validate incoming data against
type OuterData = {
    id: number,
    name: string,
    description?: string
}
// Create validator
const validator = new Validator<OuterData>({
    id: {type: "number"},
    name: {type: "string"},
    description: {type: "string", optional: true},
});

// This will return true
validator.validate({id: 1, name: "name"});

// As well as this
validator.validate({id: 1, name: "name", description: "description"});

// But this will return false
validator.validate({id: "1", name: "name", description: "description"});
// Reason for failure can be checked by validator.lastError property, so:
console.log(validator.lastError);
// Will return:
```
```json
{
    "field": "id",
    "error": "Type mismatch. Expected: number, actual: string"
}
```

### Configuration options

- **optional**: Defines if it's fine for this field to be missing (default = false).

- **exactValue**: Check entry for exact value.

- **type**: String representing one of built in types: `undefined` | `object` | `boolean` | `number` | `bigint` |
 `string` | `symbol` | `function` or any of custom, array types : `array` | `string[]` | `number[]`.   
  *(Value can contain a single entry or an array of entries.)*

- **validator**: Entry validator function of form: `(value: any, field?: keyof T) => boolean`

- **itemValidator**: Array item validator that will be used only in conjunction with array data type.

- **notEmpty**: Defines that empty values, such as empty strings or arrays, or undefined should not be accepted as
 valid ones.


## In memory data caching

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
