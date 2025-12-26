import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: {
    default: 'Econvert | Bank Statement to Excel Converter',
    template: '%s | Econvert'
  },
  description: 'Econvert: The fastest way to convert bank statement PDFs into editable Excel files. Secure, accurate, and easy to use.',
  keywords: ['Econvert', 'bank statement converter', 'pdf to excel', 'financial data extraction'],
  verification: {
    google: 'x4hKZ7rEg44nVNzqldhpi9a4iOBckL_BPsKx0qdsuIo',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
