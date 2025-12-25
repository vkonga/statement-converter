'use client';

import { useEffect, useState, useRef } from 'react';
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
import { useUser, useFirestore, useStorage } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DownloadPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const [finalData, setFinalData] = useState<ProcessedStatementData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasSavedToHistory = useRef(false);

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

  const saveToHistory = async (downloadUrl: string) => {
    if (!user || !firestore || !finalData || hasSavedToHistory.current) return;

    try {
      const statementsCol = collection(firestore, 'users', user.uid, 'statements');
      await addDoc(statementsCol, {
        fileName: finalData.fileName,
        uploadDate: serverTimestamp(),
        excelLocation: downloadUrl,
      });
      hasSavedToHistory.current = true; // Mark as saved
    } catch (error) {
      console.error('Failed to save conversion to history:', error);
      // Optional: Show a toast to the user
    }
  }

  const jsonToXlsxBlob = (data: Record<string, string>[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
  };
  
  const triggerLocalDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDownload = async (format: 'xlsx' | 'csv') => {
    if (!finalData) return;

    const baseFileName = `bank_statement_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'xlsx') {
        const xlsxBlob = jsonToXlsxBlob(finalData.transactions);
        
        // Trigger local download immediately for the user
        triggerLocalDownload(xlsxBlob, baseFileName);

        // Upload to Firebase Storage and save to history if user is logged in
        if (user && storage && !hasSavedToHistory.current) {
            const storageRef = ref(storage, `users/${user.uid}/statements/${baseFileName}_${Date.now()}.xlsx`);
            try {
                const snapshot = await uploadBytes(storageRef, xlsxBlob);
                const downloadURL = await getDownloadURL(snapshot.ref);
                await saveToHistory(downloadURL);
            } catch (error) {
                console.error("Failed to upload to Firebase Storage:", error);
            }
        }

    } else { // CSV
        const ws = XLSX.utils.json_to_sheet(finalData.transactions);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${baseFileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Note: CSV uploads are not currently saved to history.
        if (user && !hasSavedToHistory.current) {
          await saveToHistory(''); // Save record even without upload URL for CSV
        }
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
