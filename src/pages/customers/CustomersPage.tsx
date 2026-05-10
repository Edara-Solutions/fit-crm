import { useEffect, useMemo, useState } from 'react';
import { CustomerTable } from '../../components/crm/CustomerTable';
import { FilterBar } from '../../components/crm/FilterBar';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { useCustomersStore } from '../../stores/customersStore';

export function CustomersPage() {
  const { customers, pagination, loading, error, fetchCustomers } = useCustomersStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  // TODO: Replace local filtering with backend search params when customer search is documented.
  const visibleCustomers = useMemo(() => customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone ?? ''}`.toLowerCase().includes(search.toLowerCase())), [customers, search]);

  return (
    <PageContainer>
      <SectionHeader title="Customers" />
      <FilterBar placeholder="Search by name, phone, or email..." value={search} onChange={(event) => setSearch(event.target.value)}><Select><option>All Statuses</option><option>VIP</option><option>Active</option><option>Blocked</option></Select></FilterBar>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchCustomers()}>Retry</Button></div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <CustomerTable customers={visibleCustomers} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCustomers({ page, limit: pagination.limit })} /></Card>
    </PageContainer>
  );
}
