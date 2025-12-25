'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  FileText,
  TrendingUp,
  TrendingDown,
  List,
  Download,
  RotateCcw,
  BarChart,
} from 'lucide-react';
import { cn, jsonToCsv, downloadFile } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as XLSX from 'xlsx';

type RowData = { [key: string]: string | number };
type TableData = RowData[];
type FileFormat = 'xlsx' | 'csv';

const jsonToXlsx = (data: TableData, totals: { credits: number, debits: number }, currency: string, fileName: string) => {
  if (typeof window === 'undefined') return;

  const wb = XLSX.utils.book_new();

  const creditFormat = `${currency}#,##0.00`;
  const debitFormat = `${currency}#,##0.00;[Red]-${currency}#,##0.00`;

  const ws_data = [
    ["Total Credits", totals.credits],
    ["Total Debits", totals.debits],
    [], 
    ...data.length > 0 ? [Object.keys(data[0])] : [],
    ...data.map(row => Object.values(row))
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  const totalCreditsCell = XLSX.utils.encode_cell({c: 1, r: 0});
  if (ws[totalCreditsCell]) ws[totalCreditsCell].z = creditFormat;
  
  const totalDebitsCell = XLSX.utils.encode_cell({c: 1, r: 1});
  if (ws[totalDebitsCell]) ws[totalDebitsCell].z = debitFormat;

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const creditIndex = headers.indexOf('credit');
    const debitIndex = headers.indexOf('debit');
    
    for (let i = 0; i < data.length; i++) {
      const rowNum = i + 4; 
      if (creditIndex !== -1) {
        const cellRef = XLSX.utils.encode_cell({c: creditIndex, r: rowNum});
        if (ws[cellRef]) ws[cellRef].z = creditFormat;
      }
      if (debitIndex !== -1) {
        const cellRef = XLSX.utils.encode_cell({c: debitIndex, r: rowNum});
        if (ws[cellRef]) {
            ws[cellRef].z = debitFormat;
        }
      }
    }
  }

  if (data.length > 0) {
    const cols = Object.keys(data[0]).map((key, i) => {
        let maxLength = key.length;
        data.forEach(row => {
            const cellValue = row[key];
            if (cellValue != null) {
                maxLength = Math.max(maxLength, String(cellValue).length);
            }
        });
        return { wch: maxLength + 2 };
    });
    ws['!cols'] = cols;
  }

  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, `${fileName}_converted.xlsx`);
};

