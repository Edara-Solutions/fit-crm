import { cn } from '../../utils/cn';

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange?: (tab: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange?.(tab)}
          className={cn('rounded border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors', tab === active ? 'border-brand bg-brand text-white' : 'border-border-subtle bg-panel text-gray-400 hover:bg-white/5')}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
