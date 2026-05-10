import { Download } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

const reports = ['Sales report', 'Orders report', 'Products performance', 'Customers report', 'Coupon usage report', 'Inventory report'];

export function ReportsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Reports" action={<Button icon={<Download className="h-4 w-4" />}>Export</Button>} />
      <Card><CardContent className="grid gap-4 md:grid-cols-3"><Input type="date" /><Input type="date" /><Button variant="secondary">Apply Date Range</Button></CardContent></Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {reports.map((report) => (
          <Card key={report}>
            <CardHeader><CardTitle>{report}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-52 items-end gap-2 border-b border-l border-border-subtle p-4">
                {[55, 72, 44, 88, 63, 96, 71].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t bg-brand/70" style={{ height: `${height}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