export default function DownloadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<TableData | null>(null);
  const [fileName, setFileName] = useState('statement');
  const [fileSize, setFileSize] = useState(0);
  const [fileFormat, setFileFormat] = useState<FileFormat>('xlsx');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const storedData = sessionStorage.getItem('convertedData');
    const storedFileName = sessionStorage.getItem('fileName');
    const storedCurrency = sessionStorage.getItem('currency');
    
    if (storedFileName) {
      setFileName(storedFileName.replace(/\.pdf$/i, ''));
    }
     if (storedCurrency) {
      setCurrency(storedCurrency);
    }

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        setFileSize(new Blob([storedData]).size);
      } catch (error) {
        console.error('Failed to parse converted data', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load the converted data. Please try again.',
          variant: 'destructive',
        });
        router.push('/');
      }
    } else {
       router.push('/');
    }
  }, [router, toast]);
  
  const { totalCredits, totalDebits, transactionCount } = useMemo(() => {
    if (!data) return { totalCredits: 0, totalDebits: 0, transactionCount: 0 };
    
    let credits = 0;
    let debits = 0;

    data.forEach(row => {
      const creditAmount = Number(row.credit) || 0;
      const debitAmount = Number(row.debit) || 0;
      credits += creditAmount;
      debits += debitAmount;
    });

    return {
      totalCredits: credits,
      totalDebits: debits,
      transactionCount: data.length,
    };
  }, [data]);

  const tableHeaders = useMemo(() => {
    if (!data || data.length === 0) return [];
    const headers = Object.keys(data[0]);
    const orderedHeaders = headers.filter(h => h !== 'credit' && h !== 'debit');
    if (headers.includes('credit')) orderedHeaders.push('credit');
    if (headers.includes('debit')) orderedHeaders.push('debit');
    return orderedHeaders;
  }, [data]);

  if (!data) {
    return null; 
  }

  const handleDownload = () => {
    if (!data) return;

    if (fileFormat === 'xlsx') {
      jsonToXlsx(data, { credits: totalCredits, debits: totalDebits }, currency, fileName);
       toast({
        title: 'Download Started',
        description: `Your file ${fileName}_converted.xlsx is downloading.`,
      });
    } else {
      const csvString = jsonToCsv(JSON.stringify(data), { credits: totalCredits, debits: totalDebits });
      downloadFile(csvString, `${fileName}_converted.csv`, 'text/csv;charset=utf-8;');
       toast({
        title: 'Download Started',
        description: `Your file ${fileName}_converted.csv is downloading.`,
      });
    }
  };

  const formatCurrency = (value: number) => {
    if (value === 0) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(0);
    }
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
  };

  const formatCellCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value === 0) {
      return '';
    }
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Your bank statement is ready</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              We successfully processed <span className="font-medium text-foreground">{fileName}.pdf</span>. You can
              now download your converted file below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="h-10 w-10 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-lg">{fileName}.{fileFormat}</p>
                    <p className="text-sm text-muted-foreground">
                      {(fileSize / 1024).toFixed(2)} KB &bull; Ready to download
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium mb-2">FORMAT</p>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant={fileFormat === 'xlsx' ? 'default' : 'outline'} 
                            onClick={() => setFileFormat('xlsx')}
                            className="flex-1"
                        >
                            Excel (.xlsx)
                        </Button>
                        <Button 
                            variant={fileFormat === 'csv' ? 'default' : 'outline'}
                            onClick={() => setFileFormat('csv')}
                            className="flex-1"
                        >
                            CSV (.csv)
                        </Button>
                    </div>
                </div>
                
                <Button size="lg" className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-5 w-5" />
                  Download File
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  File automatically deleted after 1 hour
                </p>

                <div className="mt-8 text-center">
                    <Button variant="link" onClick={() => router.push('/')}>
                        <RotateCcw className="mr-2 h-4 w-4"/>
                        Convert another file
                    </Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(totalCredits)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <p className="text-sm font-medium text-muted-foreground">Total Debits</p>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(totalDebits)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <List className="h-5 w-5 text-blue-500" />
                      <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                    </div>
                    <p className="text-2xl font-bold">{transactionCount}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-background rounded-lg border shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">DATA PREVIEW</h3>
                  <Badge variant="outline">All {transactionCount} rows</Badge>
                </div>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHeaders.map(header => (
                            <TableHead key={header} className={cn((header === 'credit' || header === 'debit') && 'text-right')}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          {tableHeaders.map((header) => (
                             <TableCell key={header} className={cn((header === 'credit' || header === 'debit') && 'text-right font-mono')}>
                               {header === 'credit' || header === 'debit' ? 
                                 <span className={cn(header === 'credit' ? 'text-green-600' : 'text-red-600')}>
                                    {formatCellCurrency(Number(row[header]))}
                                 </span>
                                 : String(row[header])}
                             </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              
              <Card className="mt-8 bg-primary/5 border-dashed border-primary/20">
                  <CardContent className="p-6 flex items-center justify-between">
                      <div>
                          <h4 className="font-semibold text-lg">Need to analyze this data?</h4>
                          <p className="text-muted-foreground">Try our advanced analytics dashboard to visualize your spending habits.</p>
                      </div>
                      <Button variant="outline"><BarChart className="mr-2 h-4 w-4"/>View Analytics</Button>
                  </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
