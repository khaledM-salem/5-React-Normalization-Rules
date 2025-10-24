/**
 * Normalizes an array of entities into a key-value map (4RNF: Normalized Collections)
 * @param arr - Array of entities to normalize
 * @param key - Property to use as the key (defaults to 'id')
 * @returns Object with entities indexed by the specified key
 * 
 * @example
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const normalized = normalize(users);
 * // Result: { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } }
 */
export function normalize<T extends Record<string, any>>(
  arr: T[],
  key: keyof T = 'id' as keyof T
): Record<string | number, T> {
  return arr.reduce(
    (acc, item) => {
      const keyValue = item[key];
      if (keyValue === undefined || keyValue === null) {
        console.warn(`normalize: item missing key "${String(key)}"`, item);
        return acc;
      }
      return { ...acc, [keyValue]: item };
    },
    {} as Record<string | number, T>
  );
}

/**
 * Denormalizes a key-value map back into an array
 * @param obj - Normalized object to denormalize
 * @returns Array of entities
 * 
 * @example
 * const normalized = { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } };
 * const denormalized = denormalize(normalized);
 * // Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 */
export function denormalize<T>(obj: Record<string | number, T>): T[] {
  return Object.values(obj);
}

/**
 * Extracts entity references from nested data (4RNF helper)
 * @param items - Array of items with nested entities
 * @param entityKey - Key where the nested entity lives
 * @param idKey - Key to use for the reference (defaults to 'id')
 * @returns Object with normalized items and extracted entities
 * 
 * @example
 * const posts = [
 *   { id: 1, title: 'Post 1', author: { id: 10, name: 'John' } },
 *   { id: 2, title: 'Post 2', author: { id: 10, name: 'John' } }
 * ];
 * const { items, entities } = extractEntities(posts, 'author');
 * // items: { 1: { id: 1, title: 'Post 1', authorId: 10 }, ... }
 * // entities: { 10: { id: 10, name: 'John' } }
 */
export function extractEntities<T extends Record<string, any>, E extends Record<string, any>>(
  items: T[],
  entityKey: keyof T,
  idKey: string = 'id'
): { items: Record<string | number, any>; entities: Record<string | number, E> } {
  const entities: Record<string | number, E> = {};
  const normalizedItems: Record<string | number, any> = {};

  items.forEach((item) => {
    const entity = item[entityKey] as E;
    const itemCopy: Record<string, any> = { ...item };
    
    if (entity && typeof entity === 'object' && idKey in entity) {
      const entityId = entity[idKey];
      entities[entityId] = entity;
      delete itemCopy[entityKey as string];
      itemCopy[`${String(entityKey)}Id`] = entityId;
    }
    
    normalizedItems[item[idKey]] = itemCopy;
  });

  return { items: normalizedItems, entities };
}