import React from 'react';

interface FAQ {
    id: string; // Used for deep-linking and schema alignment
    question: string;
    answerHtml: string;
    citationText?: string;
    citationSource?: string;
    citationUrl?: string; // e.g., link to TIC code
}

export default function SemanticFAQ({ faqs }: { faqs: FAQ[] }) {
    return (
        <div className="semantic-faq-container space-y-4 my-8">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Frequently Asked Questions</h3>
            {faqs.map((faq) => (
                <details key={faq.id} className="faq-item group bg-slate-900 border border-white/10 rounded-lg overflow-hidden" id={faq.id}>
                    <summary className="faq-question cursor-pointer font-bold text-lg text-slate-200 p-4 hover:bg-slate-800 transition list-none flex justify-between items-center">
                        {faq.question}
                        <span className="text-gold-500 transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="faq-answer p-4 text-slate-300 border-t border-white/5 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: faq.answerHtml }} />
                        
                        {/* Citation Snippet Pattern for AI Engines (AEO/GEO) */}
                        {faq.citationText && (
                            <figure className="citation-snippet mt-4 p-4 bg-slate-950 border-l-4 border-gold-500 text-sm">
                                <blockquote cite={faq.citationUrl || "https://texastotalloss.com"}>
                                    "{faq.citationText}"
                                </blockquote>
                                {faq.citationSource && (
                                    <figcaption className="mt-2 text-slate-500 font-medium italic">
                                        — Source: {faq.citationUrl ? <cite><a href={faq.citationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">{faq.citationSource}</a></cite> : <cite>{faq.citationSource}</cite>}
                                    </figcaption>
                                )}
                            </figure>
                        )}
                    </div>
                </details>
            ))}
        </div>
    );
}
