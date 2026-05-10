import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn('w-full rounded border border-border-subtle bg-bg-deep px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-brand', className)}
      {...props}
    >
      {children}
    </select>
  );
}
