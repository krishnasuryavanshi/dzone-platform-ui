import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useQueryState() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState<Record<string, string>>(
    Object.fromEntries(searchParams.entries()),
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(Object.fromEntries(params.entries()));
  }, [location.search]);

  const createQueryString = useCallback(
    (
      queries: { name: string; value: string | number }[],
      replace: boolean = false,
    ) => {
      const params = new URLSearchParams(
        replace ? '' : location.search,
      );
      queries.forEach((q) => {
        params.set(q.name, String(q.value));
      });
      return params.toString();
    },
    [location.search],
  );

  const addNewQueryParams = (
    queries: { name: string; value: string | number }[],
    replace: boolean = false,
  ) => {
    navigate(location.pathname + '?' + createQueryString(queries, replace));
  };

  return { queryState: query, setQueryState: addNewQueryParams };
}
