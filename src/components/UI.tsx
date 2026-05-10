import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-panel p-5 rounded border border-border-subtle shadow-sm relative overflow-hidden group", className)}>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{title}</p>
        <div className="p-1.5 bg-bg-deep rounded border border-border-subtle text-gray-500 group-hover:text-brand transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-white tracking-tighter mb-2 relative z-10">{value}</h3>
      {change && (
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight relative z-10",
          trend === 'up' ? "text-emerald-500" : 
          trend === 'down' ? "text-brand" : 
          "text-gray-500"
        )}>
          {trend === 'up' ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
          ) : trend === 'down' ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"/></svg>
          ) : null}
          <span>{change} vs period</span>
        </div>
      )}
      <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-full -translate-y-8 translate-x-8 blur-2xl"></div>
    </div>
  );
}

interface TableProps {
  title: string;
  subtitle?: string;
  columns: { key: string; header: string; render?: (row: any) => React.ReactNode }[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
}

export function DataTable({ title, subtitle, columns, data, actions }: TableProps) {
  return (
    <div className="bg-panel rounded border border-border-subtle shadow-lg flex flex-col min-h-0">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h4 className="text-white font-bold text-sm tracking-tight uppercase">{title}</h4>
            {subtitle && <p className="text-gray-500 text-[10px] mt-0.5 italic">{subtitle}</p>}
          </div>
          {actions && (
            <button className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline transition-all">
              Execution Logs
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg-deep/50 border-b border-border-subtle sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 font-bold text-gray-500 uppercase tracking-[0.2em] text-[10px]">
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-6 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-panel">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-gray-300 font-medium">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
