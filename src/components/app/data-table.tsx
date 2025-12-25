'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MAPPING_OPTIONS, type MappingOptions } from '@/lib/mappings';
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

  const [columnMappings, setColumnMappings] = useState<
    Record<string, keyof MappingOptions | 'unmapped'>
  >(() => {
    const initialMappings: Record<string, keyof MappingOptions | 'unmapped'> =
      {};
    headers.forEach(header => {
      initialMappings[header] = 'unmapped';
    });
    return initialMappings;
  });

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

  const getMappedData = () => {
    const mappedEntries = Object.entries(columnMappings).filter(
      ([, v]) => v !== 'unmapped'
    );

    const requiredMappings: (keyof MappingOptions)[] = [
      'date',
      'amount_credit_debit',
      'description',
    ];
    const missingMappings = requiredMappings.filter(
      m => !mappedEntries.some(([, v]) => v === m)
    );

    if (missingMappings.length > 0) {
      toast({
        title: 'Incomplete Mapping',
        description: `Please map the following required fields: ${missingMappings.join(
          ', '
        )}`,
        variant: 'destructive',
      });
      return null;
    }

    return initialData.map(row => {
      const newRow: Record<string, string> = {};
      let debitValue: string | null = null;
      let creditValue: string | null = null;

      const amountColumn = Object.keys(columnMappings).find(
        header => columnMappings[header] === 'amount_credit_debit'
      );

      if (amountColumn && row[amountColumn] !== undefined) {
        const value = row[amountColumn];
        const amount = parseFloat(value.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(amount)) {
          if (value.toString().trim().startsWith('-') || amount < 0) {
            debitValue = Math.abs(amount).toString();
            creditValue = '0';
          } else {
            creditValue = amount.toString();
            debitValue = '0';
          }
        }
      }

      for (const [originalHeader, value] of Object.entries(row)) {
        const mapping = columnMappings[originalHeader];
        if (mapping && mapping !== 'unmapped') {
          if (mapping !== 'amount_credit_debit') {
            newRow[mapping] = value;
          }
        } else {
          // Keep unmapped columns
          newRow[originalHeader] = value;
        }
      }

      if (creditValue !== null) newRow['credit'] = creditValue;
      if (debitValue !== null) newRow['debit'] = debitValue;

      return newRow;
    });
  };

  const handleConfirm = () => {
    const mappedData = getMappedData();
    if (mappedData) {
      onConfirm(mappedData);
    }
  };

  const handleMappingChange = (
    header: string,
    value: keyof MappingOptions | 'unmapped'
  ) => {
    setColumnMappings(prev => {
      // Un-assign from other columns if this mapping is already used
      const newMappings = { ...prev };
      if (value !== 'unmapped') {
        for (const key in newMappings) {
          if (newMappings[key] === value) {
            newMappings[key] = 'unmapped';
          }
        }
      }
      newMappings[header] = value;
      return newMappings;
    });
  };

  const autoMapColumns = () => {
    const newMappings: Record<string, keyof MappingOptions | 'unmapped'> = {};
    const usedMappings = new Set<keyof MappingOptions>();

    headers.forEach(header => {
      const headerLower = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      let bestMatch: keyof MappingOptions | 'unmapped' = 'unmapped';

      for (const [key, option] of Object.entries(MAPPING_OPTIONS)) {
        if (usedMappings.has(key as keyof MappingOptions)) continue;
        const keywords = option.keywords.map(k =>
          k.toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        if (keywords.some(kw => headerLower.includes(kw))) {
          bestMatch = key as keyof MappingOptions;
          break;
        }
      }

      if (bestMatch !== 'unmapped') {
        usedMappings.add(bestMatch);
      }
      newMappings[header] = bestMatch;
    });
    setColumnMappings(newMappings);
    toast({
      title: 'Auto-mapping Complete',
      description: 'We made our best guess for column mappings.',
    });
  };

  const clearAllMappings = () => {
    setColumnMappings(prev => {
      const newMappings = { ...prev };
      for (const key in newMappings) {
        newMappings[key] = 'unmapped';
      }
      return newMappings;
    });
    toast({
      title: 'Mappings Cleared',
      description: 'All column mappings have been reset.',
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Review and Map Data</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearAllMappings}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button variant="outline" size="sm" onClick={autoMapColumns}>
            <Wand2 className="mr-2 h-4 w-4" />
            Auto-map Columns
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-foreground">
                        {header}
                      </span>
                      <Select
                        value={columnMappings[header]}
                        onValueChange={(
                          value: keyof MappingOptions | 'unmapped'
                        ) => handleMappingChange(header, value)}
                      >
                        <SelectTrigger className="w-[200px] h-9">
                          <SelectValue placeholder="Select mapping..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unmapped">Don't map</SelectItem>
                          {Object.entries(MAPPING_OPTIONS).map(
                            ([key, option]) => (
                              <SelectItem key={key} value={key}>
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {MAPPING_OPTIONS[
                        columnMappings[header] as keyof MappingOptions
                      ]?.required && (
                        <Badge variant="outline" className="w-fit">
                          Required
                        </Badge>
                      )}
                    </div>
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
                      {columnMappings[header] === 'amount_credit_debit'
                        ? formatCurrency(row[header])
                        : row[header]}
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
          Confirm Mappings & Proceed
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
