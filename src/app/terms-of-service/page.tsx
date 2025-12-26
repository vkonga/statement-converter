import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function TermsOfServicePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Terms of Service
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            By using StatementConverter, you agree to these terms.
                        </p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold">1. Service Description</h2>
                            <p className="text-muted-foreground">
                                StatementConverter uses AI to extract data from bank statement PDFs and convert them into Excel format. We strive for high accuracy but do not guarantee 100% error-free conversions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">2. User Responsibilities</h2>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>You typically own or have the right to process the documents you upload.</li>
                                <li>You agree not to upload illegal, malicious, or harmful content.</li>
                                <li>You are responsible for verifying the accuracy of the converted data before using it for tax or accounting purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">3. No Financial Advice</h2>
                            <p className="text-muted-foreground">
                                This tool is a data utility. We are not financial advisors, accountants, or tax professionals. The output of this tool should be verified by a professional.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                To the maximum extent permitted by law, StatementConverter shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">5. Refunds</h2>
                            <p className="text-muted-foreground">
                                Due to the digital nature of the product, credits are non-refundable once purchased, unless required by law. If the service completely fails to process a valid file, please contact support for a credit refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">6. Changes to Terms</h2>
                            <p className="text-muted-foreground">
                                We may modify these terms at any time. Continued use of the service constitutes agreement to the updated terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">7. Age Restriction</h2>
                            <p className="text-muted-foreground">
                                You must be at least 18 years old to use this service. By using StatementConverter, you warrant that you meet this age requirement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold">8. Governing Law</h2>
                            <p className="text-muted-foreground">
                                These terms shall be governed by the laws of the jurisdiction in which the Company is established, without regard to its conflict of law provisions.
                            </p>
                        </section>


                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
