import { useReducer } from 'react';

export function useRefresh() {
  const [, updateState] = useReducer((x: number) => x + 1, 0);
  return updateState;
}
