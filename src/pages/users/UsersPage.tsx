import { Link } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';
import { UserTable } from '../../components/crm/UserTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { mockUsers } from '../../data/mockUsers';

export function UsersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Users & Staff" action={<div className="flex gap-2"><Link to="/users/roles-permissions"><Button variant="secondary" icon={<Shield className="h-4 w-4" />}>Permissions</Button></Link><Button icon={<UserPlus className="h-4 w-4" />}>Add User</Button></div>} />
      <Card><UserTable users={mockUsers} /></Card>
    </PageContainer>
  );
}
