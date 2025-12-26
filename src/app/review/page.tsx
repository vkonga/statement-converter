'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessedStatementData } from '@/app/actions';
import { DataTable } from '@/components/app/data-table';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewPage() {
  const router = useRouter();
  const [statementData, setStatementData] =
    useState<ProcessedStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('statementData');
      if (storedData) {
        const parsedData = JSON.parse(storedData) as ProcessedStatementData;
        if (
          !parsedData.transactions ||
          parsedData.transactions.length === 0
        ) {
          throw new Error('No transactions found in stored data.');
        }
        setStatementData(parsedData);
      } else {
        // If there's no data, redirect to home.
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to parse statement data from session storage:', error);
      // Redirect home if data is invalid.
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleConfirm = (mappedData: Record<string, string>[]) => {
    const dataToStore: ProcessedStatementData = {
      transactions: mappedData,
      currency: statementData!.currency,
      fileName: statementData!.fileName,
      pageCount: statementData!.pageCount,
    };
    sessionStorage.setItem('finalData', JSON.stringify(dataToStore));
    router.push('/download');
  };

  if (isLoading || !statementData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Skeleton className="h-8 w-64" />
              <div className='flex items-center gap-2'>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-36" />
              </div>
            </div>
            <Skeleton className="h-[calc(100vh-300px)] w-full rounded-lg" />
            <div className="flex justify-end">
              <Skeleton className="h-11 w-56" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <DataTable
          initialData={statementData.transactions}
          currency={statementData.currency}
          onConfirm={handleConfirm}
        />
      </main>
      <Footer />
    </div>
  );
}
