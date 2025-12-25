'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, FileDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProcessedStatementData } from '@/app/actions';

export default function DownloadPage() {
  const router = useRouter();
  const [finalData, setFinalData] = useState<ProcessedStatementData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('finalData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFinalData(parsedData);
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to parse final data from session storage:', error);
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const jsonToXlsx = (data: Record<string, string>[], fileName: string, currency: string) => {
    if (!data || data.length === 0) {
      console.error('No data to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const columnWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => (row[key] ? row[key].toString().length : 0))
      ),
    }));
    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const jsonToCsv = (data: Record<string, any>[], fileName: string) => {
    if (!data || data.length === 0) {
      console.error('No data to export.');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDownload = (format: 'xlsx' | 'csv') => {
    if (!finalData) return;

    const fileName = `bank_statement_${new Date().toISOString().split('T')[0]}`;
    if (format === 'xlsx') {
      jsonToXlsx(finalData.transactions, fileName, finalData.currency);
    } else {
      jsonToCsv(finalData.transactions, fileName);
    }
  };

  if (isLoading || !finalData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <Card className="w-full max-w-lg">
            <CardHeader className="items-center text-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-48 mt-4" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Skeleton className="h-4 w-full" />
              <div className="flex w-full gap-4 mt-4">
                <Skeleton className="h-11 flex-1" />
                <Skeleton className="h-11 flex-1" />
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="items-center text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <CardTitle className="mt-4 text-2xl">Ready to Download</CardTitle>
            <CardDescription>
              Your statement data has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              You have processed{' '}
              <span className="font-bold text-foreground">
                {finalData.transactions.length}
              </span>{' '}
              transactions. Choose your desired format below.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleDownload('xlsx')}
              >
                <FileDown className="mr-2 h-5 w-5" />
                Download XLSX
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={() => handleDownload('csv')}
              >
                <FileDown className="mr-2 h-5 w-5" />
                Download CSV
              </Button>
            </div>
            <Button
              variant="link"
              className="mt-4"
              onClick={() => router.push('/')}
            >
              Convert Another File
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}