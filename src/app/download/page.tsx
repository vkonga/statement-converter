
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

type RowData = { [key: string]: string | number };
type TableData = RowData[];
type FileFormat = 'xlsx' | 'csv';

// Mock function for XLSX conversion, as it's more complex.
const jsonToXlsx = (jsonDataString: string) => {
  // In a real app, this would use a library like 'xlsx'
  // For now, we'll just return the CSV data for demonstration.
  console.warn('XLSX export is not fully implemented and uses CSV as a fallback.');
  return jsonToCsv(jsonDataString);
};

export default function DownloadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<TableData | null>(null);
  const [fileName, setFileName] = useState('statement');
  const [fileSize, setFileSize] = useState(0);
  const [fileFormat, setFileFormat] = useState<FileFormat>('xlsx');

  useEffect(() => {
    const storedData = sessionStorage.getItem('convertedData');
    const storedFileName = sessionStorage.getItem('fileName');
    if (storedFileName) {
      setFileName(storedFileName.replace(/\.pdf$/i, ''));
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
       // Make sure we have data, otherwise redirect
       router.push('/');
    }
  }, [router, toast]);

  const { totalCredits, totalDebits, transactionCount } = useMemo(() => {
    if (!data) return { totalCredits: 0, totalDebits: 0, transactionCount: 0 };
    
    let credits = 0;
    let debits = 0;

    data.forEach(row => {
      const amountStr = String(row.amount_credit_debit || '0').replace(/[^0-9.-]+/g,"");
      const amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
        if (amount > 0) {
          credits += amount;
        } else {
          debits += Math.abs(amount);
        }
      }
    });

    return {
      totalCredits: credits,
      totalDebits: debits,
      transactionCount: data.length,
    };
  }, [data]);

  const handleDownload = () => {
    if (!data) return;

    const dataString = JSON.stringify(data);
    let fileContent: string | null = null;
    let mimeType = '';
    let finalFileName = `${fileName}_converted.${fileFormat}`;

    if (fileFormat === 'csv') {
      fileContent = jsonToCsv(dataString);
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      // We are mocking xlsx for now
      fileContent = jsonToXlsx(dataString);
      // Proper MIME type for XLSX
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    if (fileContent) {
      downloadFile(fileContent, finalFileName, mimeType);
      toast({
        title: 'Download Started',
        description: `Your file ${finalFileName} is downloading.`,
      });
    } else {
      toast({
        title: 'Download Failed',
        description: 'Could not generate the file for download.',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  if (!data) {
    return null; // or a loading spinner
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
            {/* Left Column */}
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

            {/* Right Column */}
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
                  <Badge variant="outline">First 5 rows</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data[0]).map(header => (
                          <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {Object.entries(row).map(([key, value], i) => (
                           <TableCell key={i}>
                             {key.includes('amount') ? formatCurrency(parseFloat(String(value))) : String(value)}
                           </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
