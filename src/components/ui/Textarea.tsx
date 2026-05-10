import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('min-h-28 w-full rounded border border-border-subtle bg-bg-deep px-3 py-2 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-brand', className)}
      {...props}
    />
  );
}
