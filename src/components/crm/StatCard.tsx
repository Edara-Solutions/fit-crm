import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
};

export function StatCard({ title, value, change, trend = 'neutral', icon: Icon }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden p-5">
      <div className="relative z-10 mb-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</p>
        <div className="rounded border border-border-subtle bg-bg-deep p-1.5 text-gray-500 transition-colors group-hover:text-brand">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <h3 className="relative z-10 mb-2 text-2xl font-black tracking-tighter text-white">{value}</h3>
      {change && (
        <p className={cn('relative z-10 text-[10px] font-bold uppercase', trend === 'up' && 'text-emerald-500', trend === 'down' && 'text-brand', trend === 'neutral' && 'text-gray-500')}>
          {change} vs period
        </p>
      )}
      <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-brand/5 blur-2xl" />
    </Card>
  );
}
