export class WeakIdentityMap<K, V extends object> {
  #map: Map<K, WeakRef<V>>;
  #registry: FinalizationRegistry<K>;

  constructor() {
    this.#map = new Map();
    this.#registry = new FinalizationRegistry((key) => {
      this.#map.delete(key);
    });
  }

  has(key: K): boolean {
    return typeof this.#map.get(key)?.deref() !== 'undefined';
  }

  get(key: K): V | undefined {
    return this.#map.get(key)?.deref();
  }

  set(key: K, value: V): this {
    const oldValue = this.#map.get(key)?.deref();

    if (typeof oldValue !== 'undefined') {
      this.#registry.unregister(oldValue);
    }

    this.#map.set(key, new WeakRef<V>(value));

    this.#registry.register(value, key);

    return this;
  }

  delete(key: K): boolean {
    const value = this.#map.get(key)?.deref();

    if (typeof value !== 'undefined') {
      this.#registry.unregister(value);
    }

    return this.#map.delete(key);
  }

  keys(): IterableIterator<K> {
    return this.#map.keys();
  }

  clear() {
    for (const ref of this.#map.values()) {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        this.#registry.unregister(value);
      }
    }

    this.#map.clear();
  }

  forEach(
    cb: (value: V, key: K, map: WeakIdentityMap<K, V>) => void,
    thisArg?: any,
  ) {
    this.#map.forEach((ref, key) => {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        cb.call(thisArg, value, key, this);
      }
    });
  }

  entries(): IterableIterator<[K, V]> {
    const entries = this.#map.entries();

    const next = (): IteratorResult<[K, V], any> => {
      for (const entry of entries) {
        const value = entry[1].deref();

        if (typeof value !== 'undefined') {
          return {
            done: false,
            value: [entry[0], value],
          };
        }
      }

      return {
        done: true,
        value: undefined,
      };
    };

    return {
      [Symbol.iterator]() {
        return this;
      },
      next,
    };
  }

  values(): IterableIterator<V> {
    const refs = this.#map.values();

    const next = (): IteratorResult<V> => {
      for (const ref of refs) {
        const value = ref.deref();

        if (typeof value !== 'undefined') {
          return {
            done: false,
            value: value,
          };
        }
      }

      return {
        done: true,
        value: undefined,
      };
    };

    return {
      [Symbol.iterator]() {
        return this;
      },
      next,
    };
  }
}
