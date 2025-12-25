'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type DataTableProps = {
  initialData: Record<string, string>[];
  currency: string;
  onConfirm: (mappedData: Record<string, string>[]) => void;
};

export function DataTable({
  initialData,
  currency,
  onConfirm,
}: DataTableProps) {
  const { toast } = useToast();
  const headers = useMemo(() => {
    return initialData.length > 0 ? Object.keys(initialData[0]) : [];
  }, [initialData]);

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return '';
    const numberValue =
      typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    if (isNaN(numberValue)) return value.toString();

    const isNegative = numberValue < 0 || value.toString().trim().startsWith('-');

    return (
      <span className={cn(isNegative ? 'text-destructive' : 'text-green-600')}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD',
        }).format(numberValue)}
      </span>
    );
  };

  const handleConfirm = () => {
    // Since there's no mapping, we just pass the original data forward.
    if (initialData.length > 0) {
      onConfirm(initialData);
    } else {
      toast({
        title: 'No Data',
        description: 'There is no data to confirm.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Review Extracted Data</h2>
      </div>

      <div className="rounded-lg border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    <span className="font-semibold text-foreground">
                      {header}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="whitespace-nowrap text-sm"
                    >
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleConfirm}>
          Proceed to Download
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
