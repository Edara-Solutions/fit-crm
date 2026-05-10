import type { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';

export function SectionHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <Breadcrumbs label={eyebrow ?? title} />
        <h1 className="mt-1 text-3xl font-black uppercase italic tracking-tighter text-white underline decoration-brand/30 decoration-8 underline-offset-8">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
