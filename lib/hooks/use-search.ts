/**
 * Use Search Hook
 * Provides debounced search functionality
 */

'use client';

import { useState, useEffect, useRef } from 'react';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search hook
export function useSearch(initialValue: string = '', delay: number = 300) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, delay);
  const inputRef = useRef<HTMLInputElement>(null);

  return {
    query,
    debouncedQuery,
    setQuery,
    inputRef,
    clearQuery: () => setQuery(''),
  };
}
