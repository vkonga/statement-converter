'use client';

import { useState } from 'react';
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
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'For individuals and occasional use.',
      pages: 'Up to 5 pages in life time',
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      href: '/signup',
    },
    {
      name: 'Pro',
      price: { monthly: 15, yearly: 11 },
      description: 'For professionals and frequent users.',
      pages: 'Up to 400 pages/month',
      buttonText: 'Upgrade Now',
      buttonVariant: 'default',
      popular: true,
      href: '/signup',
    },
    {
      name: 'Pro Max',
      price: { monthly: 30, yearly: 21 },
      description: 'For power users and businesses.',
      pages: 'Up to 1000 pages/month',
      buttonText: 'Go Pro Max',
      buttonVariant: 'secondary',
      href: '/signup',
    },
    {
      name: 'Business',
      price: { monthly: 50, yearly: 35 },
      description: 'For large teams and enterprises.',
      pages: 'Up to 4000 pages/month',
      buttonText: 'Go Business',
      buttonVariant: 'secondary',
      href: '/signup',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale, custom deployments.',
      pages: 'Contact us for a custom quote.',
      buttonText: 'Contact Us',
      buttonVariant: 'outline',
      href: '#',
    },
  ];

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
              <div className="flex items-center gap-4 pt-8">
                <Label htmlFor="billing-cycle" className="font-medium">
                  Monthly
                </Label>
                <Switch
                  id="billing-cycle"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <Label htmlFor="billing-cycle" className="font-medium">
                  Yearly
                </Label>
                <Badge variant="secondary" className='bg-green-100 text-green-700 border-green-200'>Save 30%</Badge>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container grid items-start justify-center gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`h-full shadow-lg ${
                  plan.popular ? 'border-2 border-primary' : ''
                } relative`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">
                    {typeof plan.price === 'object' ? (
                      isYearly ? (
                        `$${plan.price.yearly}`
                      ) : (
                        `$${plan.price.monthly}`
                      )
                    ) : (
                      plan.price
                    )}
                    {typeof plan.price === 'object' && <span className="text-xl font-normal text-muted-foreground">/mo</span>}
                  </div>
                   {typeof plan.price === 'object' && isYearly && (
                    <p className="text-sm text-muted-foreground -mt-2">
                      Billed as ${plan.price.yearly * 12} per year
                    </p>
                  )}
                  <p className="text-muted-foreground">{plan.pages}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.buttonVariant as any}
                    className="w-full"
                    asChild
                  >
                    <Link href={plan.href}>{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
