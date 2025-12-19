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

import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, MapPinIcon, GavelIcon, CarIcon, DollarSignIcon, SearchIcon } from 'lucide-react';


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
                        <span className="block text-white mb-2 text-red-500 font-bold">Total Loss!!! Now what!?!</span>
                        <span className="block text-blue-300">Mitigate Damages? ACV? GAP Coverage? Injuries? Missed Work?</span>
                    </h1>
                    <div className="text-lg md:text-xl font-medium text-blue-100 space-y-4 max-w-3xl mx-auto bg-blue-800/50 p-6 rounded-xl border border-blue-400/30">
                        <p className="text-2xl md:text-3xl font-extrabold text-amber-300 italic leading-snug drop-shadow-sm">
                            "Worried about the ACV?"
                        </p>
                        <p className="font-bold text-white text-lg">
                            Don't Worry, <span className="text-yellow-400">Angel</span> (Your TL & Injury Specialist) is here to help with all your concerns.
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
                            onClick={() => openChat('sms')}
                            className="flex-1 h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2"
                        >
                            <span>💬 Text / SMS</span>
                        </button>
                        <button
                            onClick={() => openChat()}
                            className="flex-1 h-16 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2"
                        >
                            <span>⏱ Schedule Consult</span>
                        </button>
                    </div>
                    <p className="text-xs text-blue-300 mt-4">Here to help you with the stress.</p>
                </div>
            </header>







            {/* NEW: Interactive Valuation Calculator (Replaces old CTA) */}
            <div id="calculator">
                <ValuationCalculator />
            </div>

            {/* Feature Row Removed - Content moved to FAQ */}

            {/* NEW: Resource Cards Grid (Consolidated Sections) */}
            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Critical Resources</h2>
                    <div className="flex flex-col gap-4">

                        {/* 1. Accident Checklist Card */}
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
                                        <p className="text-sm text-gray-600"><strong>DO NOT</strong> say "I'm sorry" or "I'm fine." Ask: "Are you okay?" and exchange info only. Do not give statements yet; especially to the insurance carrier of the driver who caused the accident.</p>
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

                        {/* 2. Duty to Mitigate Card */}
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

                        {/* 4. The 'Adjuster Script' Card (Moved from #9) */}
                        <SectionCard
                            title="The 'Adjuster Script'"
                            subtitle="How to Counter Insurer Tactics"
                            icon={<FileTextIcon size={24} />}
                            colorClass="bg-emerald-800"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-emerald-800 mb-2">The Playbook</h2>
                                <p className="text-gray-600">Insurers are trained to minimize payout. Here are the questions to ask.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                                    <h3 className="text-lg font-bold mb-2 text-emerald-900">1. Ground Rules</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500">Ask Immediately</p>
                                            <p className="font-bold text-lg text-emerald-800">"Are you recording this call?"</p>
                                            <p className="text-sm text-gray-600">If yes, be extremely brief and stick to facts.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500">Establish Authority</p>
                                            <p className="font-bold text-lg text-emerald-800">"What is your settlement authority?"</p>
                                            <p className="text-sm text-gray-600">Ensure you aren't talking to someone who can't cut a check.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                                    <h3 className="text-lg font-bold mb-2 text-emerald-900">2. Liability Stance</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500">Get a Clean Answer</p>
                                            <p className="font-bold text-lg text-emerald-800">"Have you accepted FULL liability?"</p>
                                            <p className="text-sm text-gray-600">Do not accept "pending" or "under review" if facts are clear.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                                    <h3 className="text-lg font-bold mb-2 text-emerald-900">3. Coverage Limits</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500">Know the Cap</p>
                                            <p className="font-bold text-lg text-emerald-800">"What are the policy limits for Property Damage?"</p>
                                            <p className="text-sm text-gray-600">If your car is worth $50k and they only have $25k limit, you have a problem.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 5. How do I know if it's a Total Loss? (Moved from #7 - wait, was #5 in prev view, but let's just place it here safely) */}
                        <SectionCard
                            title="How do I know if it's a Total Loss?"
                            subtitle="The Texas 100% Rule Explained"
                            icon={<AlertTriangleIcon size={24} />}
                            colorClass="bg-blue-900"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-blue-900 mb-2">The Texas Formula</h2>
                                <p className="text-gray-600">It's not just about repair costs.</p>
                            </div>

                            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 text-center max-w-2xl mx-auto">
                                <p className="text-lg text-gray-800 mb-4 font-medium">In Texas, your car is legally totaled if:</p>
                                <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-red-500">
                                    <p className="font-black text-xl md:text-2xl text-red-600">Repairs + Salvage Value ≥ Current ACV</p>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Unlike some states with a 75% threshold, Texas uses this "100% Rule".
                                    Even if repairs are cheaper than the car's value, if the <strong>Salvage Value</strong> tips the scale, they take the car.
                                </p>
                            </div>
                        </SectionCard>

                        {/* 6. 2025 Market Reality Check (Moved from #4) */}
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

                        {/* 7. Determining Fault Card (Moved from #8) */}
                        <SectionCard
                            title="Determining Fault: Common Scenarios"
                            subtitle="Who is liable? (Interactive Guide)"
                            icon={<CarIcon size={24} />}
                            colorClass="bg-yellow-600"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-gray-900 mb-2">Who is at Fault?</h2>
                                <p className="text-gray-600">Swipe or tap a scenario to reveal the likely liability decision.</p>
                            </div>

                            <MobileScrollContainer>
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
                        </SectionCard>

                        {/* 8. Understanding Coverage Card (Moved from #5) */}
                        <SectionCard
                            title="Understanding Your Coverage"
                            subtitle="ACV, GAP, and Coverage Flow"
                            icon={<ShieldCheckIcon size={24} />}
                            colorClass="bg-blue-900"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-blue-900 mb-2">Coverage Guide</h2>
                                <p className="text-gray-600">Know what you are entitled to under Texas Law.</p>
                            </div>

                            <div className="space-y-8">
                                {/* 1. Total Loss & ACV - Reused Content */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-blue-900">1. Total Loss & Actual Cash Value</h3>
                                        <p className="mb-4 text-gray-700">
                                            When a car is totaled, the insurer owes you the <strong>Actual Cash Value (ACV)</strong> immediately before the crash,
                                            not what you owe on your loan.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full max-w-sm">
                                        <LightboxImage src="/images/infographics/compounding_fees.png" alt="ACV vs Loan Visual" />
                                    </div>
                                </div>

                                {/* 2. Coverage Flow - Reused Content */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-blue-900">2. Coverage Flow</h3>
                                        <ul className="list-disc ml-5 space-y-1 text-sm md:text-base text-gray-700">
                                            <li><strong>UMPD:</strong> Pays if at-fault driver can't. Lower deductible.</li>
                                            <li><strong>Collision:</strong> Pays regardless of fault.</li>
                                            <li><strong>PIP/MedPay:</strong> Pays medical bills now.</li>
                                        </ul>
                                    </div>
                                    <div className="flex-1 w-full max-w-sm">
                                        <LightboxImage src="/images/infographics/duty_to_mitigate.png" alt="Coverage Flowchart" />
                                    </div>
                                </div>

                                {/* 3. Payout Math - Reused Content */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-blue-900">3. The Payout Math</h3>
                                        <p className="mb-4 text-gray-700">
                                            The check is ACV minus your deductible. Gap insurance covers the rest <em>only if you have it</em>.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full max-w-sm">
                                        <LightboxImage src="/images/infographics/fault_bar_rule.png" alt="Payout Math" />
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 9. Texas UM Law Card (Moved from #6) */}
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

                        {/* 10. FAQ Card (Remains #10) */}
                        <SectionCard
                            title="Common Questions (FAQ)"
                            subtitle="Total Loss, Injuries, and Rights"
                            icon={<SearchIcon size={24} />}
                            colorClass="bg-gray-800"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Moved from Feature Row */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-blue-900 mb-2">Is Your Total Loss Offer Too Low?</h3>
                                    <p className="text-sm text-gray-600 mb-2">Insurance companies often undervalue totaled vehicles by using "comparables" that aren't really comparable.</p>
                                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                        <li>See what similar vehicles sell for</li>
                                        <li>Spot missing options/upgrades</li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-blue-900 mb-2">Gap Coverage & "Upside Down" Loans</h3>
                                    <p className="text-sm text-gray-600 mb-2">If your loan balance is higher than the car's value, you are "upside down". Gap insurance might pay the difference.</p>
                                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                        <li>Covers the "Gap" in value</li>
                                        <li>Hidden in many finance contracts</li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-blue-900 mb-2">Totaled Car + Injuries?</h3>
                                    <p className="text-sm text-gray-600 mb-2">If you were injured, your settlement should cover medical bills, pain, and lost wages. Do not sign a release quickly.</p>
                                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                        <li>Property and Injury are separate claims</li>
                                        <li>Seek medical care immediately</li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-blue-900 mb-2">What is "Total Loss"?</h3>
                                    <p className="text-sm text-gray-600">When repair costs + salvage value exceed the car's Actual Cash Value (100% Rule in Texas).</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-blue-900 mb-2">Can I keep my totaled car?</h3>
                                    <p className="text-sm text-gray-600">Yes (Owner Retention), but the insurer deducts the salvage value from your check.</p>
                                </div>
                            </div>
                        </SectionCard>

                    </div>
                </div>
            </section>

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
        </main >
    );
}
