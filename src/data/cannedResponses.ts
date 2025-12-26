export type CannedResponse = {
    trigger: string;
    text: string;
    category: 'Greeting' | 'Empathy' | 'Qualifying' | 'Scheduling' | 'Objection' | 'Closing';
};

export const CANNED_RESPONSES: CannedResponse[] = [
    // --- GREETINGS ---
    { category: 'Greeting', trigger: 'hi', text: "Hi there! I'm Angel, the lead specialist here. I've reviewed the details you submitted. How are you holding up?" },
    { category: 'Greeting', trigger: 'hello', text: "Hello! Thanks for reaching out. I see you're looking for help with your claim. I'm here to guide you." },
    { category: 'Greeting', trigger: 'welcome', text: "Welcome back. I have your file open in front of me. Did anything change since we last spoke?" },
    { category: 'Greeting', trigger: 'afterhours', text: "Thanks for messaging us. Although our main office is closed, I'm here to get your case priority status for the morning. What's on your mind?" },

    // --- EMPATHY & VALIDATION (The "Soft" element) ---
    { category: 'Empathy', trigger: 'sorry', text: "I'm so sorry to hear you're going through this. Dealing with insurance on top of an accident is incredibly stressful." },
    { category: 'Empathy', trigger: 'stress', text: "Take a deep breath. It is completely normal to feel overwhelmed right now. That's exactly why we are here—to take this burden off your shoulders." },
    { category: 'Empathy', trigger: 'pain', text: "I understand you're in pain. Your health is the absolute priority right now. Please don't worry about the paperwork yet." },
    { category: 'Empathy', trigger: 'frustrated', text: "I can hear your frustration, and practically everyone in your position feels the same way. The insurance process is designed to be confusing, but we know their playbook." },
    { category: 'Empathy', trigger: 'listen', text: "I want to make sure I fully understand your situation. Please take your time, I'm listening." },

    // --- QUALIFYING (Gathering Info) ---
    { category: 'Qualifying', trigger: 'fault', text: "To help me advise you best, do you know if a police report was filed at the scene?" },
    { category: 'Qualifying', trigger: 'tickets', text: "Did the officer issue a ticket to the other driver?" },
    { category: 'Qualifying', trigger: 'injured', text: "Are you feeling any soreness or stiffness, even if it feels minor? Often adrenaline hides injuries for the first 24 hours." },
    { category: 'Qualifying', trigger: 'treatment', text: "Have you been able to see a doctor or visit an Urgent Care since the accident?" },
    { category: 'Qualifying', trigger: 'insurance', text: "Do you happen to know the name of the other driver's insurance company?" },
    { category: 'Qualifying', trigger: 'photos', text: "Do you have any photos of the damage to your vehicle? You can upload them directly here by clicking the camera icon." },

    // --- SCHEDULING / SOFT SALES (The "Ask") ---
    { category: 'Scheduling', trigger: 'review', text: " based on what you've told me, I think there's significant value here that the insurance company isn't showing you. I'd like to have our Senior Case Manager review this for 5 minutes. Would you be open to a quick call?" },
    { category: 'Scheduling', trigger: 'call', text: "It's a lot to type out, and I want to make sure I explain your options clearly. Do you have 5 minutes for a quick phone chat?" },
    { category: 'Scheduling', trigger: 'consult', text: "We offer a 100% free, no-obligation strategy session. We can look at your car's valuation and your injury claim together. When is the best time to call you?" },
    { category: 'Scheduling', trigger: 'morning', text: "Would a call tomorrow morning around 10 AM work for you, or would the afternoon be better?" },
    { category: 'Scheduling', trigger: 'asap', text: "I can have a specialist call you right now to secure your evidence. Is this the best number: {phone}?" },
    { category: 'Scheduling', trigger: 'value', text: "To get you the maximum value for your car, we need to counter their offer with hard data. We can explain how to do this in a short call. Are you available now?" },
    { category: 'Scheduling', trigger: 'lawyer', text: "You don't need to hire us to get advice. I'd love to just give you a generic roadmap of what to expect next. No pressure at all. Free to chat?" },
    { category: 'Scheduling', trigger: 'strategy', text: "I have a strategy in mind that has worked for similar cases in {city}. Let's hop on a call so I can walk you through it." },

    // --- OBJECTION HANDLING ---
    { category: 'Objection', trigger: 'cost', text: "Great question. We work on a contingency basis, which means we strictly only get paid if we win. There are zero upfront costs to you ever." },
    { category: 'Objection', trigger: 'fees', text: "If we don't recover money for you, you owe us nothing. It's a risk-free way to ensure you aren't being taken advantage of." },
    { category: 'Objection', trigger: 'think', text: "I completely understand needing to think about it. Just keep in mind that insurance adjusters use 'delay' as a tactic. The sooner we preserve evidence, the stronger your case." },
    { category: 'Objection', trigger: 'busy', text: "I get that you're busy. That's actually why people hire us—we spend the hours on hold with insurance companies so you don't have to." },
    { category: 'Objection', trigger: 'offer', text: "They might have made you an offer, but remember: their first offer is almost always their lowest. It costs you nothing to let us double-check it." },
    { category: 'Objection', trigger: 'trust', text: "We've helped thousands of Texans just like you. Check out our reviews. We treat our clients like family, not numbers." },

    // --- CLOSING / NEXT STEPS ---
    { category: 'Closing', trigger: 'setup', text: "Great. I've put you on the calendar. You'll receive a text confirmation shortly." },
    { category: 'Closing', trigger: 'next', text: "Here is the plan: 1) We'll do a deep dive on your vehicle value. 2) We'll help you find a doctor near you. 3) We'll handle all insurance communication. Sound good?" },
    { category: 'Closing', trigger: 'upload', text: "Please look for the upload link I just sent. Once we have those photos, we can really start building your leverage." },
    { category: 'Closing', trigger: 'bye', text: "Thank you for chatting. Try to rest and take it easy. We'll be in touch very soon." },
    { category: 'Closing', trigger: 'handoff', text: "I'm going to pass your file to our Senior Attorney. They will call you from a 214 area code in about 10 minutes." },

    // --- SPECIAL SITUATIONS ---
    { category: 'Closing', trigger: 'rights', text: "Remember, in Texas you have the right to choose your own body shop and your own doctor. Don't let them dictate your recovery." },
    { category: 'Closing', trigger: 'diminished', text: "Since your car is new, you likely have a 'Diminished Value' claim in addition to the repairs. We can help you fight for that check too." },
    { category: 'Closing', trigger: 'gap', text: "If you have GAP insurance, that's great news. We can help ensure it covers the difference properly." },
    { category: 'Closing', trigger: 'uber', text: "Since this involved a Rideshare, there is likely a $1 Million policy in play. It is very important we trigger that coverage immediately." },
    { category: 'Closing', trigger: 'truck', text: "Trucking companies have rapid response teams on scene within hours. We need to move fast to preserve the black box data." },
];
