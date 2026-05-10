import { Button } from './Button';

export function Pagination({ page = 1, totalPages = 4 }: { page?: number; totalPages?: number }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle px-5 py-4 text-xs text-gray-500 sm:flex-row">
      <span className="font-mono">PAGE {page} / {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="secondary">Previous</Button>
        <Button variant="secondary">Next</Button>
      </div>
    </div>
  );
}
