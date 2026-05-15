import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export type TableColumn<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
};

export function Table<T extends Record<string, unknown>>({ columns, data, getRowKey, actions, emptyTitle = 'No records found' }: TableProps<T>) {
  if (!data.length) {
    return <EmptyState title={emptyTitle} description="Try changing search or filter criteria." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-xs">
        <thead className="border-b border-border-subtle bg-bg-deep/50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                {column.header}
              </th>
            ))}
            {actions && <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {data.map((row) => (
            <tr key={getRowKey(row)} className="group transition-colors hover:bg-white/5">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 font-medium text-gray-300">
                  {column.render ? column.render(row) : String(row[column.key] ?? '')}
                </td>
              ))}
              {actions && <td className="px-5 py-4 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
