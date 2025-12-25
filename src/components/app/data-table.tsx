'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type RowData = { [key: string]: string | number };

interface DataTableProps {
  headers: string[];
  data: RowData[];
  columnMappings: { [key: string]: string };
  onMappingChange: (column: string, value: string) => void;
  mappingOptions: { value: string; label: string }[];
}

const ROWS_PER_PAGE = 10;

export function DataTable({
  headers,
  data,
  columnMappings,
  onMappingChange,
  mappingOptions,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const getConfidence = (header: string) => {
    const mapping = columnMappings[header];
    if (mapping && mapping !== 'ignore' && mapping !== 'amount_credit_debit') return "High Confidence";
    return "Review";
  }

  const getDetectedType = (header: string) => {
    const lowerHeader = header.toLowerCase();
    if (lowerHeader.includes('date')) return 'Date (MM/DD/YYYY)';
    if (lowerHeader.includes('amount') || lowerHeader.includes('credit') || lowerHeader.includes('debit')) return 'Currency (USD)';
    if (lowerHeader.includes('id') || lowerHeader.includes('number')) return 'Number';
    return 'Text String';
  }

  const formatCurrency = (value: string | number) => {
    const num = Number(String(value).replace(/[^0-9.-]+/g,""));
    if (isNaN(num)) return value;
    
    const isPositive = num >= 0;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    const prefix = isPositive ? '+ ' : '- ';

    return (
        <span className={colorClass}>
            {prefix}${Math.abs(num).toFixed(2)}
        </span>
    );
  }
  
  const isWithdrawal = (value: string) => {
    return String(value).toLowerCase().includes('withdrawal');
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {headers.map(header => (
                <TableHead key={header} className="p-4 whitespace-nowrap">
                  <div className='flex items-center justify-between mb-2'>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {header.replace(/_/g, ' ')}
                    </span>
                    <Badge variant={getConfidence(header) === 'High Confidence' ? 'secondary' : 'outline'}>
                        {getConfidence(header)}
                    </Badge>
                  </div>
                  <Select
                    value={columnMappings[header]}
                    onValueChange={value => onMappingChange(header, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      {mappingOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Detected: {getDetectedType(header)}
                  </p>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={isWithdrawal(String(row[headers[1]])) ? 'bg-yellow-500/10' : ''}>
                {headers.map(header => (
                  <TableCell key={`${rowIndex}-${header}`} className="p-4 whitespace-nowrap">
                    {
                      getDetectedType(header).startsWith('Currency') 
                        ? formatCurrency(row[header]) 
                        : (
                            isWithdrawal(String(row[header])) ? 
                            <span className='flex items-center gap-1 text-yellow-700'>
                                <AlertTriangle className='h-4 w-4 text-yellow-500'/>
                                {row[header]}
                            </span> :
                            String(row[header])
                        )
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
          {data.length} detected rows
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(prev => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
