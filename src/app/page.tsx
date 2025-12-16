'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { useChat } from '@/components/ChatContext';

export default function Home() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Hero Section */}
            <header className="bg-blue-900 text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Totaled Car, Upside-Down Loan, and Injuries? Check Your Payout in Minutes.
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Find out if your total loss offer is low, whether gap coverage applies, and what your injuries may really be worth.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button
                            onClick={openChat}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
                        >
                            Check My Total Loss & Injuries
                        </button>
                        <a href="tel:1-800-555-0199" className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition">
                            Call Now
                        </a>
                    </div>
                </div>
            </header>

            {/* Section 1: Total Loss Value */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-blue-900">Is Your Total Loss Offer Too Low?</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                        Insurance companies often undervalue totaled vehicles by using "comparables" that aren't really comparable.
                        Understanding the Actual Cash Value (ACV) vs. what they offer is critical.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-gray-700">
                        <li>See what similar vehicles sell for in your area.</li>
                        <li>Spot missing options and upgrades in your valuation.</li>
                        <li>Understand how insurers calculate total loss.</li>
                    </ul>
                </div>
            </section>

            {/* Section 2: Gap Coverage */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-blue-900">Gap Coverage and Being "Upside Down" on Your Car Loan.</h2>
                    <div className="space-y-4 text-gray-700 text-lg">
                        <p>
                            If your loan balance is higher than the car's value, you are "upside down" or have negative equity.
                            <strong>Gap insurance</strong> (Guaranteed Asset Protection) is designed to cover this difference.
                        </p>
                        <p>
                            Without gap coverage, you could be left paying thousands for a car you no longer drive.
                            Our check helps determine if you might have gap coverage hidden in your contract or if your lender required it.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Injuries */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-blue-900">Totaled Car + Injuries: Are You Leaving Money on the Table?</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                        If you were injured, your settlement should cover medical bills, pain and suffering, lost wages, and future care.
                        Handling a total loss claim while injured is overwhelming—and insurers know it.
                    </p>
                    <p className="text-gray-700 text-lg">
                        A combined review of your vehicle value and injury claim ensures you don't settle for less than you deserve on either front.
                    </p>
                </div>
            </section>

            {/* CTA Block */}
            <section className="py-16 px-4 bg-blue-900 text-white text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Free Total Loss, Gap Coverage, and Injury Check</h2>
                    <button
                        onClick={openChat}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition text-xl"
                    >
                        Start My Free Check
                    </button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What is gap insurance and what does it cover?</h3>
                            <p className="text-gray-600">Gap insurance covers the difference between your vehicle's actual cash value (what insurance pays) and the amount you owe on your loan, preventing you from paying out of pocket for a totaled car.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Do I have gap coverage on my totaled car?</h3>
                            <p className="text-gray-600">You may have purchased it at the dealership, through your lender, or as an add-on to your auto insurance policy. Check your sales contract and insurance declarations page.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">How do injuries affect my car accident settlement?</h3>
                            <p className="text-gray-600">Injuries significantly increase the potential value of a claim. You are entitled to compensation for medical costs, pain/suffering, and lost income, which are separate from your vehicle's value.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
                <p>© {new Date().getFullYear()} Total Loss Intake Platform. All rights reserved.</p>
                <p className="mt-2">Disclaimer: This tool provides informational estimates only and is not legal advice or a formal appraisal.</p>
            </footer>

            <ChatWidget />
        </main>
    );
}
