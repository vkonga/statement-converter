
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Pricing Plans
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the plan that fits your needs. Start for free and
                  upgrade when you need more power.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container grid items-start justify-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:gap-12">
            <Card className="h-full shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl">Free</CardTitle>
                <CardDescription>
                  For individuals and occasional use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">$0/mo</div>
                <p className="text-muted-foreground">Up to 5 pages in life time</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-full shadow-lg border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
              </Badge>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl">Pro</CardTitle>
                <CardDescription>
                  For professionals and frequent users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">$15/mo</div>
                <p className="text-muted-foreground">Up to 400 pages/month</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup">Upgrade Now</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-full shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl">Pro Max</CardTitle>
                <CardDescription>
                  For power users and businesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">$30/mo</div>
                <p className="text-muted-foreground">Up to 1000 pages/month</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/signup">Go Pro Max</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-full shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl">Business</CardTitle>
                <CardDescription>
                  For large teams and enterprises.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">$50/mo</div>
                <p className="text-muted-foreground">Up to 4000 pages/month</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/signup">Contact Us</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
