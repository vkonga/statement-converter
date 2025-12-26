import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactSupportPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Contact Support
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <Card className="w-full overflow-hidden">
                        <CardContent className="p-0">
                            {/* 
                                TODO: USER ACTION REQUIRED
                                1. Create your Google Form
                                2. Click "Send" > "< >" (Embed HTML)
                                3. Copy the 'src' URL from the iframe code
                                4. Paste it into the src attribute below
                                5. Adjust height if necessary
                            */}
                            <div className="w-full flex justify-center bg-muted/20 min-h-[600px] items-center text-muted-foreground">
                                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScg10QVtAmTgK6p6Ez7VCgWH_TFj-ImtZh3sWwcVfJhJxtwzw/viewform?embedded=true" width="640" height="1721" frameBorder="0" marginHeight={0} marginWidth={0}>Loading…</iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
