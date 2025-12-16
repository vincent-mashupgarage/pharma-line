/**
 * Search Bar Component
 * Product search input with debouncing and clear functionality
 * Client component - manages search input state
 */

'use client';

import { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/lib/hooks/use-search';
import { useFilters } from '@/lib/hooks/use-filters';

export function SearchBar() {
  const { filters, setFilters } = useFilters();
  const { query, setQuery, debouncedQuery, clearQuery, inputRef } = useSearch(filters.search);

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== filters.search) {
      setFilters({ search: debouncedQuery });
    }
  }, [debouncedQuery, filters.search, setFilters]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search products, medicines, vitamins..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 w-full pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearQuery}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
