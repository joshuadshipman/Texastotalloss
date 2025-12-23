
import Link from 'next/link';

export default function SitemapPage() {
    return (
        <main className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Site Map</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-900">Main Pages</h2>
                    <ul className="space-y-2">
                        <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
                        <li><Link href="/chat" className="text-blue-600 hover:underline">Chat Support</Link></li>
                        <li><Link href="/tools/demand-letter" className="text-blue-600 hover:underline">Demand Letter Generator</Link></li>
                        <li><Link href="/review" className="text-blue-600 hover:underline">AI Case Review</Link></li>
                        <li><Link href="/disclosure" className="text-blue-600 hover:underline">Disclosure</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-900">Admin</h2>
                    <ul className="space-y-2">
                        <li><Link href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link></li>
                        <li><Link href="/admin/chat" className="text-blue-600 hover:underline">Admin Chat Console</Link></li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
