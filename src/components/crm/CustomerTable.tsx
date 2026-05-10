import { Link } from 'react-router-dom';
import type { Customer } from '../../types/customer';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<Customer>[] = [
  { key: 'name', header: 'Customer', render: (customer) => <div className="flex items-center gap-3"><Avatar name={customer.name} /><div><p className="font-bold text-white">{customer.name}</p><p className="text-[10px] text-gray-500">{customer.email}</p></div></div> },
  { key: 'phone', header: 'Phone' },
  { key: 'totalOrders', header: 'Orders' },
  { key: 'totalSpent', header: 'Spent', render: (customer) => formatCurrency(customer.totalSpent ?? 0) },
  { key: 'lastOrderDate', header: 'Last Order', render: (customer) => customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '-' },
  { key: 'status', header: 'Status', render: (customer) => <StatusBadge status={customer.isBlocked ? 'blocked' : customer.status || 'active'} /> },
];

export function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <Table columns={columns} data={customers} getRowKey={(customer) => customer._id || customer.id} actions={(customer) => <Dropdown><Link to={`/customers/${customer._id || customer.id}`}><Button variant="ghost">Open</Button></Link></Dropdown>} />
  );
}
