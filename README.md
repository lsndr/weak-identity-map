# WeakIdentityMap

[![codecov](https://codecov.io/gh/lsndr/weak-identity-map/graph/badge.svg?token=89357FF2PJ)](https://codecov.io/gh/lsndr/weak-identity-map)
[![npm version](https://badge.fury.io/js/weak-identity-map.svg)](https://badge.fury.io/js/weak-identity-map)
[![npm downloads/month](https://img.shields.io/npm/dm/weak-identity-map.svg)](https://www.npmjs.com/package/weak-identity-map)
[![npm downloads](https://img.shields.io/npm/dt/weak-identity-map.svg)](https://www.npmjs.com/package/weak-identity-map)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lsndr/weak-identity-map/blob/master/LICENSE.md)

The `WeakIdentityMap` object holds key-value pairs of weakly referenced objects and remembers the original insertion order of the keys.

A weak reference to an object is a reference that does not prevent the object from being reclaimed by the garbage collector. In contrast, a normal (or strong) reference keeps an object in memory.

> Identity Map ensures that each object gets loaded only once by keeping every loaded object in a map. Looks up objects using the map when referring to them.
>
> – [Martin Fowler](https://martinfowler.com/eaaCatalog/identityMap.html)

`WeakIdentityMap` is based on [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) and [FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) objects.

- No dependencies
- TypeScript
- ES2021
- Node.js >=14.6.0

## Installation

```
npm i weak-identity-map
```

## Example

```javascript
const map = new WeakIdentityMap();

let entity = {};

map.set('key', entity);

// returns a reference to the entity
map.get('key');

entity = null;

// ...
// GC reclaims space
// ...

// returns undefined
map.get('key');
```

## API

`WeakIdentityMap` is compliant with [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

#### size: number

Returns the number of values in the `WeakIdentityMap` object.

#### set(any, object): this

The `set()` method adds or updates an element with a specified key and an object to a `WeakIdentityMap` object.

#### get(any): object | undefined

The `get()` method returns a reference to a specified object from a `WeakIdentityMap` object.

#### has(any): boolean

The `has()` method returns a boolean indicating whether an object with the specified key exists or not.

#### delete(any): boolean

The `delete()` method removes the specified object from a `WeakIdentityMap` object by key.

#### keys(): IterableIterator\<any\>

The `keys()` method returns a new Iterator object that contains the keys for each element in the `WeakIdentityMap` object in insertion order.

#### entries(): IterableIterator\<\[any, object\]\>

The `entries()` method returns a new `Iterator` object that contains the `[key, value]` pairs for each element in the `WeakIdentityMap` object in insertion order.

#### values(): IterableIterator\<object\>

The `values()` method returns a new `Iterator` object that contains the values for each element in the `WeakIdentityMap` object in insertion order.

#### forEach(cb): void

The `forEach()` method executes a provided function once per each key/value pair in the `WeakIdentityMap` object, in insertion order.

#### clear(): void

The `clear()` method removes all elements from a `WeakIdentityMap` object.

## License

WeakIdentityMap is [MIT licensed](LICENSE.md).
