import { FileUploadForm } from '@/components/app/file-upload-form';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileCheck, ScanLine } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl xl:text-7xl/none">
                    Unlock Your Bank Statements
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                    Instantly convert your bank statement PDFs into
                    analysis-ready Excel files. Save time, reduce errors, and
                    gain insights faster than ever.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <FileUploadForm />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-background py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="h-full">
                <CardHeader>
                  <Bot className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Fast, Accurate Extraction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI-powered engine pulls data from your PDFs with speed
                    and precision, eliminating tedious manual work.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader>
                  <FileCheck className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your data is processed securely. We respect your privacy
                    and never store your financial information.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader>
                  <ScanLine className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>No More Manual Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Free yourself from the drudgery of data entry. Get
                    perfectly formatted Excel files in seconds.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
