import { FileUploadArea } from '@/components/app/file-upload-area';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl xl:text-7xl/none">
                  Unlock Your Bank Statements
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                  Instantly convert your bank statement PDFs into analysis-ready
                  Excel files. Save time, reduce errors, and gain insights
                  faster than ever.
                </p>
              </div>
              <div className="w-full max-w-2xl">
                <FileUploadArea />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted/40 py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Fast, accurate data extraction.</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Our AI-powered engine extracts data with high precision,
                    saving you hours of manual work.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Secure and private processing.</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Your files are encrypted and automatically deleted after
                    processing. We never store your data.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>No more manual data entry.</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Say goodbye to tedious copy-pasting. Get clean, structured
                    data ready for analysis.
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
