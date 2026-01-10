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
            category: "Immediate Actions",
            items: [
                { q: "What should I do immediately after a car accident?", a: "Ensure safety first. Call 911 if there are injuries. Move vehicles only if safe. Exchange info and document the scene with photos." },
                { q: "Should I call the police for a minor accident?", a: "Yes. A police report provides an unbiased record, which is crucial for insurance claims, even for minor damage." },
                { q: "What info should I exchange with the other driver?", a: "Name, address, phone number, insurance company, policy number, driver's license number, and license plate number." },
                { q: "Should I admit fault at the scene?", a: "No. Never admit fault or apologize at the scene. Let the investigation determine liability based on facts." },
                { q: "How do I document the accident scene?", a: "Take photos of vehicle damage, skid marks, road signs, and injuries. Get witness contact info if available." }
            ]
        },
        {
            category: "Insurance & Claims",
            items: [
                { q: "How do I file a car insurance claim?", a: "Contact your insurer's claims department or use their mobile app. Provide the police report number and photos." },
                { q: "Whose insurance do I call first?", a: "Call your own insurance company to report the accident. If the other driver is at fault, you can file a claim with them too." },
                { q: "Will my rates go up if it wasn't my fault?", a: "In Texas, your rates generally shouldn't increase for a not-at-fault accident, but policies vary." },
                { q: "What is 'Total Loss'?", a: "A car is a total loss when repair costs exceed the vehicle's actual cash value (ACV) minus the salvage value." },
                { q: "How do insurance companies calculate car value?", a: "They use market research (CCC, Mitchell) to find comparable local vehicles. These valuations are often low and can be disputed." },
                { q: "What is 'Gap Insurance'?", a: "Gap insurance covers the difference between your car's ACV (what insurance pays) and what you still owe on your loan." },
                { q: "What if the other driver is uninsured?", a: "If you have Uninsured Motorist (UM/UIM) coverage, your own policy will pay for your damages and medical bills." },
                { q: "Can I choose my own body shop?", a: "Yes. Texas law gives you the specific right to choose where your vehicle is repaired. You do not have to use their 'preferred' shop." }
            ]
        },
        {
            category: "Medical & Injuries",
            items: [
                { q: "Should I see a doctor if I feel fine?", a: "Yes. Adrenaline can mask injuries like whiplash. A medical record links injuries to the accident." },
                { q: "Who pays for my medical bills?", a: "Initially, your own PIP (Personal Injury Protection) or health insurance. The at-fault driver's liability pays eventually." },
                { q: "What is PIP coverage?", a: "Personal Injury Protection covers medical costs and lost wages for you and your passengers, regardless of fault. Texas requires it unless rejected in writing." },
                { q: "Can I get compensation for pain and suffering?", a: "Yes, 'pain and suffering' is a non-economic damage you can claim against the at-fault party." }
            ]
        },
        {
            category: "Legal & Disputes",
            items: [
                { q: "Do I need a lawyer for a fender bender?", a: "Likely not. But if there are injuries or a disputed liability, a lawyer is highly recommended." },
                { q: "How to dispute a total loss offer?", a: "Find local comparable vehicles (comps) priced higher than their offer. Submit these to the adjuster or invoke your policy's Appraisal Clause." },
                { q: "What is the Appraisal Clause?", a: "A policy provision allowing you to hire an independent appraiser to negotiate the value of your car directly with the insurer's appraiser." },
                { q: "What is Diminished Value?", a: "The loss in market value your car suffers simply because it has an accident history, even after perfect repairs." },
                { q: "Is Texas a Diminished Value state?", a: "Yes. You can claim diminished value against the at-fault driver's insurance relative to the loss in resale value." }
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
