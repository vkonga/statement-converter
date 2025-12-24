import { FileUploadArea } from '@/components/app/file-upload-area';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, History, Ban, ShieldCheck } from 'lucide-react';

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
                  Turn PDF Bank Statements into Excel
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                  Fast, secure, and accurate conversion. Supports PDF, CSV, and
                  MT940 formats. No sign-up required for your first file.
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary bg-primary/10">
                <ShieldCheck className="mr-2 h-4 w-4" />
                SECURITY FIRST
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Bank-level Security Protocols
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>End-to-End Encryption</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Your files are encrypted with 256-bit SSL during transfer
                    and processing.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Auto-Deletion</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Files are automatically permanently deleted from our
                    servers after 1 hour.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-card shadow-lg border-border/60">
                <CardHeader className="items-center">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <Ban className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>No Data Storage</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We process your data instantly. We do not store, view, or
                    sell your financial data.
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
