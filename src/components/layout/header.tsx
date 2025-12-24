import { Logo } from '@/components/app/logo';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">StatementXLS</h1>
        </Link>
      </div>
    </header>
  );
}
