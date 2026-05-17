import { useCallback, useEffect, useState } from 'react';
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
import type { ListQueryParams } from '../../types/api';

export function CustomersPage() {
  const { customers, pagination, loading, error, fetchCustomers } = useCustomersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const getQueryParams = useCallback((page = 1): ListQueryParams => ({
    page,
    limit: pagination.limit,
    search: search.trim() || undefined,
    isBlocked: statusFilter === 'active' ? false : statusFilter === 'blocked' ? true : undefined,
  }), [pagination.limit, search, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCustomers(getQueryParams(1));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCustomers, getQueryParams]);

  return (
    <PageContainer>
      <SectionHeader title="Customers" />
      <FilterBar placeholder="Search by name, phone, or email..." value={search} onChange={(event) => setSearch(event.target.value)}>
        <Select aria-label="Customer status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </Select>
      </FilterBar>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchCustomers(getQueryParams(pagination.page))}>Retry</Button></div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <CustomerTable customers={customers} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCustomers(getQueryParams(page))} /></Card>
    </PageContainer>
  );
}
