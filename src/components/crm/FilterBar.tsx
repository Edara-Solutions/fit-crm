import type { ReactNode } from 'react';
import { SearchInput } from '../ui/SearchInput';

export function FilterBar({ placeholder = 'Search records...', children }: { placeholder?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded border border-border-subtle bg-panel p-4 md:flex-row">
      <SearchInput className="min-w-0 flex-1" placeholder={placeholder} />
      <div className="grid gap-3 sm:grid-cols-2 md:flex">{children}</div>
    </div>
  );
}
