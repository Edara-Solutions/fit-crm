import type { InventoryItem } from '../../types/inventory';
import { formatDate } from '../../utils/formatDate';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<InventoryItem>[] = [
  { key: 'productName', header: 'Product', render: (item) => <div><p className="font-bold text-white">{item.productName}</p><p className="font-mono text-[10px] text-gray-500">{item.sku}</p></div> },
  { key: 'stock', header: 'Stock', render: (item) => <span className="font-mono">{item.stock}</span> },
  { key: 'lowStockThreshold', header: 'Threshold' },
  { key: 'expiryDate', header: 'Expiry', render: (item) => formatDate(item.expiryDate) },
  { key: 'lastUpdated', header: 'Updated', render: (item) => formatDate(item.lastUpdated) },
  { key: 'state', header: 'State', render: (item) => <StatusBadge status={item.stock === 0 ? 'out_of_stock' : item.stock <= item.lowStockThreshold ? 'low_stock' : 'active'} /> },
];

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return <Table columns={columns} data={items} getRowKey={(item) => item.id} actions={() => <Dropdown />} />;
}
