import { getDashboardData } from '@/actions/transaction';
import { DashboardClient } from '@/components/DashboardClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const data = await getDashboardData();

  if ('error' in data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive font-medium">{data.error}</p>
      </div>
    );
  }

  const { totals, categoryData, dailyData, recentTransactions } = data;

  return (
    <DashboardClient 
      totals={totals}
      categoryData={categoryData}
      dailyData={dailyData}
      recentTransactions={recentTransactions}
    />
  );
}
