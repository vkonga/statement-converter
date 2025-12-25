'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown, FileText, History as HistoryIcon } from 'lucide-react';
import Link from 'next/link';

interface Statement {
  id: string;
  fileName: string;
  uploadDate: {
    seconds: number;
    nanoseconds: number;
  };
  excelLocation?: string;
}

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const statementsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'statements'),
      orderBy('uploadDate', 'desc')
    );
  }, [user, firestore]);

  const {
    data: statements,
    isLoading: isStatementsLoading,
    error,
  } = useCollection<Statement>(statementsQuery);

  const formatDate = (timestamp: Statement['uploadDate']) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = (excelUrl: string | undefined) => {
    if (excelUrl) {
      window.open(excelUrl, '_blank');
    }
  };

  const renderLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-28" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderUnauthorized = () => (
    <Card className="text-center">
      <CardHeader>
        <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <CardTitle>View Your History</CardTitle>
        <CardDescription>
          Please log in to see your past conversions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </CardContent>
    </Card>
  );

  const renderEmpty = () => (
    <Card className="text-center">
      <CardHeader>
        <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <CardTitle>No History Yet</CardTitle>
        <CardDescription>
          You haven&apos;t converted any statements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/">Convert a File</Link>
        </Button>
      </CardContent>
    </Card>
  );

  const renderHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle>Conversion History</CardTitle>
        <CardDescription>
          A record of your uploaded and converted statements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements?.map((statement) => (
              <TableRow key={statement.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {statement.fileName}
                </TableCell>
                <TableCell>{formatDate(statement.uploadDate)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(statement.excelLocation)}
                    disabled={!statement.excelLocation}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-muted/40 py-12">
        <div className="container px-4 md:px-6">
          {isUserLoading || isStatementsLoading ? (
            renderLoading()
          ) : !user ? (
            renderUnauthorized()
          ) : statements && statements.length > 0 ? (
            renderHistory()
          ) : (
            renderEmpty()
          )}
           {error && (
            <Card className="mt-4 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                    <CardDescription>
                        We couldn&apos;t load your conversion history. Please try again later.
                    </CardDescription>
                </CardHeader>
            </Card>
           )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
