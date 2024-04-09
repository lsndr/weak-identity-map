/**
 * A map that holds weak references to its values.
 * The map is designed to store objects that are garbage collected when they are no longer used.
 *
 * @template K
 * @template V
 */
export class WeakIdentityMap<K, V extends object> {
  #size: number;
  #map: Map<K, WeakRef<V>>;
  #registry: FinalizationRegistry<{ key: K; ref: WeakRef<V> }>;

  constructor() {
    this.#size = 0;
    this.#map = new Map();
    this.#registry = new FinalizationRegistry((heldValue) => {
      const ref = this.#map.get(heldValue.key);

      if (ref === heldValue.ref) {
        this.#size--;
        this.#map.delete(heldValue.key);
      }
    });
  }

  /**
   * Returns a boolean indicating whether an object with the specified key exists or not.
   * The object is removed from the map once it's garbage collected or it's manually removed by `delete` or `clear` methods.
   *
   * @param {K} key
   * @returns {boolean}
   */
  has(key: K): boolean {
    return typeof this.#map.get(key)?.deref() !== 'undefined';
  }

  /**
   * Returns a specified object from the map, if it have not been garbage collected.
   * The object is removed from the map once it's garbage collected or it's manually removed by `delete` or `clear` methods.
   *
   * @param {K} key
   * @returns {V | undefined}
   */
  get(key: K): V | undefined {
    return this.#map.get(key)?.deref();
  }

  /**
   * Ads or updates an element with a specified key and an object.
   * Objects are stored as weak references, so they can be garbage collected.
   *
   * @param {K} key
   * @param {V} value
   * @returns {this}
   */
  set(key: K, value: V): this {
    const oldValue = this.#map.get(key)?.deref();

    if (typeof oldValue !== 'undefined') {
      this.#size--;
      this.#registry.unregister(oldValue);
    }

    const ref = new WeakRef<V>(value);

    this.#size++;
    this.#map.set(key, ref);
    this.#registry.register(value, { key, ref });

    return this;
  }

  /**
   * Removes the specified object from the map by key.
   *
   * @param {K} key
   * @returns {boolean}
   */
  delete(key: K): boolean {
    const value = this.#map.get(key)?.deref();

    if (typeof value !== 'undefined') {
      this.#size--;
      this.#registry.unregister(value);
    }

    return this.#map.delete(key);
  }

  /**
   * Returns an iterator of the keys in the map.
   *
   * @returns {IterableIterator<K>}
   */
  keys(): IterableIterator<K> {
    return this.#map.keys();
  }

  /**
   * Removes all objects from the map.
   *
   * @returns {void}
   */
  clear(): void {
    for (const ref of this.#map.values()) {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        this.#registry.unregister(value);
      }
    }

    this.#size = 0;
    this.#map.clear();
  }

  /**
   * Executes a provided function once per each key/value pair in the map, in insertion order.
   *
   * @param {(value: V, key: K, map: WeakIdentityMap<K, V>) => void} cb
   * @param {any=} [thisArg]
   * @returns {void}
   */
  forEach(
    cb: (value: V, key: K, map: WeakIdentityMap<K, V>) => void,
    thisArg?: any,
  ): void {
    this.#map.forEach((ref, key) => {
      const value = ref.deref();

      if (typeof value !== 'undefined') {
        cb.call(thisArg, value, key, this);
      }
    });
  }

  /**
   * Returns a new Iterator object that contains the [key, value] pairs for each element in the map in insertion order.
   *
   * @returns {IterableIterator<[K, V]>}
   */
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

  /**
   * Returns a new Iterator object that contains the values for each element in the map in insertion order.
   *
   * @returns {IterableIterator<V>}
   */
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

  /**
   * Returns size of the map
   *
   * @returns {number}
   */
  get size(): number {
    return this.#size;
  }
}
