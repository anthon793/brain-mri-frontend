// ─────────────────────────────────────────────────────────
// useApi — generic async hook with loading, error, & data
// ─────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react';
import { AxiosError } from 'axios';
import type { ApiResponse } from '../api/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Generic hook that wraps any async service call with
 * loading / error / data state management.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(scanService.list);
 *
 *   useEffect(() => { execute({ page: 1 }); }, []);
 */
export function useApi<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFn: (...args: any[]) => Promise<T>,
  immediate = false,
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFn(...args);
        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
        }
        return result;
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An unexpected error occurred';
        if (mountedRef.current) {
          setState({ data: null, loading: false, error: message });
        }
        return null;
      }
    },
    [apiFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData: React.Dispatch<React.SetStateAction<T | null>> = useCallback(
    (action) => {
      setState((prev) => ({
        ...prev,
        data: typeof action === 'function'
          ? (action as (prev: T | null) => T | null)(prev.data)
          : action,
      }));
    },
    [],
  );

  return { ...state, execute, reset, setData };
}

export default useApi;
