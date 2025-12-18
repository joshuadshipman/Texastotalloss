'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { useChat } from '@/components/ChatContext';
import dynamic from 'next/dynamic';
// Optimize loading by dynamically importing heavy/interactive components
const ValuationCalculator = dynamic(() => import('@/components/ValuationCalculator'), { ssr: false });
const FlipCard = dynamic(() => import('@/components/FlipCard')); // If still used, or remove if unused
const MobileScrollContainer = dynamic(() => import('@/components/ui/MobileScrollContainer'));
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const SectionCard = dynamic(() => import('@/components/SectionCard'));
const LightboxImage = dynamic(() => import('@/components/ui/LightboxImage'));

import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, MapPinIcon, GavelIcon, CarIcon, DollarSignIcon } from 'lucide-react';


export default function Home() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-20 md:pb-0"> {/* Added pb-20 for mobile nav */}
            {/* Hero Section */}
            {/* Hero Section - Mobile First */}
            <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/worried_customer.png" alt="Worried driver after accident" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-900/50"></div>
                </div>
                <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                    <div className="inline-block bg-blue-700/50 backdrop-blur-sm border border-blue-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        Free Texas Auto Claim Help
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                        <span className="block text-white mb-2">Possible Total Loss?</span>
                        <span className="block text-blue-300">Worried about the ACV?</span>
                    </h1>
                    <div className="text-lg md:text-xl font-medium text-blue-100 space-y-4 max-w-3xl mx-auto bg-blue-800/50 p-6 rounded-xl border border-blue-400/30">
                        <p className="text-2xl md:text-3xl font-extrabold text-amber-300 italic leading-snug drop-shadow-sm">
                            "Concerned about possible injuries or even just getting the kids to school?"
                        </p>
                        <p className="font-bold text-white text-lg">
                            Don't Worry, <span className="text-yellow-400">Angel</span> is here to help with all your Total Loss concerns.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 pt-6 max-w-4xl mx-auto w-full">
                        <a href="tel:1-800-555-0199" className="flex-1 h-16 bg-white text-blue-900 hover:bg-gray-100 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2">
                            <span>📞 Call Now</span>
                        </a>
                        <button
                            onClick={() => openChat()}
                            className="flex-1 h-16 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2"
                        >
                            <span>💬 Live Chat</span>
                        </button>
                        <button
                            onClick={() => openChat('callback')}
                            className="flex-1 h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2"
                        >
                            <span>📅 Callback Request</span>
                        </button>
                        <button
                            onClick={() => openChat()}
                            className="flex-1 h-16 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2"
                        >
                            <span>⏱ Schedule a Free 15 Min Consult</span>
                        </button>
                    </div>
                    <p className="text-xs text-blue-300 mt-4">No lawyers. No fees. Just answers.</p>
                </div>
            </header>

            {/* NEW: Total Loss Definition */}
            <section className="py-8 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">How do I know if it's a Total Loss?</h2>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-left md:text-center">
                        <p className="text-lg text-gray-800 mb-2">
                            In Texas, your car is a total loss if:
                        </p>
                        <p className="font-bold text-xl text-red-600 mb-2">Repairs + Salvage Value ≥ Current Value (ACV)</p>
                        <p className="text-gray-600 text-sm">
                            Unlike some states with a simple % threshold, Texas uses this formula. If the numbers don't add up, the insurer takes the car.
                        </p>
                    </div>
                </div>
            </section>



            {/* NEW: 3-Card Feature Row (Replaces separate sections) */}
            <section id="features" className="py-12 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <MobileScrollContainer>
                        {/* Card 1: Total Loss Offer */}
                        <div className="w-[85vw] md:w-auto md:flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[300px]">
                            <h3 className="text-xl font-bold mb-4 text-blue-900">Is Your Total Loss Offer Too Low?</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                Insurance companies often undervalue totaled vehicles by using "comparables" that aren't really comparable.
                                Understanding the Actual Cash Value (ACV) vs. what they offer is critical.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6">
                                <li>• See what similar vehicles sell for</li>
                                <li>• Spot missing options/upgrades</li>
                                <li>• Understand the calculation</li>
                            </ul>
                            <button onClick={() => openChat()} className="text-blue-600 font-bold text-sm hover:underline mt-auto">Check My Offer &rarr;</button>
                        </div>

                        {/* Card 2: Gap Coverage */}
                        <div className="w-[85vw] md:w-auto md:flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[300px]">
                            <h3 className="text-xl font-bold mb-4 text-blue-900">Gap Coverage & "Upside Down" Loans</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                If your loan balance is higher than the car's value, you are "upside down".
                                <strong>Gap insurance</strong> pays the difference. Without it, you still owe the bank.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6">
                                <li>• Covers the "Gap" in value</li>
                                <li>• Hidden in many finance contracts</li>
                                <li>• Specific exclusions apply</li>
                            </ul>
                            <button onClick={() => openChat()} className="text-blue-600 font-bold text-sm hover:underline mt-auto">Scan for Gap &rarr;</button>
                        </div>

                        {/* Card 3: Injuries */}
                        <div className="w-[85vw] md:w-auto md:flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[300px]">
                            <h3 className="text-xl font-bold mb-4 text-blue-900">Totaled Car + Injuries?</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                If you were injured, your settlement should cover medical bills, pain and suffering, and lost wages.
                                Don't let them rush you into a cheap settlement.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2 mb-6">
                                <li>• Separate form property claim</li>
                                <li>• Don't sign a general release</li>
                                <li>• Seek medical care immediately</li>
                            </ul>
                            <button onClick={() => openChat()} className="text-blue-600 font-bold text-sm hover:underline mt-auto">Injury Review &rarr;</button>
                        </div>
                    </MobileScrollContainer>
                </div>
            </section>

            {/* NEW: Interactive Valuation Calculator (Replaces old CTA) */}
            <div id="calculator">
                <ValuationCalculator />
            </div>

            {/* NEW: Resource Cards Grid (Consolidated Sections) */}
            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Critical Resources</h2>
                    <div className="flex flex-col gap-4">

                        {/* 0. 2025 Market Reality Card */}
                        <SectionCard
                            title="2025 Market Reality Check"
                            subtitle="Why Total Loss Values are Dropping"
                            icon={<AlertTriangleIcon size={24} />}
                            colorClass="bg-orange-700"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-orange-700 mb-2">2025 MARKET REALITY</h2>
                                <p className="text-lg text-gray-600">Why you need to protect your value now more than ever.</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">27%</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Total Loss Rate</h3>
                                    <p className="text-gray-600 text-sm">Up from 16% in 2022. More drivers than ever are being pushed into total loss valuations.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">42%</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Unsatisfied</h3>
                                    <p className="text-gray-600 text-sm">Only 58% of customers say their total loss valuation met expectations in 2025.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">⚠</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Class Actions</h3>
                                    <p className="text-gray-600 text-sm">Major insurers face suits for algorithms that apply fake "negotiation discounts".</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">$1k+</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Deductibles</h3>
                                    <p className="text-gray-600 text-sm">26% of drivers now have deductibles of $1k+, increasing the financial hit.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">Gap</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Loan Balances</h3>
                                    <p className="text-gray-600 text-sm">Many drivers are left paying for cars they can't drive due to ACV shortfall.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                                    <div className="text-4xl font-black text-red-600 mb-2">📉</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Downgrades</h3>
                                    <p className="text-gray-600 text-sm">Vendors use "phantom" comps and unfair condition adjustments to lower values.</p>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 1. Texas UM Law Card */}
                        <SectionCard
                            title="Texas UM/UIM Law Explained"
                            subtitle="Implied Coverage Rule & Rejection Forms"
                            icon={<GavelIcon size={24} />}
                            colorClass="bg-blue-800"
                        >
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Texas Law: You Have UM/UIM Coverage Unless You Rejected It In Writing.</h2>

                                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100 mb-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">The "Implied Coverage" Rule</h3>
                                            <p className="text-gray-700 mb-4">
                                                Under Texas Insurance Code, Uninsured/Underinsured Motorist (UM/UIM) coverage is <strong>automatically included</strong> in every auto policy by default.
                                            </p>
                                            <p className="text-gray-700 font-medium">
                                                The ONLY way it is removed is if a "Named Insured" signs a specific rejection form in writing.
                                            </p>
                                        </div>
                                        <div className="flex-1 bg-blue-50 p-6 rounded-lg text-sm text-blue-900">
                                            <h4 className="font-bold border-b border-blue-200 pb-2 mb-2">Who Can Reject It?</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li><strong>Named Insured:</strong> The primary person listed on the declarations page.</li>
                                                <li><strong>Resident Spouse:</strong> A spouse living in the same household (who is defined as an insured) can also sign a binding rejection.</li>
                                                <li><strong>NOT Valid:</strong> A random household driver or child generally cannot reject coverage for the policyholder.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 text-center">
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                        <div className="text-4xl mb-4">✅</div>
                                        <h3 className="text-xl font-bold text-green-800 mb-2">Scenario A: No Written Rejection</h3>
                                        <p className="text-green-900">If the insurer cannot produce a valid, signed rejection form, <strong>coverage exists by law</strong> up to your liability limits.</p>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                        <div className="text-4xl mb-4">❌</div>
                                        <h3 className="text-xl font-bold text-red-800 mb-2">Scenario B: Signed Rejection</h3>
                                        <p className="text-red-900">If you or your spouse signed the specific state-approved form, coverage is removed or limited to what you selected.</p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 2. Accident Checklist Card */}
                        <SectionCard
                            title="Just in an Accident?"
                            subtitle="10-Step Immediate Action Plan"
                            icon={<CarIcon size={24} />}
                            colorClass="bg-red-600"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-red-600 mb-2 uppercase">🚨 Post-Accident Checklist</h2>
                                <p>Interactive Guide</p>
                            </div>

                            <div className="max-w-3xl mx-auto space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                                    <div className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Stop & Check for Injuries</h4>
                                        <p className="text-sm text-gray-600">Turn on hazards. Call 911 if <em>anyone</em> is hurt. Move to shoulder if drivable.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                                    <div className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Call Police</h4>
                                        <p className="text-sm text-gray-600">Even for minor bumps. You need an official report for insurance.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                                    <div className="bg-red-100 text-red-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Shut Up & Listen</h4>
                                        <p className="text-sm text-gray-600"><strong>DO NOT</strong> say "I'm sorry" or "I'm fine." Ask: "Are you okay?" and exchange info only.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                                    <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">4</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Photo Evidence (The "CSI" Step)</h4>
                                        <p className="text-sm text-gray-600">Wide shots of scene, close-up of damage, license plates, insurance cards, and witness phone numbers.</p>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <a href="/checklist" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105">
                                        <span>🖨️ View & Print Full Checklist</span>
                                    </a>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 3. Storage Fees Card */}
                        <SectionCard
                            title="STOP Storage Fees"
                            subtitle="Avoid daily charges of $100+"
                            icon={<DollarSignIcon size={24} />}
                            colorClass="bg-red-800"
                        >
                            <div className="py-8 bg-red-50 rounded-xl p-4">
                                <div className="flex flex-col items-center text-center mb-12">
                                    <div className="bg-yellow-400 text-red-900 font-black px-6 py-2 rounded-full uppercase tracking-widest text-sm mb-4 animate-pulse">
                                        Immediate Financial Risk
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-red-900">STOP THE BLEEDING</h2>
                                    <p className="text-xl max-w-3xl text-red-800">
                                        Tow yards charge <strong>$20–$100+ per day</strong>. If you ignore this, you could lose thousands.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                    {/* 1. The Cost Trap */}
                                    <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm">
                                        <h3 className="text-xl font-bold mb-3 text-red-700">1. The Daily Cost Trap</h3>
                                        <p className="mb-2 text-gray-700">Fees start the minute your car arrives. If it sits for weeks, the bill can hit <strong>$3,000+</strong>.</p>
                                        <div className="my-4">
                                            <LightboxImage src="/images/infographics/compounding_fees.png" alt="Compounding Storage Fees Chart" />
                                        </div>
                                        <p className="text-sm text-red-600 italic">Insurers can refuse to pay for "avoidable" storage days.</p>
                                    </div>

                                    {/* 2. Duty to Mitigate */}
                                    <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm">
                                        <h3 className="text-xl font-bold mb-3 text-red-700">2. Your "Duty to Mitigate"</h3>
                                        <p className="mb-2 text-gray-700">You have a <strong>legal obligation</strong> to minimize costs. Leaving a car in a fee-charging lot violates this duty.</p>
                                        <div className="my-4">
                                            <LightboxImage src="/images/infographics/duty_to_mitigate.png" alt="Duty to Mitigate Illustration" />
                                        </div>
                                        <p className="text-sm text-red-600 italic">If you settle later, they will deduct these "unnecessary" fees from your check.</p>
                                    </div>

                                    {/* 3. Risk of Losing Vehicle */}
                                    <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm">
                                        <h3 className="text-xl font-bold mb-3 text-red-700">3. Risk of Losing the Car</h3>
                                        <p className="mb-2 text-gray-700">In many states, if fees aren't paid, the tow yard can place a <strong>lien</strong> and sell your car at auction.</p>
                                        <div className="my-4">
                                            <LightboxImage src="/images/infographics/lien_timeline.png" alt="Lien Auction Timeline" />
                                        </div>
                                        <p className="text-sm text-red-600 italic">You lose the asset AND still owe the storage debt.</p>
                                    </div>

                                    {/* 4. Action Plan */}
                                    <div className="bg-red-900 text-white p-8 rounded-xl shadow-lg border-4 border-yellow-400 md:col-span-2">
                                        <h3 className="text-xl font-black mb-3 uppercase">ACTION: Notify & Move</h3>
                                        <ul className="list-disc ml-5 space-y-2 font-bold">
                                            <li>Tell the insurer WHERE the car is immediately.</li>
                                            <li>Give permission to move it to a <strong>fee-free</strong> lot.</li>
                                            <li>Get the move confirmation in writing.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 4. Duty to Mitigate Card */}
                        <SectionCard
                            title="Duty to Mitigate"
                            subtitle="Medical & Property Obligations"
                            icon={<ShieldCheckIcon size={24} />}
                            colorClass="bg-emerald-700"
                        >
                            <div className="container mx-auto px-4 py-8">
                                <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Your Duty: <span className="text-red-600">Don't Make It Worse</span></h2>

                                <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">

                                    {/* 1. Medical Actions */}
                                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-green-500">
                                        <h3 className="text-2xl font-bold mb-4 text-green-700">1. Medical Actions</h3>
                                        <p className="mb-4 text-gray-700">
                                            <strong>Seek Prompt Care:</strong> Go to the doctor within 24–72 hours. "Toughing it out" creates a gap in treatment that insurers use to deny claims.
                                        </p>
                                        <p className="mb-4 text-gray-700">
                                            <strong>Follow Orders:</strong> If a doctor prescribes therapy or rest, do it. Ignoring advice is "failure to mitigate."
                                        </p>
                                        <div className="mt-4">
                                            <LightboxImage src="/images/infographics/gap_in_care.png" alt="Gap in Care Timeline" />
                                        </div>
                                    </div>

                                    {/* 2. The Refusal Trap & 51% Rule */}
                                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-red-500 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl">CRITICAL</div>
                                        <h3 className="text-2xl font-bold mb-4 text-red-700">2. The "Refusal" Trap</h3>
                                        <p className="mb-4 text-gray-700">
                                            If you are found &gt;50% at fault for your own damages (e.g., by refusing care), you recover nothing.
                                        </p>
                                        <div className="mt-4">
                                            <LightboxImage src="/images/infographics/fault_bar_rule.png" alt="51% Fault Bar Rule" />
                                        </div>
                                    </div>

                                    {/* 3. Property Actions */}
                                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-blue-500 md:col-span-2">
                                        <h3 className="text-2xl font-bold mb-4 text-blue-700">3. Property Actions</h3>
                                        <p className="mb-4 text-gray-700">
                                            <strong>Prevent More Damage:</strong> Cover broken windows to stop rain. Secure loose parts. Move the car off the road.
                                        </p>
                                        <p className="mb-4 text-gray-700">
                                            <strong>Keep Receipts:</strong> You can be reimbursed for tarps, tape, and temporary fixes, but only if you have proof.
                                        </p>
                                        <div className="mt-4">
                                            <LightboxImage src="/images/infographics/property_mitigation.png" alt="Property Mitigation Checklist" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </SectionCard>

                    </div>
                </div>
            </section>

            {/* NEW: Determining Fault & Liability */}
            <section className="py-16 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-yellow-500">Determining Fault: Common Scenarios</h2>

                    <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                        Insurance adjusters look for specific patterns to assign blame. <br />
                        <span className="text-yellow-400 font-semibold">Hover or Tap below</span> to see how typical crash scenarios are judged.
                    </p>

                    <div className="md:hidden mb-4 text-xs text-center text-gray-500 font-medium">← Swipe Cards →</div>

                    <MobileScrollContainer>

                        {/* Rear End */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-red-700"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">💥🚗</div>
                                        <h3 className="text-xl font-bold">Rear-End Collision</h3>
                                        <p className="mt-2 text-white/80">"I got hit from behind."</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-red-400 mb-2">Almost Always Their Fault</h4>
                                        <p className="text-sm leading-relaxed">
                                            The following driver has a duty to maintain a safe distance. Unless you reversed suddenly or cut them off (with proof),
                                            the rear driver is liable for "Following Too Closely".
                                        </p>
                                    </>
                                }
                            />
                        </div>

                        {/* Left Turn */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-orange-700"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">↩️💥</div>
                                        <h3 className="text-xl font-bold">Left Turn Dispute</h3>
                                        <p className="mt-2 text-white/80">"They turned in front of me."</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-orange-400 mb-2">Left-Turner Usually Liable</h4>
                                        <p className="text-sm leading-relaxed">
                                            Drivers making a left turn must yield to oncoming traffic. Unless the other driver ran a red light (with witnesses/video),
                                            the turning car is at fault "Failure to Yield".
                                        </p>
                                    </>
                                }
                            />
                        </div>

                        {/* Sideswipe / Lane Change */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-blue-700"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">🛣️💥</div>
                                        <h3 className="text-xl font-bold">Lane Change / Merge</h3>
                                        <p className="mt-2 text-white/80">"He came into my lane!"</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-blue-400 mb-2">Merger is at Fault</h4>
                                        <p className="text-sm leading-relaxed">
                                            The driver maintaining their lane has the right of way. The merger must ensure it is safe.
                                            <br /><em className="text-xs text-gray-400 mt-1">Impact Location Matters: Side vs. Rear Corner.</em>
                                        </p>
                                    </>
                                }
                            />
                        </div>

                        {/* Reversing */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-purple-700"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">🔙💥</div>
                                        <h3 className="text-xl font-bold">Parking Lot / Reversing</h3>
                                        <p className="mt-2 text-white/80">"We both backed out."</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-purple-400 mb-2">Reverser is Liable</h4>
                                        <p className="text-sm leading-relaxed">
                                            A driver backing up has a higher duty of care. If both back up, it's often 50/50.
                                            If one is moving forward (in a lane) and one backs out, the reverser is at fault.
                                        </p>
                                    </>
                                }
                            />
                        </div>

                        {/* Red Light / Green Light */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-green-800"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">🚦🤷‍♂️</div>
                                        <h3 className="text-xl font-bold">Red Light Dispute</h3>
                                        <p className="mt-2 text-white/80">"He ran the red light!"</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-green-400 mb-2">Word vs. Word (Risk)</h4>
                                        <p className="text-sm leading-relaxed">
                                            Without a witness or cam footage, these are often denied as "conflicting statements".
                                            <strong>Key:</strong> Look for nearby cameras immediately.
                                        </p>
                                    </>
                                }
                            />
                        </div>

                        {/* Open Door */}
                        <div className="w-[85vw] md:w-auto h-64 shrink-0">
                            <FlipCard
                                colorClass="bg-teal-700"
                                frontContent={
                                    <>
                                        <div className="text-5xl mb-4">🚪💥</div>
                                        <h3 className="text-xl font-bold">"Dooring"</h3>
                                        <p className="mt-2 text-white/80">"I opened my door and..."</p>
                                    </>
                                }
                                backContent={
                                    <>
                                        <h4 className="text-lg font-bold text-teal-400 mb-2">Opener's Fault</h4>
                                        <p className="text-sm leading-relaxed">
                                            You cannot open a door into traffic unless it is safe to do so. The passing car almost always has
                                            the right of way in this scenario.
                                        </p>
                                    </>
                                }
                            />
                        </div>

                    </MobileScrollContainer>
                </div>
            </section>

            {/* NEW: Insurance & Compensation Guide        {/* NEW: Final CTA */}
            <section className="py-20 bg-blue-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-4xl font-bold text-center mb-8">Understanding Your Coverage</h2>

                    <div className="md:hidden mb-4 text-xs text-center text-blue-300 font-medium">← Swipe Cards →</div>

                    <MobileScrollContainer>
                        {/* 1. Total Loss & No Insurance */}
                        <div className="h-full bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col md:flex-row gap-6 items-center w-[85vw] md:w-auto">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 text-yellow-400">1. Total Loss & No Insurance</h3>
                                <p className="mb-2 text-sm md:text-base">
                                    When a car is totaled, the insurer owes you the <strong>Actual Cash Value (ACV)</strong> immediately before the crash,
                                    not what you owe on your loan.
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 h-40 shrink-0">
                                <LightboxImage src="/images/infographics/compounding_fees.png" alt="ACV Graph" caption="ACV is often less than your loan balance." />
                            </div>
                        </div>

                        {/* 2. Your Coverage Steps In */}
                        <div className="h-full bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col md:flex-row gap-6 items-center w-[85vw] md:w-auto">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 text-green-400">2. Coverage Flow</h3>
                                <ul className="list-disc ml-5 space-y-1 text-sm md:text-base opacity-90">
                                    <li><strong>UMPD (Uninsured Motorist Property Damage):</strong> Pays for repairs or total loss when the at-fault driver can't pay. Lower deductible than Collision.</li>
                                    <li><strong>Collision:</strong> Pays regardless of fault.</li>
                                    <li><strong>PIP/MedPay:</strong> Pays medical bills now.</li>
                                </ul>
                            </div>
                            <div className="w-full md:w-1/3 h-40 shrink-0">
                                <LightboxImage src="/images/infographics/duty_to_mitigate.png" alt="Coverage Flowchart" caption="How different policies stack to cover you." />
                            </div>
                        </div>

                        {/* 3. Handling Payouts */}
                        <div className="h-full bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col md:flex-row gap-6 items-center w-[85vw] md:w-auto">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 text-blue-300">3. The Payout Math</h3>
                                <p className="mb-2 text-sm md:text-base">
                                    The check is ACV minus your deductible. Gap insurance covers the rest <em>only if you have it</em>.
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 h-40 shrink-0">
                                <LightboxImage src="/images/infographics/fault_bar_rule.png" alt="Payout Math" caption="ACV - Deductible = Check Amount" />
                            </div>
                        </div>

                        {/* 4. Separate Buckets */}
                        <div className="h-full bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col md:flex-row gap-6 items-center w-[85vw] md:w-auto">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 text-purple-400">4. Separate Claims</h3>
                                <p className="mb-2 text-sm md:text-base">
                                    <strong>Property</strong> and <strong>Injury</strong> are separate. Settle the car now, keep injury open. Never sign a general release.
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 h-40 shrink-0">
                                <LightboxImage src="[Diagram: Two Checks]" alt="Two Checks Diagram" caption="You get two separate settlements." />
                            </div>
                        </div>
                    </MobileScrollContainer>

                    {/* 5 Steps Action List - Kept Vertical */}
                    <div className="mt-12 bg-white text-blue-900 p-6 rounded-2xl shadow-xl max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-6 text-center border-b-2 border-blue-100 pb-2">📝 5 Steps to Take Now</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <ol className="list-decimal ml-5 space-y-4 font-medium text-sm md:text-lg flex-1">
                                <li><strong>Confirm Limits:</strong> Get "no coverage" letters in writing.</li>
                                <li><strong>Check Policy:</strong> Look for UMPD/Collision on your Dec Page.</li>
                                <li><strong>Document:</strong> Gather valuation and loan payoff docs.</li>
                                <li><strong>Mitigate:</strong> Move the car to a free lot immediately.</li>
                                <li><strong>Consult:</strong> If denied, get legal eyes on the policy.</li>
                            </ol>
                            <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0">
                                <LightboxImage src="[Checklist: 5 Steps]" alt="Action Checklist" className="h-full bg-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Determining Fault & Liability */}
            <section className="py-20 bg-slate-900 text-white border-b-8 border-slate-700">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-yellow-500">Determining Fault: Common Scenarios</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                        {/* 1. Rear End */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 hover:border-yellow-400 transition">
                            <h3 className="text-xl font-bold mb-2 text-white">1. Rear-End Collision</h3>
                            <p className="text-slate-300 text-sm mb-4"><strong>Pattern:</strong> Front of Vehicle A hits Rear of Vehicle B.</p>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-yellow-400 font-bold text-xs uppercase">Fault Tendency</span>
                                <p className="text-slate-200 text-sm mt-1">Following driver is almost always at fault (following too close, speeding), unless lead driver reversed or cut in.</p>
                            </div>
                        </div>

                        {/* 2. Left Turn / T-Bone */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 hover:border-yellow-400 transition">
                            <h3 className="text-xl font-bold mb-2 text-white">2. Left Turn / T-Bone</h3>
                            <p className="text-slate-300 text-sm mb-4"><strong>Pattern:</strong> Turning vehicle struck by vehicle going straight.</p>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-yellow-400 font-bold text-xs uppercase">Fault Tendency</span>
                                <p className="text-slate-200 text-sm mt-1">Turner usually failed to yield. Fault shifts only if through-driver ran a red light or sped excessively.</p>
                            </div>
                        </div>

                        {/* 3. Sideswipe */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 hover:border-yellow-400 transition">
                            <h3 className="text-xl font-bold mb-2 text-white">3. Sideswipe</h3>
                            <p className="text-slate-300 text-sm mb-4"><strong>Pattern:</strong> Side-to-side contact while changing lanes.</p>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-yellow-400 font-bold text-xs uppercase">Fault Tendency</span>
                                <p className="text-slate-200 text-sm mt-1">The driver who left their lane (merging, drifting) is primarily at fault.</p>
                            </div>
                        </div>

                        {/* 4. Head-On / Center Line */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 hover:border-yellow-400 transition">
                            <h3 className="text-xl font-bold mb-2 text-white">4. Head-On</h3>
                            <p className="text-slate-300 text-sm mb-4"><strong>Pattern:</strong> Crossing center line into oncoming traffic.</p>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-yellow-400 font-bold text-xs uppercase">Fault Tendency</span>
                                <p className="text-slate-200 text-sm mt-1">Driver who crossed the line is at fault (distraction, sleep, impairment).</p>
                            </div>
                        </div>

                        {/* 5. Backing Up */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 hover:border-yellow-400 transition">
                            <h3 className="text-xl font-bold mb-2 text-white">5. Backing / Parking</h3>
                            <p className="text-slate-300 text-sm mb-4"><strong>Pattern:</strong> Reversing out of a spot.</p>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-yellow-400 font-bold text-xs uppercase">Fault Tendency</span>
                                <p className="text-slate-200 text-sm mt-1">Backing driver has duty to yield. If both back up, fault may be 50/50.</p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Analysis & Questions */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-slate-800 p-8 rounded-2xl border-l-8 border-blue-500">
                            <h3 className="text-2xl font-bold mb-6 text-white">🔍 How to Read Damage</h3>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex gap-3">
                                    <span className="text-blue-400 text-xl font-bold">➢</span>
                                    <div><strong>Rear Dmg + Front Dmg:</strong> Classic rear-end. Confirm A was stopped and B failed to stop.</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-400 text-xl font-bold">➢</span>
                                    <div><strong>Corner vs. Side (T-Bone):</strong> Hitting the <em>back</em> door suggests the turning car was almost clear (pre-established). Hitting the <em>front</em> wheel suggests they turned right in front of you.</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-400 text-xl font-bold">➢</span>
                                    <div><strong>Scrape Direction:</strong> Damage starting back-to-front often indicates the other car merged <em>into</em> you.</div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-2xl border-l-8 border-green-500">
                            <h3 className="text-2xl font-bold mb-6 text-white">📞 Top 5 Questions to Ask</h3>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex gap-3">
                                    <span className="text-green-400 text-xl font-bold">1</span>
                                    <div>"Who was changing lanes, turning, or backing up?" (The Moving Maneuver)</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-green-400 text-xl font-bold">2</span>
                                    <div>"Who had the green light, stop sign, or right-of-way?"</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-green-400 text-xl font-bold">3</span>
                                    <div>"Where is the visible damage on BOTH vehicles?"</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-green-400 text-xl font-bold">4</span>
                                    <div>"Did anyone say 'I didn't see you' or 'I was looking at my phone'?"</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </section>





            {/* NEW: The Adjuster Script */}
            <section className="py-20 bg-emerald-900 text-white border-b-8 border-emerald-700">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-yellow-500">The "Adjuster Script"</h2>
                    <p className="text-center max-w-2xl mx-auto mb-8 text-sm md:text-lg text-emerald-100">
                        Insurers are trained to minimize your claim. Use these specific questions.
                    </p>

                    <div className="md:hidden mb-4 text-xs text-center text-emerald-400 font-medium">← Swipe for Topics →</div>

                    <MobileScrollContainer>
                        {/* 1. Ground Rules */}
                        <div className="w-[85vw] md:w-auto h-full bg-emerald-800 p-6 rounded-xl border border-emerald-600 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-emerald-500 pb-2">1. Ground Rules</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Ask Immediately</p>
                                    <p className="font-semibold text-lg">"Are you recording this call?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">If yes, be extremely brief.</p>
                                </div>
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Establish Authority</p>
                                    <p className="font-semibold text-lg">"What is your authority?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Talk to a decision-maker.</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Liability */}
                        <div className="w-[85vw] md:w-auto h-full bg-emerald-800 p-6 rounded-xl border border-emerald-600 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-emerald-500 pb-2">2. Liability & Fault</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Corner Them</p>
                                    <p className="font-semibold text-lg">"Completed your investigation?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Force them to admit delays.</p>
                                </div>
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Get a Clean Answer</p>
                                    <p className="font-semibold text-lg">"Accept FULL liability?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Don't accept "under review".</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Coverage */}
                        <div className="w-[85vw] md:w-auto h-full bg-emerald-800 p-6 rounded-xl border border-emerald-600 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-emerald-500 pb-2">3. Coverage Limits</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Know the Cap</p>
                                    <p className="font-semibold text-lg">"What are the BI/PD limits?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Essential for knowing the ceiling.</p>
                                </div>
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Identify Buckets</p>
                                    <p className="font-semibold text-lg">"Which coverages are active?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Confirm Rental/MedPay explicitly.</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Evaluation */}
                        <div className="w-[85vw] md:w-auto h-full bg-emerald-800 p-6 rounded-xl border border-emerald-600 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-emerald-500 pb-2">4. The Offer</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Expose Gaps</p>
                                    <p className="font-semibold text-lg">"What records are you using?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Find missing bills/estimates.</p>
                                </div>
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Push for More</p>
                                    <p className="font-semibold text-lg">"Highest authority?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Signal you want a supervisor.</p>
                                </div>
                            </div>
                        </div>

                        {/* 5. Documentation */}
                        <div className="w-[85vw] md:w-auto h-full bg-emerald-800 p-6 rounded-xl border border-emerald-600 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-emerald-500 pb-2">5. Paper Trail</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Create Evidence</p>
                                    <p className="font-semibold text-lg">"Can you put that in writing?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Locks them in.</p>
                                </div>
                                <div>
                                    <p className="text-yellow-300 font-bold text-sm uppercase">Remove Excuses</p>
                                    <p className="font-semibold text-lg">"What info do you need?"</p>
                                    <p className="text-emerald-200 text-sm mt-1">Stop delay tactics.</p>
                                </div>
                            </div>
                        </div>

                    </MobileScrollContainer>
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
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What is the "Total Loss Threshold" in Texas?</h3>
                            <p className="text-gray-600">
                                Texas follows the <strong>100% Rule</strong> (Transportation Code). Your car is totaled only if (Repair Cost + Salvage Value) ≥ Actual Cash Value.
                                This is a higher bar than many states, meaning your car might be repaired even with heavy damage.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Can I keep my car if it's totaled? (Owner Retention)</h3>
                            <p className="text-gray-600">
                                Yes, but your payout will be reduced by the <strong>Salvage Value</strong>.
                                <br /><em>Formula: Payout = ACV - Deductible - Salvage Value.</em>
                                <br />You will receive a "Salvage Title" and must pass a DMV inspection to drive it legally again.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What happens to my car after it's totaled?</h3>
                            <p className="text-gray-600">If you don't keep it, the insurer takes the title and sells it for salvage. You get the check (minus deductible).</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">Will my injury claim increase my total loss payout?</h3>
                            <p className="text-gray-600">
                                <strong>No.</strong> They are separate buckets.
                                The insurer will NOT pay more for the car just because you are hurt or "upside down" on your loan.
                                Your injury settlement is for medical bills and pain—not to pay off your car loan.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">How do injuries factor in?</h3>
                            <p className="text-gray-600">Injury claims are separate. Do NOT feel pressured to settle your injury claim just to get your total loss check. They are different "buckets" of money.</p>
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
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-blue-800">What counts as an "injury" in Texas?</h3>
                            <p className="text-gray-600">
                                <strong>It's broader than you think.</strong> Texas law defines "bodily injury" as <em>any</em> physical pain, illness, or impairment.
                                <br />Even "just soreness," stiff neck, or headaches count—<strong>IF</strong> they are documented by a medical provider and linked to the crash.
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
                <div className="grid md:grid-cols-4 gap-8 text-left max-w-6xl mx-auto mb-8">
                    <div>
                        <h4 className="text-white font-bold mb-4">Total Loss Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="/checklist" className="hover:text-white transition">Action Checklist</a></li>
                            <li><a href="https://www.tdi.texas.gov/" target="_blank" className="hover:text-white transition">TDI Complaint Portal</a></li>
                            <li><a href="https://www.nhtsa.gov/recalls" target="_blank" className="hover:text-white transition">NHTSA Recalls</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Major Texas Cities</h4>
                        <ul className="space-y-2">
                            <li><a href="/dallas-total-loss" className="hover:text-white transition">Dallas Total Loss</a></li>
                            <li><a href="/houston-total-loss" className="hover:text-white transition">Houston Total Loss</a></li>
                            <li><a href="/san-antonio-total-loss" className="hover:text-white transition">San Antonio Total Loss</a></li>
                            <li><a href="/austin-total-loss" className="hover:text-white transition">Austin Total Loss</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">More Locations</h4>
                        <ul className="space-y-2">
                            <li><a href="/fort-worth-total-loss" className="hover:text-white transition">Fort Worth Total Loss</a></li>
                            <li><a href="/el-paso-total-loss" className="hover:text-white transition">El Paso Total Loss</a></li>
                            <li><a href="/corpus-christi-total-loss" className="hover:text-white transition">Corpus Christi Total Loss</a></li>
                        </ul>
                    </div>
                </div>

                <p>© {new Date().getFullYear()} Total Loss Intake Platform. All rights reserved.</p>
                <p className="mt-2">Disclaimer: This tool provides informational estimates only and is not legal advice or a formal appraisal.</p>
            </footer>

            <ChatWidget />
            {/* Mobile Nav */}
            <MobileNav />
        </main>
    );
}
