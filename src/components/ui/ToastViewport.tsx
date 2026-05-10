import { X } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { cn } from '../../utils/cn';

export function ToastViewport() {
  const { toasts, dismissToast } = useUiStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] w-[min(360px,calc(100vw-2rem))] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start justify-between gap-3 rounded border bg-panel px-4 py-3 text-xs shadow-2xl',
            toast.type === 'success' && 'border-emerald-500/40 text-emerald-100',
            toast.type === 'error' && 'border-brand/60 text-red-100',
            toast.type === 'info' && 'border-border-subtle text-gray-200',
          )}
        >
          <span>{toast.message}</span>
          <button className="text-gray-500 hover:text-white" onClick={() => dismissToast(toast.id)} type="button" aria-label="Dismiss toast">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
