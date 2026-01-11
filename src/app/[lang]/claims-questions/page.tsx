import type { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import Link from 'next/link';

type Props = {
    params: Promise<{ lang: 'en' | 'es' }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: 'Top 50 Car Accident Questions & Answers | Texas Total Loss',
        description: 'Get clear, direct answers to the top 50 questions claimants ask after a car accident in Texas. From police reports to total loss valuations, we cover it all.',
    };
}

export default async function ClaimsQuestionsPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const questions = [
        {
            category: "At the Scene",
            items: [
                { q: "What is the first thing I should do after a car accident?", a: "Ensure safety, check for injuries, and call 911 immediately. Turn on hazard lights and move to a safe spot if possible." },
                { q: "Do I always need to call the police?", a: "Yes. In Texas, you must report accidents involving injury, death, or damage over $1,000. A police report is vital for your claim." },
                { q: "What information must I exchange with the other driver?", a: "Name, address, phone number, insurance company name, policy number, driver’s license number, and license plate." },
                { q: "Should I apologize to the other driver?", a: "No. Never say 'I'm sorry' or admit fault at the scene. These statements can be used against you later to deny liability." },
                { q: "How should I document the accident?", a: "Take photos of all vehicle positions, damage, skid marks, road signs, and injuries. diverse angles are best." },
                { q: "What if the other driver flees (Hit and Run)?", a: "Stay at the scene, call the police, and write down any details of their car (make, color, partial plate). Do not chase them." },
                { q: "Should I speak to witnesses?", a: "Yes. Get names and phone numbers of any bystanders. Independent witnesses are powerful evidence in disputed liability cases." },
                { q: "Do I need to report the accident to the state?", a: "If police don't investigate, you must file a Crash Report (CR-2) with TxDOT within 10 days if there is injury or significant damage." }
            ]
        },
        {
            category: "Vehicle Damage & Total Loss",
            items: [
                { q: "What qualifies as a 'Total Loss' in Texas?", a: "A car is a total loss if the repair cost plus salvage value equals or exceeds the vehicle's Actual Cash Value (ACV)." },
                { q: "How is 'Actual Cash Value' determined?", a: "ACV is the fair market value of your car just before the crash, usually based on comparable local sales, not Kelly Blue Book." },
                { q: "Can I dispute the insurance company's valuation?", a: "Yes. You can submit your own comparable vehicle listings (comps) to prove their offer is too low." },
                { q: "What is the 'Appraisal Clause'?", a: "A policy provision letting you hire an independent appraiser to negotiate value with the insurer's appraiser if you can't agree." },
                { q: "What is 'Gap Insurance'?", a: "It pays the difference between your car's ACV settlement and what you still owe on your loan/lease if you're 'upside down'." },
                { q: "What is 'Diminished Value'?", a: "The loss in market value a car suffers due to having an accident history, even after it has been perfectly repaired." },
                { q: "Can I claim Diminished Value in Texas?", a: "Yes, but generally only against the at-fault driver's insurance (third-party claim), not your own collision policy." },
                { q: "Can I choose my own repair shop?", a: "Yes. Texas law prohibits insurers from forcing you to use a specific shop. You have the right to choose." },
                { q: "What if the repair shop charges more than insurance estimates?", a: "The insurance company must negotiate with the shop to restore the car to pre-loss condition, but disputes can occur." },
                { q: "Who pays for my rental car?", a: "The at-fault driver's insurance should pay. If they delay, use your own 'Rental Reimbursement' coverage and get reimbursed later." }
            ]
        },
        {
            category: "Injuries & Medical",
            items: [
                { q: "Should I go to the ER even if I feel fine?", a: "Yes. Adrenaline masks pain. A delay in treatment gives insurance companies a reason to argue your injuries aren't accident-related." },
                { q: "Who pays my medical bills upfront?", a: "Use your own PIP (Personal Injury Protection) or health insurance. Settlement from the other driver comes later." },
                { q: "What is PIP coverage?", a: "Personal Injury Protection covers medical bills and lost wages for you/passengers regardless of fault. It is mandatory in TX unless rejected in writing." },
                { q: "Do I have to pay back my health insurance?", a: "Likely yes. This is called 'Subrogation'. Your health insurer expects reimbursement from your injury settlement." },
                { q: "What are 'General Damages'?", a: "Non-economic damages like physical pain, suffering, mental anguish, and loss of enjoyment of life." },
                { q: "Can I claim lost wages?", a: "Yes. You are entitled to compensation for income lost due to recovery time or medical appointments." },
                { q: "What if I have a pre-existing condition?", a: "The 'Eggshell Skull' rule means the at-fault driver is liable for aggravating pre-existing conditions, though it complicates the case." }
            ]
        },
        {
            category: "Insurance Company Tactics",
            items: [
                { q: "Should I give a recorded statement?", a: "No. Do not give a recorded statement to the other driver's insurance without legal advice. They fish for inconsistencies." },
                { q: "Why did the insurance company offer me a quick check?", a: "This is a 'swoop and settle' tactic to get you to sign a release before you realize the full extent of your injuries." },
                { q: "What is a 'Release of Liability'?", a: "A legal document that ends your claim forever in exchange for payment. Never sign this until you are 100% sure you are done treating." },
                { q: "Why is the adjuster ignoring my calls?", a: "Delay tactics wear you down. Document every attempt to contact them and consider filing a TDI complaint." },
                { q: "What is 'Comparative Negligence'?", a: "Texas uses 'Modified Comparative Negligence'. If you are more than 50% at fault, you cannot recover damages." },
                { q: "Can they deny my claim if I was partly at fault?", a: "They can reduce your payout by your percentage of fault. If you are 51% at fault, you get $0." }
            ]
        },
        {
            category: "Legal & Court",
            items: [
                { q: "What is the Statute of Limitations in Texas?", a: "Generally, you have 2 years from the date of the accident to file a lawsuit for personal injury or property damage." },
                { q: "How much does a car accident lawyer cost?", a: "Most work on a 'Contingency Fee' basis, taking a percentage (usually 33-40%) of the settlement only if they win." },
                { q: "Will my case go to trial?", a: "Most cases (over 90%) settle out of court. Trials are expensive and risky, so insurers prefer to settle." },
                { q: "Can I sue the other driver personally?", a: "Technically yes, but you are usually suing to get to their insurance policy limits. Most individuals don't have personal assets to pay judgments." },
                { q: "What are 'Policy Limits'?", a: "The maximum amount an insurance policy will pay. Texas minimum is 30/60/25 ($30k per person, $60k per accident, $25k property)." },
                { q: "What if my damages exceed their policy limits?", a: "You can file an Underinsured Motorist (UIM) claim with your own policy to cover the difference." },
                { q: "What is a 'Letter of Protection' (LOP)?", a: "A promise signed by you and your attorney to pay a doctor from the future settlement funds so you can get treated now." },
                { q: "How long does a settlement take?", a: "Simple claims can settle in months. Complex injury cases needing extensive treatment or litigation can take 1-2 years." }
            ]
        },
        {
            category: "Special Situations",
            items: [
                { q: "What if the driver was drunk (DWI)?", a: "You may be entitled to 'Punitive Damages' in addition to standard damages to punish the gross negligence." },
                { q: "What if I was hit by an Uber/Lyft?", a: "Rideshare companies have large insurance policies ($1M+) that apply if the app was on and a ride was in progress." },
                { q: "What if I was hit by a Commercial Truck?", a: "Trucking cases are complex. Federal regulations (FMCSA) apply, and evidence like electronic logbooks must be preserved immediately." },
                { q: "What if a government vehicle hit me?", a: "The 'Texas Tort Claims Act' applies. Notice deadlines are very short (often 6 months or less) and liability is capped." },
                { q: "Can I claim for a car seat?", a: "Yes. NHTSA recommends replacing car seats after any moderate accident. Insurance usually covers the full replacement cost." },
                { q: "What about loose items damaged in the car?", a: "Property damage claims can include glasses, laptops, or phones broken in the crash. Provide receipts or photos." },
                { q: "What if the accident happened on private property?", a: "Police might not write a report. Documenting the scene yourself is even more critical. General negligence laws still apply." }
            ]
        }
    ];

    // Schema for FAQ
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.flatMap(cat => cat.items.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        })))
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <header className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-white/10 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Top <span className="text-gold-500">50 Questions</span> Claimants Ask
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Real answers to the most common Google searches about car accidents, insurance claims, and total losses in Texas.
                    </p>
                </div>
            </header>

            <section className="py-12 px-4 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    {questions.map((cat, idx) => (
                        <div key={idx} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gold-500 border-b border-white/10 pb-2">{cat.category}</h2>
                            <ul className="space-y-6">
                                {cat.items.map((item, i) => (
                                    <li key={i} className="bg-slate-900 p-6 rounded-xl border border-white/5 shadow-sm hover:border-gold-500/30 transition duration-300">
                                        <h3 className="font-bold text-lg text-white mb-2 flex items-start gap-2">
                                            <span className="text-gold-500 text-sm mt-1">Q.</span> {item.q}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed pl-6 border-l-2 border-slate-700">
                                            {item.a}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-16 bg-slate-900 border-t border-white/5 text-center px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-slate-400 mb-8">Our AI Case Review can answer specific questions about your situation instantly.</p>
                    <Link href={`/${lang}`} className="bg-gold-500 text-navy-900 font-bold py-3 px-8 rounded-full hover:bg-gold-400 transition transform hover:scale-105 inline-block">
                        Start Free Case Review
                    </Link>
                </div>
            </section>
        </main>
    );
}
