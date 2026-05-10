import { Button } from './Button';

export function Pagination({ page = 1, totalPages = 1, onPageChange }: { page?: number; totalPages?: number; onPageChange?: (page: number) => void }) {
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle px-5 py-4 text-xs text-gray-500 sm:flex-row">
      <span className="font-mono">PAGE {page} / {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={!canGoPrevious} onClick={() => onPageChange?.(page - 1)}>Previous</Button>
        <Button variant="secondary" disabled={!canGoNext} onClick={() => onPageChange?.(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
