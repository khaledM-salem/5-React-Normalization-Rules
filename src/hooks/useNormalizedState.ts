import { useState, useMemo, useCallback } from 'react';

/**
 * Hook for managing normalized state (4RNF: Normalized Collections)
 * Provides utilities for working with entities stored as key-value maps
 * 
 * @example
 * const { state, setState, addEntity, removeEntity, updateEntity, getEntity } = 
 *   useNormalizedState<User>({});
 * 
 * addEntity({ id: 1, name: 'John' });
 * updateEntity(1, { name: 'John Doe' });
 * const user = getEntity(1);
 */
export function useNormalizedState<T extends { id: string | number }>(
  initialState: Record<string | number, T> = {}
) {
  const [state, setState] = useState<Record<string | number, T>>(initialState);

  const addEntity = useCallback((entity: T) => {
    setState((prev) => ({
      ...prev,
      [entity.id]: entity,
    }));
  }, []);

  const addEntities = useCallback((entities: T[]) => {
    setState((prev) => {
      const newState = { ...prev };
      entities.forEach((entity) => {
        newState[entity.id] = entity;
      });
      return newState;
    });
  }, []);

  const removeEntity = useCallback((id: string | number) => {
    setState((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);

  const updateEntity = useCallback((id: string | number, updates: Partial<T>) => {
    setState((prev) => {
      const entity = prev[id];
      if (!entity) return prev;
      
      return {
        ...prev,
        [id]: { ...entity, ...updates },
      };
    });
  }, []);

  const getEntity = useCallback(
    (id: string | number): T | undefined => {
      return state[id];
    },
    [state]
  );

  const getAllEntities = useMemo(() => Object.values(state), [state]);

  const entityIds = useMemo(() => Object.keys(state), [state]);

  const hasEntity = useCallback(
    (id: string | number): boolean => {
      return id in state;
    },
    [state]
  );

  const clear = useCallback(() => {
    setState({});
  }, []);

  return {
    state,
    setState,
    addEntity,
    addEntities,
    removeEntity,
    updateEntity,
    getEntity,
    getAllEntities,
    entityIds,
    hasEntity,
    clear,
    count: entityIds.length,
  };
}