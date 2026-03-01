import { useSearchParams } from 'react-router';

export function useUpdateQueryState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryState = Object.fromEntries(searchParams.entries());

  const updateQueryParams = (step: number, replace: boolean = false) => {
    setSearchParams(
      (prev) => {
        prev.set('step', step.toString());
        return prev;
      },
      { replace },
    );
  };

  return { queryState, updateQueryParams };
}
