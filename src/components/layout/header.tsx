
'use client';

import { Logo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

import { useMemo } from 'react';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userRef = useMemo(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

  const handleLogout = () => {
    auth.signOut();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const NavItems = () => (
    <>
      <Link
        href="/pricing"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Pricing
      </Link>
      {user && (
        <>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>

          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">
            Econverter
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <NavItems />
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Credits:</span>
              <span>
                {isUserDataLoading ? (
                  <Skeleton className="h-4 w-8 inline-block" />
                ) : (
                  userData?.credits ?? 0
                )}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {isUserLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage
                        src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`}
                        alt={user.displayName || 'User'}
                      />
                      <AvatarFallback>
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {/* Mobile-only credits display in dropdown if needed, but sidebar is better */}
                      <div className="md:hidden pt-2 flex items-center justify-between text-muted-foreground">
                        <span>Credits:</span>
                        <span>{userData?.credits ?? 0}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation links for mobile devices
                  </SheetDescription>
                  <div className="flex flex-col gap-6 mt-6">
                    <Link href="/" className="flex items-center gap-2">
                      <Logo />
                      <span className="font-bold">Econverter</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                      <NavItems />
                      {!user && (
                        <div className="flex flex-col gap-2 mt-4">
                          <Button variant="ghost" asChild className="justify-start px-0">
                            <Link href="/signup">Sign Up</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/login">Login</Link>
                          </Button>
                        </div>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
