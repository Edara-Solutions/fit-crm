import { RolePermissionMatrix } from '../../components/crm/RolePermissionMatrix';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { roles } from '../../constants/roles';

export function RolesPermissionsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Roles & Permissions" action={<Button>Save Matrix</Button>} />
      <div className="flex flex-wrap gap-2">{roles.map((role) => <span key={role} className="rounded border border-border-subtle bg-panel px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{role}</span>)}</div>
      <RolePermissionMatrix />
    </PageContainer>
  );
}
