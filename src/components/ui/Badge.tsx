import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type BadgeTone = 'red' | 'green' | 'amber' | 'blue' | 'gray';

export function Badge({ children, tone = 'gray', className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        tone === 'red' && 'border border-brand/25 bg-brand/10 text-[#E9514B]',
        tone === 'green' && 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
        tone === 'amber' && 'border border-amber-500/25 bg-amber-500/10 text-amber-400',
        tone === 'blue' && 'border border-blue-500/25 bg-blue-500/10 text-blue-400',
        tone === 'gray' && 'border border-gray-500/25 bg-gray-500/10 text-gray-400',
        className,
      )}
    >
      {children}
    </span>
  );
}
