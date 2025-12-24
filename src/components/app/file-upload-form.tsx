'use client';

import { useState, useRef, type DragEvent } from 'react';
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  File as FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, jsonToCsv, downloadFile } from '@/lib/utils';
import { processPdf } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'processing' | 'success' | 'error';

export function FileUploadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [processedData, setProcessedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    setStatus('processing');
    setErrorMessage(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Pdf = reader.result as string;
      const result = await processPdf(base64Pdf);

      if (result.success) {
        setProcessedData(result.data);
        setStatus('success');
      } else {
        setErrorMessage(result.error);
        setStatus('error');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the file.');
      setStatus('error');
    };
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDownload = () => {
    if (!processedData) return;
    const csvData = jsonToCsv(processedData);
    if (csvData) {
      const originalFileName = fileName?.replace(/\.pdf$/i, '') || 'statement';
      downloadFile(csvData, `${originalFileName}.csv`);
    } else {
      toast({
        title: 'Download Failed',
        description: 'Could not convert data to CSV.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setProcessedData(null);
    setErrorMessage(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-semibold text-lg">Processing Statement</p>
            <p className="text-muted-foreground">{fileName}</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-lg">Conversion Successful!</p>
            <p className="text-muted-foreground">
              Your statement data is ready for download.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleDownload} className="w-full">
                <FileDown className="mr-2" />
                Download Excel (.csv)
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-full">
                Convert Another
              </Button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="font-semibold text-lg">Conversion Failed</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {errorMessage || 'An unknown error occurred.'}
            </p>
            <Button onClick={handleReset} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200',
              isDragging
                ? 'border-primary bg-accent'
                : 'border-border hover:border-primary/50'
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">
                Drag & drop your PDF here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to select a file
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={e => handleFileSelect(e.target.files?.[0] || null)}
            />
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Get Started</CardTitle>
        <CardDescription>
          Upload your PDF to begin the conversion process.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[280px] flex items-center justify-center p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
