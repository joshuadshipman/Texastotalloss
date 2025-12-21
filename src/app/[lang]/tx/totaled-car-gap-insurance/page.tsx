import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';

export const metadata = {
    title: 'Texas Totaled Car & Gap Insurance Help | Free Offer & Injury Check',
    description: 'Find out if your Texas total loss offer is low, whether you have gap coverage, and what your injuries may really be worth.',
};

export default function TexasPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <header className="bg-red-900 text-white py-16 px-4 text-center" style={{ backgroundImage: 'linear-gradient(to right, #7f1d1d, #991b1b)' }}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Texas Totaled Car, Gap Insurance, and Injury Check.
                    </h1>
                    <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
                        Helping Texas drivers in Dallas, Houston, Austin, and San Antonio verify their total loss offers.
                    </p>
                    <div className="pt-4">
                        <button className="bg-white text-red-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition">
                            Start Free Texas Check
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto space-y-12">

                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-red-900">How Total Loss Value Is Calculated in Texas</h2>
                        <p className="text-gray-700 text-lg">
                            In Texas, insurers must pay the "Actual Cash Value" (ACV) of your vehicle.
                            The Texas Department of Insurance regulates these practices, but lowball offers are common.
                            We help you check if your offer considers local market data.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-red-900">What Is Gap Coverage on a Texas Car Loan?</h2>
                        <p className="text-gray-700 text-lg">
                            Gap waivers are often sold by Texas dealerships. If you are upside down on your loan, this coverage is essential.
                            We can help you identify if you have valid gap coverage active on your loan.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-red-900">Upside Down and Your Car Was Totaled in Texas – What Now?</h2>
                        <p className="text-gray-700 text-lg">
                            If your insurance check doesn't cover the loan, you are responsible for the balance—unless you have Gap or can prove the vehicle was undervalued.
                            Don't accept the first offer without a review.
                        </p>
                    </div>

                </div>
            </section>

            <section className="py-16 px-4 bg-gray-100 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Free Total Loss, Gap, and Injury Check for Texas Drivers</h2>
                    <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition text-xl">
                        Start My Free Check
                    </button>
                </div>
            </section>

            <ChatWidget />
        </main>
    );
}
