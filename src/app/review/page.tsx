'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/app/data-table';
import { ArrowLeft, Cog, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This is a simplified representation of your data.
// In a real app, you would define this more robustly.
type RowData = { [key: string]: string | number };
type TableData = RowData[];

const MAPPING_OPTIONS = [
  { value: 'transaction_date', label: 'Transaction Date' },
  { value: 'description', label: 'Description' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'amount_credit_debit', label: 'Amount (will be split)' },
  { value: 'ignore', label: 'Ignore Column' },
];


export default function ReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<TableData | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({});
  const [fileName, setFileName] = useState('statement');

  useEffect(() => {
    const storedData = sessionStorage.getItem('extractedData');
    const storedFileName = sessionStorage.getItem('fileName');
    if (storedFileName) {
      setFileName(storedFileName.replace(/\.pdf$/i, ''));
    }

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        let dataArray: any[] = [];
        if (Array.isArray(parsedData)) {
            dataArray = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
            const key = Object.keys(parsedData).find(k => Array.isArray((parsedData as any)[k]));
            if (key) {
                dataArray = (parsedData as any)[key];
            }
        }
        
        if (dataArray.length > 0) {
          setData(dataArray);
          const initialHeaders = Object.keys(dataArray[0]);
          setHeaders(initialHeaders);
          // Auto-map based on some logic
          const initialMappings: { [key: string]: string } = {};
          initialHeaders.forEach(header => {
            const headerLower = header.toLowerCase();
            if (headerLower.includes('date')) {
              initialMappings[header] = 'transaction_date';
            } else if (headerLower.includes('desc') || headerLower.includes('details')) {
              initialMappings[header] = 'description';
            } else if (headerLower.includes('credit') && !headerLower.includes('debit')) {
                initialMappings[header] = 'credit';
            } else if (headerLower.includes('debit') && !headerLower.includes('credit')) {
                initialMappings[header] = 'debit';
            } else if (headerLower.includes('amount') || headerLower.includes('credit') || headerLower.includes('debit')) {
                initialMappings[header] = 'amount_credit_debit';
            } else {
              initialMappings[header] = 'ignore';
            }
          });
          setColumnMappings(initialMappings);
        } else {
            router.push('/');
        }
      } catch (error) {
        console.error('Failed to parse stored data', error);
        toast({
          title: "Error loading data",
          description: "Could not load the extracted data. Please try uploading again.",
          variant: "destructive",
        });
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router, toast]);

  const handleMappingChange = (column: string, value: string) => {
    setColumnMappings(prev => ({ ...prev, [column]: value }));
  };

  const getMappedData = () => {
    if (!data) return [];
  
    return data.map(row => {
      const newRow: { [key: string]: any } = {};
      for (const originalHeader in columnMappings) {
        const newHeader = columnMappings[originalHeader];
        if (newHeader !== 'ignore' && row[originalHeader] !== undefined) {
          if (newHeader === 'amount_credit_debit') {
            const valueStr = String(row[originalHeader] || '').trim();
            // This regex is a bit more robust for various currency formats
            const amountStr = valueStr.replace(/[^0-9.-]+/g, "");
            const amount = parseFloat(amountStr);
  
            if (!isNaN(amount)) {
              // Check if it's a debit (negative value)
              if (valueStr.startsWith('-') || amount < 0) {
                newRow['debit'] = Math.abs(amount);
                if (!newRow['credit']) {
                  newRow['credit'] = 0;
                }
              } else { // Otherwise it's a credit
                newRow['credit'] = amount;
                if (!newRow['debit']) {
                  newRow['debit'] = 0;
                }
              }
            } else {
              if (!newRow['credit']) newRow['credit'] = 0;
              if (!newRow['debit']) newRow['debit'] = 0;
            }
          } else {
            // This handles cases where 'credit' or 'debit' are mapped directly
            const value = row[originalHeader];
            newRow[newHeader] = (typeof value === 'string' && (newHeader === 'credit' || newHeader === 'debit')) 
                ? parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0
                : value;
          }
        }
      }
      // Ensure credit/debit columns exist even if not in source
      if (newRow['credit'] === undefined) newRow['credit'] = 0;
      if (newRow['debit'] === undefined) newRow['debit'] = 0;
  
      return newRow;
    });
  };

  const handleConfirmAndConvert = () => {
    const mappedData = getMappedData();
    if (mappedData.length === 0) {
      toast({
        title: 'Conversion Failed',
        description: 'No data to convert. Please check your mappings.',
        variant: 'destructive',
      });
      return;
    }
    
    // Store data for the download page
    sessionStorage.setItem('convertedData', JSON.stringify(mappedData));
    
    toast({
      title: "Ready for Download",
      description: "Your data has been processed and is ready for the final step.",
    });
    router.push('/download');
  };
  
  const mappedColumnsCount = Object.values(columnMappings).filter(v => v !== 'ignore').length;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-medium">Loading review data...</p>
          <Progress value={50} className="w-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Step 2 of 3: Review & Mapping
            </p>
            <Progress value={66} className="h-2 w-full mt-1" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Review & Map Fields</h1>
              <p className="text-muted-foreground mt-1">
                We've extracted the following data. Please verify the columns
                and map them to the correct Excel fields below. Use "Ignore"
                for columns you don't need.
              </p>
            </div>
            <div className='flex items-center gap-2 mt-4 md:mt-0'>
                <Button variant='outline'><Cog className='mr-2 h-4 w-4'/>Date Format</Button>
                <Button variant='outline'><RotateCcw className='mr-2 h-4 w-4'/>Reset Mappings</Button>
            </div>
          </div>

          <div className="bg-background rounded-lg border shadow-sm">
            <DataTable 
                headers={headers} 
                data={data} 
                columnMappings={columnMappings}
                onMappingChange={handleMappingChange}
                mappingOptions={MAPPING_OPTIONS}
            />
          </div>
        </div>
      </main>
      <div className="sticky bottom-0 bg-background border-t z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Upload
            </Button>
            <div className="flex items-center gap-4">
                <div className="text-sm text-right">
                    <p className="font-medium">{mappedColumnsCount} Columns Mapped</p>
                    <p className="text-muted-foreground">All required fields present</p>
                </div>
                <Button size="lg" onClick={handleConfirmAndConvert}>
                Confirm & Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
