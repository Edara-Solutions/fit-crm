import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function Drawer({ open, children, className }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={cn('fixed inset-y-0 left-0 z-[70] w-72 transform bg-panel transition-transform lg:hidden', open ? 'translate-x-0' : '-translate-x-full', className)}>
      {children}
    </div>
  );
}
