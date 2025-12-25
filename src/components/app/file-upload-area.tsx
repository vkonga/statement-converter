'use client';

import { useState, useRef, type DragEvent } from 'react';
import {
  UploadCloud,
  Trash2,
  File as FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { processPdf } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export function FileUploadArea() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    
    // Max 25MB
    if (selectedFile.size > 25 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file smaller than 25MB.',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');
    setErrorMessage(null);
    setProgress(0);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        setProgress(percentage);
      }
    };

    reader.onload = async () => {
      setStatus('processing');
      const base64Pdf = reader.result as string;
      const result = await processPdf(base64Pdf);

      if (result.success) {
        setStatus('success');
        toast({
            title: "Extraction Complete",
            description: "We've successfully extracted the data from your statement."
        });

        // Store result in session storage and navigate
        sessionStorage.setItem('statementData', JSON.stringify(result.data));
        router.push('/review');

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
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage(null);
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderFileUpload = () => (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200',
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50'
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4 border-8 border-primary/5">
          <UploadCloud className="h-10 w-10 text-primary" />
        </div>
        <div className='space-y-1'>
          <p className="mt-4 font-semibold text-lg">
            Drop your bank statement here
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF (Max 25MB)
          </p>
        </div>
        <Button variant="default" size="lg" className='mt-2'>
          Browse Files
        </Button>
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

  const renderFileStatus = () => {
    if (!file) return null;

    let statusText = 'Ready';
    let statusColor = 'text-green-500';

    if (status === 'uploading') {
        statusText = `Uploading... ${progress}%`;
        statusColor = 'text-blue-500';
    } else if (status === 'processing') {
        statusText = 'Processing...';
        statusColor = 'text-yellow-500';
    } else if (status === 'success') {
        statusText = 'Success';
        statusColor = 'text-green-500';
    } else if (status === 'error') {
        statusText = 'Error';
        statusColor = 'text-red-500';
    }

    return (
      <div className="w-full space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-4">
            <FileIcon className="h-8 w-8 text-primary"/>
            <div className="flex-1">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p className={cn("text-xs font-semibold", statusColor)}>{statusText}</p>
                </div>
                {status === 'uploading' && <Progress value={progress} className="h-1 mt-1" />}
                {status === 'processing' && <Progress value={100} className="h-1 mt-1 animate-pulse" />}
            </div>
            {status !== 'processing' && status !== 'uploading' && (
              <Button variant="ghost" size="icon" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-5 w-5"/>
              </Button>
            )}
        </div>
        {status === 'error' && (
          <div className="text-destructive text-sm mt-2 p-2 bg-destructive/10 rounded-md text-center">
            {errorMessage}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {status === 'idle' ? renderFileUpload() : renderFileStatus()}
    </div>
  );
}
