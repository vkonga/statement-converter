'use client';

import { useUser, useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const userRef = useMemo(() => {
        return user ? doc(firestore, 'users', user.uid) : null;
    }, [user, firestore]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        const names = name.split(' ');
        const initials = names.map((n) => n[0]).join('');
        return initials.toUpperCase();
    };

    if (isUserLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 container py-12 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[150px] w-full" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your account settings and view your usage statistics.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* User Profile Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Your personal account details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`}
                                            alt={user.displayName || 'User'}
                                        />
                                        <AvatarFallback className="text-xl">
                                            {getInitials(user.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-medium">{user.displayName || 'User'}</h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <Badge variant="outline" className="mt-2">
                                            {userData?.role || 'User'}
                                        </Badge>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-1">
                                        <span className="text-muted-foreground">User ID</span>
                                        <span className="font-mono text-xs">{user.uid}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-muted-foreground">Account Created</span>
                                        <span>{new Date(user.metadata.creationTime || '').toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-muted-foreground">Last Sign In</span>
                                        <span>{new Date(user.metadata.lastSignInTime || '').toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Credits & Usage Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage & Credits</CardTitle>
                                <CardDescription>Your current subscription and credit balance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                                        Remaining Credits
                                    </span>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        {isUserDataLoading ? (
                                            <Skeleton className="h-10 w-16" />
                                        ) : (
                                            <span className="text-5xl font-bold text-primary">
                                                {userData?.credits ?? 0}
                                            </span>
                                        )}
                                        <span className="text-muted-foreground">pages</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Plan Details</h4>
                                        <p className="text-sm text-muted-foreground">
                                            You are currently on the <span className="font-semibold text-foreground">Free Plan</span>.
                                            Purchase more credits to convert larger documents.
                                        </p>
                                    </div>
                                    <Separator />
                                    <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                {/* Icon could go here */}
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                    Need more power?
                                                </h3>
                                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                                    <p>
                                                        Upgrade to our Pro plan for unlimited conversions and priority support.
                                                    </p>
                                                </div>
                                                <div className="mt-4">
                                                    {/* Navigate to pricing page */}
                                                    <button
                                                        onClick={() => router.push('/pricing')}
                                                        className="text-sm font-medium text-blue-800 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-100"
                                                    >
                                                        View Pricing &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
