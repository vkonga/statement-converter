import { FileUploadForm } from '@/components/app/file-upload-form';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
              Unlock Your Bank Statements
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
              Instantly convert your bank statement PDFs into analysis-ready
              Excel files. Save time, reduce errors, and gain insights faster
              than ever.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Fast, accurate data extraction.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Secure and private processing.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>No more manual data entry.</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <FileUploadForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
