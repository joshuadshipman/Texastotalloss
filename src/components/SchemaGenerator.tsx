import React from 'react';

/**
 * Generates the LegalService Schema for local SEO city pages.
 */
export function LegalServiceSchema({ 
    city, 
    state = "TX",
    url 
}: { 
    city: string, 
    state?: string, 
    url: string 
}) {
    const defaultData = {
        "@context": "https://schema.org",
        "@type": "LegalService",
        "name": "Texas Total Loss",
        "image": "https://texastotalloss.com/og-image.jpg",
        "description": `Free independent total loss valuation and injury claim review for residents of ${city}, ${state}.`,
        "url": url,
        "telephone": "+1-800-555-0199",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city,
            "addressRegion": state,
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "32.7767", // Default to TX center or passed in
            "longitude": "-96.7970"
        },
        "areaServed": {
            "@type": "City",
            "name": city
        },
        "priceRange": "$$"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultData) }}
        />
    );
}

/**
 * Generates the FAQPage Schema for Semantic SEO snippets.
 */
export function FAQPageSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
    );
}

/**
 * Generates the Attorney/Organization Schema for E-E-A-T.
 */
export function AttorneySchema() {
    // Note: TTL is a lead gen entity, but Attorney schema helps if we operate a legal matching service
    // or if we partner directly with Angle Reyes.
    const orgData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Texas Total Loss",
        "url": "https://texastotalloss.com",
        "logo": "https://texastotalloss.com/logo.png",
        "sameAs": [
            "https://www.facebook.com/texastotalloss",
            "https://twitter.com/texastotalloss"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
        />
    );
}
