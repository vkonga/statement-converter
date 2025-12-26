import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col sm:flex-row h-auto sm:h-20 items-center justify-between p-4 sm:p-0">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact-support"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact Support
          </Link>
        </div>
        <p className="text-sm text-muted-foreground text-center sm:text-right">
          © {new Date().getFullYear()} StatementConverter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
