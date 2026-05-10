import type { StaffUser } from '../../types/user';
import { formatDate } from '../../utils/formatDate';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<StaffUser>[] = [
  { key: 'name', header: 'User', render: (user) => <div className="flex items-center gap-3"><Avatar name={user.name} /><div><p className="font-bold text-white">{user.name}</p><p className="text-[10px] text-gray-500">{user.email}</p></div></div> },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status} /> },
  { key: 'lastLogin', header: 'Last Login', render: (user) => formatDate(user.lastLogin) },
  { key: 'createdAt', header: 'Created', render: (user) => formatDate(user.createdAt) },
];

export function UserTable({ users, onDeactivate, onActivate, onDelete, canDelete }: { users: StaffUser[]; onDeactivate?: (id: string) => void; onActivate?: (id: string) => void; onDelete?: (id: string) => void; canDelete?: boolean }) {
  return <Table columns={columns} data={users} getRowKey={(user) => user.id} actions={(user) => <Dropdown><div className="flex flex-col gap-1">{user.status === 'active' ? <Button variant="ghost" onClick={() => onDeactivate?.(user.id)}>Deactivate</Button> : <Button variant="ghost" onClick={() => onActivate?.(user.id)}>Activate</Button>}{canDelete && <Button variant="danger" onClick={() => onDelete?.(user.id)}>Delete</Button>}</div></Dropdown>} />;
}
