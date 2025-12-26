import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Not Found</h2>
            <p className="text-muted-foreground mb-8">Could not find requested resource</p>
            <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Return Home
            </Link>
        </div>
    )
}
