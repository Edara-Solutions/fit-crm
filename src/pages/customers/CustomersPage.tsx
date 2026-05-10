import { CustomerTable } from '../../components/crm/CustomerTable';
import { FilterBar } from '../../components/crm/FilterBar';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { mockCustomers } from '../../data/mockCustomers';

export function CustomersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Customers" />
      <FilterBar placeholder="Search by name, phone, or email..."><Select><option>All Statuses</option><option>VIP</option><option>Active</option><option>Blocked</option></Select></FilterBar>
      <Card><CustomerTable customers={mockCustomers} /><Pagination /></Card>
    </PageContainer>
  );
}
