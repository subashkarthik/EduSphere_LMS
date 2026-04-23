
import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for fetching API data with loading/error states.
 * Falls back to provided fallback data when the backend is unreachable.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  fallback?: T,
  deps: any[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      console.warn('[API]', err.message);
      setError(err.message || 'Failed to fetch data');
      // Use fallback data if available
      if (fallback !== undefined) {
        setData(fallback);
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
