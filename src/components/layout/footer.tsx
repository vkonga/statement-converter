import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} StatementXLS. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
