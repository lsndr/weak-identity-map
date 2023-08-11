import { WeakIdentityMap } from '../src';

declare function gc(): void;

describe('WeakIdentityMap', () => {
  let map: WeakIdentityMap<number, object>;

  beforeEach(() => {
    map = new WeakIdentityMap<number, object>();
  });

  it('should add an object to the map by reference', () => {
    const entity = {};

    map.set(1, entity);

    expect(map.has(1)).toBeTruthy();
    expect(map.size).toBe(1);
    expect(typeof map.get(1) === 'object' && map.get(1) !== null).toBeTruthy();
    expect(map.get(1)).toBe(entity);
  });

  it('should garbage collect an object', (done) => {
    let entity: any = {};

    map.set(1, entity);
    map.set(2, entity);

    expect(map.size).toBe(2);
    expect(map.has(1)).toBeTruthy();
    expect(map.has(2)).toBeTruthy();
    expect(Array.from(map.values()).length).toBe(2);

    entity = undefined;

    setImmediate(() => {
      gc();

      try {
        // TODO: figure out how to force calling FinalizationRegistry callback without mocking it
        // expect(map.size).toBe(0);

        expect(map.has(1)).toBeFalsy();
        expect(map.has(2)).toBeFalsy();

        expect(map.get(1)).toBeUndefined();
        expect(map.get(2)).toBeUndefined();

        expect(Array.from(map.values()).length).toBe(0);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should not garbage collect an object', (done) => {
    const entity = {};
    map.set(1, entity);

    expect(map.has(1)).toBeTruthy();

    setImmediate(() => {
      gc();

      try {
        expect(map.size).toBe(1);
        expect(map.has(1)).toBeTruthy();
        expect(map.get(1)).toBe(entity);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should delete an object from the map', () => {
    const entity = {};
    map.set(1, entity);

    expect(map.has(1)).toBeTruthy();
    expect(map.delete(1)).toBeTruthy();
    expect(map.size).toBe(0);
    expect(map.has(1)).toBeFalsy();
  });

  it('should clear the map', () => {
    const entity = {};

    map.set(1, entity);
    map.set(2, entity);

    expect(map.has(1)).toBeTruthy();
    expect(map.has(2)).toBeTruthy();

    map.clear();

    expect(map.size).toBe(0);
    expect(map.has(1)).toBeFalsy();
    expect(map.has(2)).toBeFalsy();
  });

  it('should return keys', () => {
    const entity = {};

    map.set(1, entity);
    map.set(2, entity);

    expect(map.size).toBe(2);
    expect(Array.from(map.keys()).sort()).toEqual([1, 2].sort());
  });

  it('should return values', () => {
    const entity1 = {};
    const entity2 = {};

    map.set(1, entity1);
    map.set(2, entity2);

    const values = Array.from(map.values()).sort();

    expect(map.size).toBe(2);
    expect(values.length).toBe(2);
    expect(values[0]).toBe(entity1);
    expect(values[1]).toBe(entity2);
  });

  it('should return entries', () => {
    const entity1 = {};
    const entity2 = {};

    map.set(1, entity1);
    map.set(2, entity2);

    const entries = Array.from(map.entries()).sort();

    expect(map.size).toBe(2);
    expect(entries.length).toBe(2);
    expect(entries).toEqual(
      [
        [1, entity1],
        [2, entity2],
      ].sort(),
    );
    expect(entries[0][1]).toBe(entity1);
    expect(entries[1][1]).toBe(entity2);
  });

  it('should go through each object', () => {
    const entities = [{}, {}];

    for (let i = 0; i < entities.length; i++) {
      map.set(i, entities[i]);
    }

    let total = 0;

    map.forEach((value, key) => {
      expect(value).toBe(entities[key]);
      total++;
    });

    expect(total).toBe(entities.length);
  });
});
