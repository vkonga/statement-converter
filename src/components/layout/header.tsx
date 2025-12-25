import { Logo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const isLoggedIn = false; // Placeholder

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">
            StatementConverter
          </h1>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            History
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/32/32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
