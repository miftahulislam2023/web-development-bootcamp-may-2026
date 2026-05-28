import { getTransactions } from '@/actions/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TransactionRowActions } from '@/components/TransactionRowActions';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExportButtons } from '@/components/ExportButtons';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const typeFilter = params?.type || 'All';
  const monthFilter = params?.month || '';

  const transactions = await getTransactions({ type: typeFilter, month: monthFilter });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Transactions</h2>
        
        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <ExportButtons transactions={transactions} />
          
          {/* Simple Filters */}
          <div className="flex items-center gap-2 sm:border-l sm:pl-4 border-border">
            <Link href={`/transactions?type=All${monthFilter ? `&month=${monthFilter}` : ''}`}>
            <Button variant={typeFilter === 'All' ? 'default' : 'outline'} size="sm">
              All
            </Button>
          </Link>
          <Link href={`/transactions?type=Income${monthFilter ? `&month=${monthFilter}` : ''}`}>
            <Button variant={typeFilter === 'Income' ? 'default' : 'outline'} size="sm">
              Income
            </Button>
          </Link>
          <Link href={`/transactions?type=Expense${monthFilter ? `&month=${monthFilter}` : ''}`}>
            <Button variant={typeFilter === 'Expense' ? 'default' : 'outline'} size="sm">
              Expense
            </Button>
          </Link>
        </div>
        </div>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader>
          <CardTitle className="text-base font-semibold">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="font-medium">
                        {format(new Date(tx.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tx.type === 'Income' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-500'
                        }`}>
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.note || '-'}</TableCell>
                      <TableCell className={`text-right font-semibold ${
                        tx.type === 'Income' ? 'text-emerald-600' : ''
                      }`}>
                        {tx.type === 'Income' ? '+' : '-'}৳{tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <TransactionRowActions id={tx._id} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
