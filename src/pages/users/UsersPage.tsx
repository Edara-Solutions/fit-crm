import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';
import { UserTable } from '../../components/crm/UserTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { roleLabels } from '../../constants/roles';
import { useAuthStore } from '../../stores/authStore';
import { useUsersStore } from '../../stores/usersStore';
import type { InternalRole } from '../../types/auth';

export function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const { users, pagination, loading, error, fetchUsers, createUser } = useUsersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer_support' as InternalRole });
  const roles = useMemo<InternalRole[]>(() => (currentUser?.role === 'super_admin' ? ['super_admin', 'admin', 'inventory_manager', 'order_manager', 'customer_support'] : ['inventory_manager', 'order_manager', 'customer_support']), [currentUser?.role]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createUser(form);
    setIsOpen(false);
    setForm({ name: '', email: '', password: '', role: 'customer_support' });
  }

  return (
    <PageContainer>
      <SectionHeader title="Users & Staff" action={<div className="flex gap-2"><Link to="/users/roles-permissions"><Button variant="secondary" icon={<Shield className="h-4 w-4" />}>Permissions</Button></Link><Button onClick={() => setIsOpen(true)} icon={<UserPlus className="h-4 w-4" />}>Add User</Button></div>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchUsers()}>Retry</Button></div>}
      <Card>
        {loading ? <div className="p-5"><LoadingSkeleton /></div> : <UserTable users={users.map(toStaffUser)} />}
        <Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchUsers({ page, limit: pagination.limit })} />
      </Card>
      <Modal open={isOpen} title="Create User" onClose={() => setIsOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input required placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input required placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as InternalRole })}>
            {roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
          </Select>
          <Button className="md:col-span-2" disabled={loading} type="submit">Create User</Button>
        </form>
      </Modal>
    </PageContainer>
  );
}

function toStaffUser(user: { _id?: string; id?: string; name: string; email: string; role: InternalRole; isActive?: boolean; lastLogin?: string; createdAt?: string }) {
  return {
    id: user._id || user.id || user.email,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.isActive === false ? 'inactive' as const : 'active' as const,
    lastLogin: user.lastLogin || user.createdAt || new Date().toISOString(),
    createdAt: user.createdAt || new Date().toISOString(),
  };
}
