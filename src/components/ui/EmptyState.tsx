import { Inbox } from 'lucide-react';

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded border border-dashed border-border-subtle bg-bg-deep/40 p-8 text-center">
      <Inbox className="mb-3 h-8 w-8 text-gray-600" />
      <h3 className="text-sm font-bold uppercase text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-gray-500">{description}</p>}
    </div>
  );
}
