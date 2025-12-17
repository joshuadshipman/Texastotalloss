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

            {/* Section 4: 10 Key Facts */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">10 Critical Facts About Total Loss</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">1. ACV is the foundation.</h3>
                            <p className="text-gray-600 text-sm">Total loss offers are anchored to Actual Cash Value (market value), not your loan balance or purchase price.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">2. State law sets the threshold.</h3>
                            <p className="text-gray-600 text-sm">States dictate when a car must be totaled (e.g., when repairs hit 70-80% of value).</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">3. Vendors drive the offers.</h3>
                            <p className="text-gray-600 text-sm">Insurers use third-party reports (CCC, Mitchell) that can contain errors or weak comparables.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">4. "Comps" aren't always comparable.</h3>
                            <p className="text-gray-600 text-sm">Valuations often use cars with higher mileage, different trims, or from cheaper markets.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">5. Details matter.</h3>
                            <p className="text-gray-600 text-sm">Documenting options, lower mileage, and recent maintenance can justify higher values.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">6. You can challenge the offer.</h3>
                            <p className="text-gray-600 text-sm">You have the right to request the valuation report, correct errors, and submit your own comps.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">7. Repair estimates count.</h3>
                            <p className="text-gray-600 text-sm">Adjusters compare repair costs + salvage value against ACV to decide the car's fate.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">8. Loans are separate logic.</h3>
                            <p className="text-gray-600 text-sm">The insurer pays the car's value. If you owe more, that's a "gap" issue, not an insurance failure.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">9. Negative equity is common.</h3>
                            <p className="text-gray-600 text-sm">Long loans and small down payments often leave you "upside down" when a crash happens.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">10. Knowledge pays off.</h3>
                            <p className="text-gray-600 text-sm">Reviewing your report and challenging bad data can add real dollars to your settlement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What does it mean when my car is a "total loss"?</h3>
                            <p className="text-gray-600">A car is a total loss when repair costs reach a set percentage of its Actual Cash Value (ACV) or exceed its value minus salvage.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">How do insurance companies calculate my car's value?</h3>
                            <p className="text-gray-600">Insurers start with replacement cost, then subtract depreciation based on age, mileage, condition, and market data. They look at local comparable sales, physical condition, and options to determine the final ACV.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What is Actual Cash Value (ACV)?</h3>
                            <p className="text-gray-600">ACV is your vehicle's market worth right before the loss, not what you paid or own. It accounts for depreciation and is the number insurers use to determine your payout.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Why does my total loss payout seem so low?</h3>
                            <p className="text-gray-600">Valuations may use poor "comparables" (older, high mileage) or miss your specific options and condition.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Can I negotiate a total loss offer?</h3>
                            <p className="text-gray-600">Yes. You can challenge valuations with better comparable sales, proof of upgrades, and maintenance records.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What is gap insurance?</h3>
                            <p className="text-gray-600">Gap insurance covers the difference between your ACV payout and your remaining loan balance.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What does it mean to be "upside down"?</h3>
                            <p className="text-gray-600">It means you owe more on your loan than the car is currently worth (negative equity).</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Will gap insurance pay me extra money?</h3>
                            <p className="text-gray-600">No, it pays the lender to zero out your debt. You don't pocket the difference.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Do I pay my loan if I don't have gap?</h3>
                            <p className="text-gray-600">Yes. You are responsible for any loan balance remaining after the insurance payout.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">How can I tell if I have gap coverage?</h3>
                            <p className="text-gray-600">Check your sales contract, lease agreement, or auto policy declarations page.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Does gap cover deductibles?</h3>
                            <p className="text-gray-600">Often no. Many gap policies exclude deductibles, late fees, and carry-over balances.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Can a car be totaled if it still drives?</h3>
                            <p className="text-gray-600">Yes. If repair costs hit the threshold (financial total loss), it's totaled regardless of drivability.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What is a total loss threshold?</h3>
                            <p className="text-gray-600">A legal or policy limit (e.g., 75% of value) where a car must be declared a total loss.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What happens to my car after it's totaled?</h3>
                            <p className="text-gray-600">The insurer takes the title and sells it for salvage. You get the check (minus deductible).</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">How do injuries factor in?</h3>
                            <p className="text-gray-600">Injury claims (medical, pain & suffering) are separate from the property damage payout but part of the same event.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Can insurers use one vendor?</h3>
                            <p className="text-gray-600">Yes, they rely on vendors like CCC. But you can dispute the accuracy of that vendor's report.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What evidence helps get a higher offer?</h3>
                            <p className="text-gray-600">Window stickers, receipts for recent work (tires, timing belt), and ads for similar local cars.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What if I still owe money?</h3>
                            <p className="text-gray-600">You must pay the difference to the lender, or roll it into a new loan (risky).</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Should I accept the first offer?</h3>
                            <p className="text-gray-600">Almost never immediately. Review the report for errors first. It's often negotiable.</p>
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
