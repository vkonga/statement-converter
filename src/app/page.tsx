import { FileUploadForm } from '@/components/app/file-upload-form';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-start justify-center p-4 pt-16 sm:pt-24">
        <FileUploadForm />
      </main>
    </div>
  );
}
