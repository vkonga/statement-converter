import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, FileX, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            We take your financial privacy seriously. Extremely seriously.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <FileX className="h-8 w-8 text-primary" />
                                <CardTitle>Zero File Retention</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    We do not store your bank statement files. Period. Key points:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                                    <li>Files are processed in memory and discarded immediately.</li>
                                    <li>We do not save your PDFs to any disk or cloud storage.</li>
                                    <li>Converted Excel files are generated directly to your browser.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Lock className="h-8 w-8 text-primary" />
                                <CardTitle>End-to-End Encryption</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Your data is encrypted at every stage of the brief processing lifecycle.
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                                    <li>Uploads are protected via TLS/SSL (HTTPS).</li>
                                    <li>Data in transit effectively does not exist at rest on our servers.</li>
                                    <li>We use industry-standard security protocols.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold">1. Data Collection & Usage</h2>
                            <p className="text-muted-foreground">
                                We only collect the absolute minimum data required to provide our service:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>
                                    <strong>Account Info:</strong> We store your email and a unique ID (via Firebase Auth) solely to manage your credit balance and login access.
                                </li>
                                <li>
                                    <strong>Transaction Metadata:</strong> We store a record of <em>when</em> a conversion happened (timestamp) and the <em>filename</em> for your history log. We <strong>do not</strong> store the contents of the file or the transactions within it.
                                </li>
                                <li>
                                    <strong>Payment Data:</strong> Payment processing is handled entirely by PayPal. We do not see, touch, or store your credit card numbers.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">2. Third-Party Processing</h2>
                            <p className="text-muted-foreground">
                                We use trusted third-party providers for specific infrastructure needs. They are bound by strict data processing agreements:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>
                                    <strong>Google Cloud / Firebase:</strong> Used for authentication and hosting.
                                </li>
                                <li>
                                    <strong>Google Gemini AI:</strong> Used for intelligently extracting text from your PDF. The data sent to the AI model is transient and is not used to train their public models (Enterprise data privacy standards apply).
                                </li>
                                <li>
                                    <strong>PayPal:</strong> Used for secure payment processing.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">3. Your Rights</h2>
                            <p className="text-muted-foreground">
                                You own your data. At any time, you can:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Request deletion of your account and all associated metadata.</li>
                                <li>Export your data (which is just your file history log).</li>
                            </ul>
                            <p className="mt-4 text-muted-foreground">
                                Contact us at privacy@statementconverter.com for any requests.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">4. International Compliance</h2>
                            <p className="text-muted-foreground">
                                We operate globally and respect the highest standards of data privacy laws worldwide:
                            </p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <h3 className="font-semibold">GDPR (Europe) & UK GDPR</h3>
                                    <p className="text-sm text-muted-foreground">
                                        If you are located in the EEA or UK, you have specific rights including the right to access, rectification, erasure, restriction of processing, and data portability. We act as a Data Controller for your account info and a Data Processor for your files.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">CCPA/CPRA (California)</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We do not sell your personal information. You have the right to know what data we collect, request deletion, and opt-out of data sharing (though we do not share data).
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">International Data Transfers</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Our services are hosted in the United States. By using our service, you acknowledge that your data may be processed in the US. We utilize standard contractual clauses and rely on the security measures of our infrastructure provider (Google Cloud) to protect international transfers.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">5. Cookie Policy</h2>
                            <p className="text-muted-foreground">
                                We use cookies solely for essential site functions:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Authentication:</strong> Keeping you logged in securely.</li>
                                <li><strong>Security:</strong> Preventing CSRF attacks and abuse.</li>
                            </ul>
                            <p className="mt-2 text-sm text-muted-foreground">
                                We do not use third-party advertising cookies. By using our site, you consent to these essential cookies.
                            </p>
                        </section>

                        <section>
                            <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
                                <h3 className="text-lg font-bold text-destructive mb-2">Our Strict Promise</h3>
                                <p className="font-medium">
                                    We will never sell, rent, or trade your personal data or financial information to advertisers, data brokers, or any third parties. Your financial life is yours alone.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
