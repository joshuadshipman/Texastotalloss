import Link from "next/link";
import type { Metadata } from "next";

// ── Dynamic Total Loss Topic Pages ───────────────────────────────────────────
// Each page is a long-form SEO guide targeting specific total loss queries.
// Structured for AEO (FAQ schema) and Google featured snippets.

interface TopicData {
  title: string;
  metaDescription: string;
  heroSubtitle: string;
  sections: { heading: string; content: string }[];
  faq: { question: string; answer: string }[];
  cta: { title: string; description: string; link: string; label: string };
}

const TOPIC_CONTENT: Record<string, TopicData> = {
  "acv-dispute": {
    title: "How to Dispute Your Total Loss ACV in Texas",
    metaDescription: "Step-by-step guide to disputing your insurance company's Actual Cash Value (ACV) offer in Texas. Fight lowball total loss settlements with real market data.",
    heroSubtitle: "Insurance adjusters typically start $2,000–$4,000 below real market value. Here's how to fight back.",
    sections: [
      { heading: "What Is ACV (Actual Cash Value)?", content: "ACV is the fair market value of your vehicle immediately before the accident. It's NOT the trade-in value, and it's NOT what you owe on your loan. It's what a willing buyer would pay a willing seller for your exact vehicle — with your exact mileage, condition, and options.\n\nInsurance companies use third-party valuation tools (CCC ONE, Mitchell, Audatex) that often undervalue vehicles by using distant comparable sales, ignoring local market conditions, and applying excessive condition deductions." },
      { heading: "Step 1: Get Your Own Comparable Sales", content: "Search AutoTrader, Cars.com, CarGurus, and Facebook Marketplace for vehicles matching your exact year, make, model, trim, and similar mileage within 100 miles of your location. Save screenshots with URLs — you'll need at least 3-5 comparable listings.\n\nKey tip: Insurance companies use SOLD prices, but in Texas you're entitled to argue ASKING prices because that's the replacement cost you'd actually pay." },
      { heading: "Step 2: Document Your Vehicle's Condition", content: "Gather all maintenance records, recent repairs, and upgrades. New tires, recent brake job, aftermarket stereo, tint, lift kit — all of these ADD value that adjusters often ignore.\n\nIf your vehicle was in above-average condition, say so in writing and provide documentation." },
      { heading: "Step 3: Write a Formal Demand Letter", content: "Send a written response to the adjuster's offer that includes: your comparable sales data, documentation of vehicle condition, a clear statement of the value you believe is fair, and a deadline for response (10 business days is standard in Texas).\n\nTexas Insurance Code §542.056 requires insurers to affirm or deny your claim within 15 business days after receiving all documentation." },
      { heading: "Step 4: File a Complaint with TDI", content: "If the insurance company won't budge, file a formal complaint with the Texas Department of Insurance (TDI) online at tdi.texas.gov. TDI has authority to investigate unfair settlement practices and can put real pressure on adjusters." },
      { heading: "When to Hire an Attorney", content: "If the gap between your documented value and their offer is over $3,000, it's often worth consulting a personal injury attorney — especially if you were also injured in the accident. PI attorneys handle total loss disputes as part of the overall injury claim at no upfront cost." },
    ],
    faq: [
      { question: "How do I dispute a total loss value in Texas?", answer: "Gather 3-5 comparable vehicle listings from AutoTrader/Cars.com, document your vehicle's condition and upgrades, write a formal demand letter with your evidence, and send it to the adjuster. If they don't respond fairly within 15 business days, file a complaint with the Texas Department of Insurance (TDI)." },
      { question: "How much should I expect from a total loss settlement in Texas?", answer: "You should receive the fair market (replacement) value of your vehicle before the accident, minus any applicable deductible. Use comparable listings within 100 miles to determine fair value. On average, initial insurance offers are $2,000-$4,000 below actual market value." },
      { question: "Can I negotiate a total loss settlement in Texas?", answer: "Yes. Insurance companies expect you to negotiate. Gather comparable sales data, document your vehicle's condition, and submit a formal counter-offer. The vast majority of total loss disputes are resolved through negotiation without legal action." },
    ],
    cta: { title: "Were You Also Injured?", description: "If you were hurt in the accident, your injury claim could be worth 10x your vehicle. Get a free case evaluation.", link: "/intake", label: "Free Case Evaluation →" },
  },
  "gap-insurance": {
    title: "GAP Insurance & Total Loss in Texas — What You Need to Know",
    metaDescription: "Understanding GAP insurance, loan/lease coverage, and what happens when you owe more than your totaled car is worth in Texas.",
    heroSubtitle: "Owe more than your car is worth? GAP insurance may cover the difference — but there are catches.",
    sections: [
      { heading: "What Is GAP Insurance?", content: "GAP (Guaranteed Asset Protection) insurance covers the difference between what your vehicle is worth (ACV) and what you still owe on your loan or lease. Without it, you could be stuck paying thousands on a car you no longer have." },
      { heading: "How GAP Works After a Total Loss", content: "After the insurance company pays out your ACV, GAP coverage kicks in to pay the remaining balance on your loan. Example: Your car's ACV is $18,000, but you owe $24,000. GAP covers the $6,000 difference.\n\nImportant: GAP does NOT cover missed payments, late fees, or extended warranty balances rolled into your loan." },
      { heading: "What If I Don't Have GAP?", content: "If you don't have GAP and owe more than your car is worth, you're responsible for the difference. Options include: negotiating with your lender for a hardship reduction, rolling the negative equity into a new loan (not recommended), or consulting with a consumer protection attorney if the original loan terms were predatory." },
      { heading: "Loan/Lease Payoff vs. GAP", content: "Some policies offer 'Loan/Lease Payoff' instead of GAP. This typically covers up to 125% of ACV — which may not cover the full gap if you're significantly underwater. Check your policy declarations page for the exact coverage type." },
    ],
    faq: [
      { question: "Does GAP insurance cover my deductible?", answer: "Most GAP policies do NOT cover your comprehensive or collision deductible. You'll still be responsible for paying your deductible amount." },
      { question: "How do I file a GAP claim in Texas?", answer: "Contact your GAP provider (often your dealer or lender, not your auto insurer). You'll need: the total loss settlement letter from your insurer, your loan payoff statement, and proof of insurance payment. File within 60 days of settlement." },
    ],
    cta: { title: "Need Help With Your Claim?", description: "Our team can review your situation and connect you with the right resources.", link: "/intake?path=vehicle", label: "Get Free Help →" },
  },
  "salvage-process": {
    title: "What Happens to Your Car at Copart After a Total Loss in Texas",
    metaDescription: "Your totaled car was towed to Copart or a salvage yard. Learn what happens next, your rights to personal property, and how to retain your vehicle in Texas.",
    heroSubtitle: "Your car is sitting at Copart. Here's what the insurance company isn't telling you about your rights.",
    sections: [
      { heading: "Why Your Car Was Towed to Copart", content: "After an accident, if the insurance company determines your vehicle is a total loss, they'll have it towed to a salvage facility — most commonly Copart or IAA (Insurance Auto Auctions). This is where it will be stored while your claim is processed and eventually auctioned." },
      { heading: "Your Right to Personal Property", content: "You have the right to retrieve personal belongings from your vehicle at the salvage yard. In Texas, the yard must give you reasonable access. Bring a government-issued ID and be prepared to sign a release. Do this as soon as possible — storage environments can damage personal items." },
      { heading: "Can You Keep Your Totaled Car?", content: "Yes. In Texas, you can retain your totaled vehicle. The insurance company will deduct the estimated salvage value from your settlement. You'll receive a salvage title and must pass a rebuilt title inspection before registering the vehicle for road use again." },
      { heading: "The Auction Process", content: "If you don't retain the vehicle, the insurance company takes ownership and sells it through Copart or IAA auction. Salvage buyers, rebuilders, and parts recyclers bid on the vehicle. The insurance company recovers some of their payout through the auction proceeds." },
      { heading: "Storage Fees", content: "Be aware: salvage yards charge daily storage fees. While the insurance company typically pays during the claims process, if there's a delay or dispute, fees can accumulate. In Texas, the insurer is responsible for reasonable storage costs during the claim investigation period." },
    ],
    faq: [
      { question: "How long does my car stay at Copart after a total loss?", answer: "Typically 30-60 days. The insurance company processes your claim, you negotiate the settlement, and once paid, the vehicle title transfers. If you retain the vehicle, you'll need to pick it up within the timeframe specified by the yard (usually 7-14 days after settlement)." },
      { question: "Can I buy my own car back from Copart?", answer: "Yes, but it's usually cheaper to retain it through your insurance company rather than buying it back at auction. If you've already surrendered the title, you can bid on it at the Copart auction like any other buyer." },
    ],
    cta: { title: "Fighting an Unfair Settlement?", description: "If the insurance company is lowballing you, we can help you fight for fair value.", link: "/total-loss/acv-dispute", label: "Learn How to Dispute →" },
  },
  "settlement-timeline": {
    title: "How Long Does a Total Loss Settlement Take in Texas?",
    metaDescription: "Realistic timeline for a total loss settlement in Texas. From accident to check — what to expect at each stage and how to speed up the process.",
    heroSubtitle: "Most total loss claims settle in 2-6 weeks. Here's the exact timeline and how to avoid delays.",
    sections: [
      { heading: "Day 1-3: Accident Report & Claim Filed", content: "File your claim immediately. The insurance company has 15 business days to acknowledge receipt under Texas law (§542.055). Get the claim number and your adjuster's direct contact information." },
      { heading: "Day 3-10: Vehicle Inspection & Total Loss Declaration", content: "An adjuster inspects the vehicle (at the tow yard or repair shop) and determines if repair costs exceed the vehicle's value. In Texas, a vehicle is typically totaled when repair costs exceed 100% of ACV. You'll be notified of the total loss determination." },
      { heading: "Day 10-20: ACV Offer & Negotiation", content: "The insurance company sends a valuation report and settlement offer. This is where most delays happen — if you accept immediately, the process moves fast. If you dispute (and you often should), add 5-15 days for negotiation." },
      { heading: "Day 20-30: Title Processing & Payment", content: "Once you accept the offer, the insurance company processes the title transfer. If there's a lien, the check goes to your lender first. Payoff takes 5-10 business days. Your portion is mailed or direct deposited." },
      { heading: "How to Speed It Up", content: "1. File your claim the same day as the accident.\n2. Respond to adjuster calls/emails within 24 hours.\n3. Have your title, registration, and loan payoff information ready.\n4. If disputing the offer, submit your comparable sales evidence within 48 hours of their offer.\n5. Ask for direct deposit instead of a mailed check." },
    ],
    faq: [
      { question: "How long does an insurance company have to settle a total loss claim in Texas?", answer: "Under Texas Insurance Code §542, insurers must acknowledge your claim within 15 business days and must accept or reject it within 15 business days after receiving all required documentation. Payment must be made within 5 business days of acceptance." },
      { question: "What if the insurance company is taking too long?", answer: "If the insurer exceeds the statutory deadlines, they may owe you 18% annual interest on the settlement amount plus reasonable attorney's fees. File a complaint with the Texas Department of Insurance (TDI) to escalate." },
    ],
    cta: { title: "Also Injured in the Accident?", description: "Your injury claim is separate from the vehicle claim — and often worth much more.", link: "/intake", label: "Free Injury Evaluation →" },
  },

  // ── Previously Empty — Now Full Content ──────────────────────────────────────
  "replacement-options": {
    title: "Total Loss Vehicle Replacement Options in Texas",
    metaDescription: "After a total loss, you need to replace your vehicle. Here's how to use your settlement wisely, avoid common traps, and get back on the road fast in Texas.",
    heroSubtitle: "Your settlement check is on the way. Here's how to replace your vehicle without getting burned again.",
    sections: [
      { heading: "How Much Will Your Settlement Actually Cover?", content: "Your total loss settlement pays the Actual Cash Value (ACV) of your vehicle before the accident — NOT the cost to replace it with a newer model. In most cases, depreciation means your settlement will be $3,000–$8,000 less than what a comparable replacement costs at a dealer today.\n\nBefore you start shopping, know exactly what you're working with. Get your settlement amount in writing, deduct your deductible, and subtract any outstanding loan balance." },
      { heading: "Option 1: Buy a Similar Used Vehicle", content: "The most financially sound option for most people. Use the same comparable listings you gathered during your ACV negotiation to identify fair-priced vehicles. Buying from a private seller typically saves $2,000–$4,000 over dealer pricing.\n\nTip: Take any used vehicle to an independent mechanic for a pre-purchase inspection ($100–$150). This is especially important if you're buying a vehicle with a history from an auction." },
      { heading: "Option 2: Lease or Finance a New Vehicle", content: "If your settlement covers the full down payment on a new vehicle, this can be a practical path — especially if rates are favorable. However, be cautious about rolling existing loan deficits into a new loan (negative equity stacking).\n\nAlways gap-insure any new vehicle if you're financing. Your first total loss taught you why." },
      { heading: "Option 3: Retain Your Totaled Vehicle", content: "Texas allows you to keep your totaled vehicle (see our Salvage Process guide). The insurance company deducts the salvage value from your settlement. You get a salvage title and can have the vehicle rebuilt. This can make financial sense if the vehicle is rare, sentimental, or if repairs are much cheaper than the salvage deduction." },
      { heading: "Option 4: Rent While You Decide", content: "Your policy may include rental reimbursement during the claims process. Once the claim is settled, rental coverage typically ends — even if you haven't bought a replacement yet. Plan ahead: have your replacement strategy ready before you accept the settlement." },
      { heading: "Beware of the Title Wash", content: "When shopping for replacement vehicles, always run the VIN through the National Motor Vehicle Title Information System (NMVTIS) or Carfax. Some sellers transport vehicles from states with less strict title branding laws to Texas to hide salvage or flood history." },
    ],
    faq: [
      { question: "Does Texas law require a rental car while my total loss claim is pending?", answer: "If you have rental reimbursement coverage on your policy, yes. If the accident was the other driver's fault, their liability insurance should provide a rental. If you were at fault and only have liability, you are not entitled to a rental under standard policies." },
      { question: "Can I use my total loss settlement to buy a new car?", answer: "Yes, your settlement is yours to use however you choose. However, if there's a lien on the vehicle, the check may go directly to your lender first, and you'll receive any remaining equity after the loan is paid off." },
      { question: "How do I avoid buying another totaled car?", answer: "Always check the vehicle's title history using Carfax, AutoCheck, or the NMVTIS database before buying. Look for 'salvage,' 'rebuilt,' or 'flood' on the title. In Texas, rebuilt title vehicles must be disclosed and can have reduced resale value and insurance complications." },
    ],
    cta: { title: "Were You Injured in the Accident?", description: "Your vehicle replacement is just one part of your recovery. If you were injured, you may be entitled to significantly more compensation.", link: "/intake", label: "Get a Free Injury Evaluation →" },
  },
  "inspection": {
    title: "Total Loss Vehicle Inspection: What Adjusters Look For in Texas",
    metaDescription: "Understand how Texas insurance adjusters inspect totaled vehicles and calculate ACV. Know what they're measuring — and what they often miss — before they write your offer.",
    heroSubtitle: "The adjuster's inspection determines your offer. Know exactly what they're measuring before they arrive.",
    sections: [
      { heading: "What Is a Total Loss Inspection?", content: "After an accident, an adjuster from your insurance company (or a third-party appraiser) physically inspects your vehicle to assess damage and determine the repair cost estimate. If the estimated repair cost exceeds the vehicle's Actual Cash Value (ACV), the vehicle is declared a total loss.\n\nIn Texas, the threshold is typically when repair costs reach or exceed 100% of ACV, though individual insurer policies may vary." },
      { heading: "What Adjusters Measure", content: "During the inspection, the adjuster will photograph and document:\n- All visible structural damage (frame, suspension, unibody)\n- Deployed airbags and safety system activation\n- Interior condition (seats, dash, headliner)\n- Tire condition and tread depth\n- Mechanical components (if accessible)\n- Pre-existing damage or prior repairs\n\nThis data feeds into their software (usually CCC ONE, Mitchell, or Audatex) to generate a repair estimate and condition score." },
      { heading: "What Adjusters Often Miss", content: "The most common errors in total loss inspections:\n\n1. Trim Level Mistakes: Adjusters frequently misidentify the trim (e.g., listing 'Base' instead of 'Sport' or 'Limited'). Higher trims add $1,500–$4,000 in value.\n2. Factory Options: Sunroof, heated seats, premium audio, adaptive cruise — factory-installed options that weren't standard on the base model often get ignored.\n3. Recent Maintenance: A $2,000 engine replacement done 6 months ago is not reflected in their valuation tool.\n4. Aftermarket Upgrades: Lift kits, custom wheels, performance exhaust — these add real value that adjusters skip." },
      { heading: "Your Right to Review the Report", content: "You have the right to request a copy of the full inspection report and the CCC ONE (or equivalent) valuation report. These documents are the foundation of their offer. Review them carefully for errors before responding to any settlement offer.\n\nIf you believe the inspection was inaccurate, you can hire an independent appraiser. Texas Insurance Code §542 supports your right to independent appraisal." },
      { heading: "Before the Adjuster Arrives", content: "Before the inspection (or immediately after if already done), document your vehicle yourself:\n- Photograph every panel, interior surface, option badge, and tire tread\n- Print your window sticker if still available (Monroney label shows factory options)\n- Gather all service records from the past 2 years\n- Take photos of your instrument cluster showing accurate mileage" },
    ],
    faq: [
      { question: "Can I disagree with the adjuster's inspection findings?", answer: "Yes. You have the right to dispute the inspection findings in writing. Request the full CCC ONE or Mitchell valuation report. If you believe it contains errors (wrong trim, missing options, incorrect mileage), document the corrections with evidence and submit a formal counter-offer." },
      { question: "What happens if I was not present for the inspection?", answer: "The inspection can proceed without you present. However, you should request a copy of the full inspection report and review it carefully before accepting any offer. You typically have a window to dispute before the offer expires." },
      { question: "Can I hire my own appraiser if I disagree with the inspection?", answer: "Yes. Texas Insurance Code allows for an independent appraisal process. If you and the insurer disagree on value, both sides can select an independent appraiser. The two appraisers then select an umpire to resolve any dispute. This is a formal process that can significantly increase your settlement." },
    ],
    cta: { title: "Need Help Reviewing Your Inspection Report?", description: "Our team can help you identify errors in your valuation before you accept a lowball offer.", link: "/intake", label: "Review My Case Free →" },
  },
  "diminished-value": {
    title: "Diminished Value Claims in Texas After an Accident",
    metaDescription: "If your car was damaged in an accident and repaired, it's worth less than before — even after perfect repairs. Learn how to file a diminished value claim in Texas.",
    heroSubtitle: "Your repaired car is worth thousands less than before the accident. Texas law entitles you to that difference.",
    sections: [
      { heading: "What Is Diminished Value?", content: "Diminished value (DV) is the reduction in your vehicle's market value that occurs simply because it has been in an accident — even after professional repairs. Buyers and dealers pay less for accident-history vehicles, and this measurable loss is a separate recoverable damage in Texas.\n\nThere are three types: Inherent DV (reduced value due to accident history), Repair-Related DV (due to substandard repairs), and Immediate DV (value lost the moment of the accident)." },
      { heading: "Who Can File a Diminished Value Claim in Texas?", content: "In Texas, you can only file a diminished value claim against the at-fault driver's insurance company — NOT your own. This means DV claims require the other driver to be at fault.\n\nIf you were at fault, you cannot file a DV claim under your own collision coverage (unless your policy specifically includes it, which is rare)." },
      { heading: "How Is Diminished Value Calculated?", content: "The most commonly used method (and the one insurers often use to lowball you) is the '17c formula' from State Farm v. Mabry. However, this formula is widely criticized for undervaluing claims.\n\nA more accurate approach uses a professional DV appraisal that compares market data for comparable vehicles with and without accident history. Professional diminished value appraisers typically charge $150–$350 for a written report." },
      { heading: "How to File a Diminished Value Claim", content: "1. Get your vehicle repaired first. DV is the residual loss after repairs.\n2. Obtain a professional DV appraisal from a certified appraiser.\n3. Run a Carfax or AutoCheck report showing the accident on your vehicle's history.\n4. Submit a formal demand letter to the at-fault driver's insurer with your appraisal and comparable dealer quotes.\n5. Texas law gives you up to 2 years to file a DV claim (statute of limitations for property damage)." },
      { heading: "What to Expect From the Insurance Company", content: "Insurers will resist DV claims because they are a direct loss of profit. Common tactics include offering the '17c formula' result (which is often 30-50% less than actual DV), claiming your vehicle is too old or high-mileage to experience meaningful diminished value, or delaying your claim hoping you give up.\n\nA personal injury attorney who handles property damage can negotiate or litigate your DV claim on contingency if the amount justifies it." },
    ],
    faq: [
      { question: "How much is a diminished value claim worth in Texas?", answer: "DV claims in Texas typically range from $500 to $8,000 depending on the vehicle's age, value, and severity of the accident. A 2-year-old luxury vehicle involved in a major collision can have DV of $5,000 or more. Older, high-mileage vehicles have less DV because buyers already apply a discount for age." },
      { question: "Can I file a diminished value claim on my own insurance?", answer: "In most cases, no. Texas personal auto policies do not include diminished value coverage on first-party (your own) claims. You must pursue DV from the at-fault driver's liability insurer." },
      { question: "Do I need an attorney for a diminished value claim?", answer: "For smaller claims ($500–$2,000), you can often negotiate directly with the at-fault insurer. For larger claims or if the insurer denies your claim, consulting a personal injury attorney who handles property damage claims is strongly recommended. Many work on contingency for DV claims." },
    ],
    cta: { title: "Were You Also Injured in the Accident?", description: "If the other driver was at fault and you were injured, your bodily injury claim likely dwarfs your DV claim. Get a free evaluation.", link: "/intake", label: "Free Case Evaluation →" },
  },
  "rental-car-rights": {
    title: "Rental Car Rights After a Total Loss in Texas",
    metaDescription: "When does your rental coverage end after a total loss in Texas? Know your rights, the timelines, and how to get the most from your rental coverage.",
    heroSubtitle: "Your rental car clock starts ticking the moment your car is totaled. Know exactly when it stops.",
    sections: [
      { heading: "When Does Rental Coverage Apply?", content: "Rental reimbursement works differently depending on whose insurance is paying:\n\nYour Own Insurance: If you have rental reimbursement endorsement on your policy, coverage starts after you file your claim and the vehicle is declared undrivable or a total loss. Your policy specifies a daily limit (typically $30–$50/day) and a maximum number of days.\n\nAt-Fault Driver's Insurance: If the other driver was at fault, their liability coverage should pay for your rental from the date of the accident until a reasonable time after your settlement is paid — regardless of your own coverage limits." },
      { heading: "When Does Rental Coverage End After a Total Loss?", content: "This is where most people get caught off guard.\n\nFor YOUR insurance: Rental coverage typically ends when the insurance company settles your total loss claim and pays you — not when you actually replace your vehicle. Once you cash that check, your rental obligation is considered fulfilled.\n\nFor AT-FAULT insurance: Coverage continues for a 'reasonable time' after settlement — typically 3-5 days to allow you to purchase a replacement. Courts have ruled that forcing you to return the rental the same day as settlement is unreasonable." },
      { heading: "Texas Law and Rental Entitlement", content: "Texas does not have a specific statute mandating rental coverage duration after total loss. However, the Texas Department of Insurance (TDI) guidelines and case law establish that insurers must provide reasonable rental coverage throughout the claims process.\n\n'Reasonable' in Texas means: from the date the vehicle is undrivable to a reasonable period after settlement — not just until the check is cut." },
      { heading: "What to Do If They Cut Your Rental Early", content: "Insurance companies often try to terminate rental coverage the moment they make a settlement offer — even before you've accepted it. This is a pressure tactic.\n\nYour rights:\n1. You are NOT required to return the rental just because they've made an offer.\n2. You can continue renting while negotiating the settlement amount.\n3. If the claims process is slow due to the insurer's delays, they are responsible for the rental costs during those delays.\n\nDocument all communication and keep all rental receipts. If they refuse to extend rental coverage during unreasonable delays, file a complaint with TDI." },
      { heading: "Maximizing Your Rental Coverage", content: "1. File your rental claim immediately — don't wait.\n2. Use an in-network rental agency if your insurer has one (often 20-30% cheaper, extending your coverage days).\n3. Use your own credit card for the rental — many premium credit cards include CDW insurance, saving you $15-30/day.\n4. If the at-fault insurer is providing the rental, you're entitled to a comparable vehicle class — not a downgrade." },
    ],
    faq: [
      { question: "How many days of rental car coverage do I get after a total loss in Texas?", answer: "Your own insurance policy specifies your rental limit (commonly 30 days). For at-fault claims, coverage should continue through the settlement process plus a reasonable replacement window. If the claims process takes more than 30 days due to insurer delays, you may be entitled to additional coverage." },
      { question: "What if I don't have rental coverage on my policy?", answer: "If the other driver was at fault, you can claim rental from their liability insurer regardless of your own coverage. If you were at fault and have no rental endorsement, you are responsible for rental costs out of pocket. Some credit cards include rental coverage as a perk worth reviewing." },
      { question: "Can the insurance company force me to return the rental car?", answer: "Not immediately upon making a settlement offer. You are entitled to keep the rental while you review their offer and for a reasonable time after acceptance to purchase a replacement. Typically 3-5 business days post-settlement is considered reasonable in Texas." },
    ],
    cta: { title: "Fighting for Your Full Rights?", description: "Insurance companies count on you not knowing your rights. Our team is here to help you get every dollar you're owed.", link: "/intake", label: "Get Free Help →" },
  },

  // ── Migrated From Series A ────────────────────────────────────────────────────
  "ccc-valuation-gap": {
    title: "The CCC Gap: Why Your Total Loss Offer Is $4,000 Low",
    metaDescription: "Discover why Geico, State Farm, and Progressive use biased CCC One algorithms to underpay Texas total loss claims. Audit your ACV now and fight back.",
    heroSubtitle: "Texas law requires 'Fair Market Value.' Insurance companies use a biased algorithm called CCC One to pay you less. Here's the gap they don't want you to see.",
    sections: [
      { heading: "What Is CCC One and Why Should You Care?", content: "CCC One (Casualty Claims Consulting) is the software platform that Geico, State Farm, Progressive, Allstate, and most major insurers use to calculate what your totaled car is 'worth.' It's proprietary, algorithm-driven, and it has a structural bias toward lower valuations.\n\nThe software pulls comparable vehicle listings, but applies 'condition adjustments' downward that are often not justified. It also frequently uses comparable vehicles from distant markets where prices are lower, rather than your local Texas market." },
      { heading: "The Trim Level Trap", content: "The single most common and lucrative error in CCC One reports is trim level misidentification. Here's how it plays out:\n\nYour vehicle: 2019 Toyota Camry XSE V6. Retail value: $24,500.\nAdjuster plugs in: 2019 Toyota Camry LE. Retail value: $20,200.\n\nThat's a $4,300 discrepancy before any other adjustments. And it happens constantly on Sport, Limited, Premium, and Luxury trim vehicles. The fix is simple: your VIN decodes your exact trim. Make sure the report shows the right one." },
      { heading: "How to Audit Your CCC One Report", content: "Request a copy of the full valuation report from your adjuster. You're legally entitled to it. When you receive it, verify:\n\n1. The trim level exactly matches your VIN decode (use NHTSA's free VIN decoder at vpic.nhtsa.dot.gov)\n2. The comparable vehicles are within 100 miles of your ZIP code\n3. The comparable vehicles match your trim level — not a base model\n4. The 'condition adjustment' applied is reasonable — any single deduction over $500 requires written justification\n5. The odometer reading used is accurate" },
      { heading: "The 'Metal vs. Mental' Pivot", content: "Here's the most important thing to understand about your claim: your vehicle is the smallest part of your total losses.\n\nWhile the insurance company is computing scrap values based on the metal in your car, they are ignoring the real cost of the collision: your physical recovery, time lost from work, pain and suffering, and the documented medical evidence that determines your true settlement value.\n\nThe CCC Gap fight is worth having — but it's a $2,000–$4,000 dispute. Your injury claim, documented correctly, could be $10,000–$100,000." },
    ],
    faq: [
      { question: "What is CCC One and how does it affect my total loss settlement?", answer: "CCC One is a third-party valuation software used by most major auto insurers to calculate the Actual Cash Value (ACV) of totaled vehicles. It frequently undervalues vehicles by using incorrect trim levels, distant market comparables, and excessive condition adjustments. You have the right to challenge any CCC One report with your own market data." },
      { question: "How do I find out what my correct trim level is?", answer: "Your VIN contains your exact trim level. Use the free NHTSA VIN decoder at vpic.nhtsa.dot.gov and enter your 17-digit VIN. It will show the exact factory configuration of your vehicle. Compare this to what CCC One reports, and dispute any discrepancy in writing." },
      { question: "Is it worth fighting a $3,000 ACV dispute?", answer: "Yes. Most adjusters are authorized to increase offers without escalation for well-documented disputes. Submitting 3-5 comparable listings at the correct trim, plus documentation of vehicle condition, resolves the majority of ACV disputes within 5-10 business days. The cost is zero. The upside is $2,000–$4,000." },
    ],
    cta: { title: "Upload Your Photos for a Free ACV Reality Check", description: "Our AI analyzes your damage, identifies your trim level, and shows you what CCC One missed — in 60 seconds.", link: "/quiz", label: "Run My ACV Audit →" },
  },
  "copart-anxiety": {
    title: "Copart Anxiety: What To Do the Moment Your Car Is Towed to the Yard",
    metaDescription: "Your car was towed to Copart or IAA after a Texas accident. Don't sign anything. Here's the survival checklist for the first 72 hours — and why the clock matters.",
    heroSubtitle: "Your car is at Copart or IAA. The insurance company has already calculated your underpayment. Here's what to do in the first 72 hours.",
    sections: [
      { heading: "Why the Tow to Copart Is a Psychological Move", content: "When an insurance company moves your vehicle from the accident scene or local impound to a Copart or IAA salvage yard, it feels final. That's intentional. The moment your car is behind those gates, most claimants feel they've lost the case before it even starts.\n\nStorage fees at local impound lots compound daily by Texas law. By moving your vehicle to Copart, the insurer stops the impound bleeding — and starts their own clock. They want you to feel urgency to settle. That urgency is worth thousands of dollars to them." },
      { heading: "The Tow Truck Reality Check", content: "Within 48 to 72 hours of a significant accident in Dallas, Houston, or San Antonio, your vehicle will likely be at a Copart lot. Most people don't know this is happening until they try to call the original impound lot and get redirected.\n\nAs soon as the vehicle moves, two things begin: storage fees compound at the new facility, and the insurance company initiates their valuation process using the vehicle at the yard — not the vehicle you were driving." },
      { heading: "The #1 Mistake: Signing the Title Release Early", content: "The most costly error total loss victims make is signing the Title Release or Power of Attorney before reviewing their settlement offer in full.\n\nOnce you sign, you are functionally agreeing to their valuation. You have surrendered your leverage. The insurance company knows this. That's why they'll call you within days of the tow with paperwork ready to go.\n\nDo NOT sign until you have:\n- Received the full CCC One or Mitchell valuation report\n- Verified your trim level and options are correctly captured\n- Compared their offer to at least 3 dealer listings for comparable vehicles" },
      { heading: "The Copart Survival Checklist", content: "Do this immediately:\n\n1. Go to the yard and document your vehicle. Take timestamped photos and video of every panel, interior surface, steering wheel, dash, odometer, and any upgrades (new tires, premium audio, leather condition). Storage at Copart can deteriorate vehicles quickly.\n\n2. Remove your personal items. Registration, insurance card, toll tags, personal documents, charging cables, child seats. Call the yard for access hours. Bring a government ID.\n\n3. Request your police report. This establishes fault. You'll need it.\n\n4. Do NOT call the other driver's insurance company back yet. Record every incoming call but do not provide recorded statements until you know what you're dealing with." },
      { heading: "Audit the Mental, Not Just the Metal", content: "This is the most important concept in your claim:\n\nWhile the insurance company is auditing the scrap value of your vehicle at the Copart yard, who is auditing the value of your recovery?\n\nThe 'Copart Anxiety' isn't just about the car. It's a symptom. You were just in a traumatic event. Your nervous system is in crisis mode. Insurance adjusters are trained to contact you while you're in this state because you're more likely to settle fast.\n\nThe neck stiffness you're feeling three days after the accident? That's a clinical symptom with real settlement value. Document it now. A personal injury attorney can connect you with treatment — at zero upfront cost — while they negotiate your full case value." },
    ],
    faq: [
      { question: "What should I do if my car is at Copart and I haven't been contacted by insurance yet?", answer: "Call your insurance company immediately to file the claim. Get the claim number and ask for the assigned adjuster's direct contact. Ask specifically when the vehicle will be inspected. Do NOT go to Copart and sign any paperwork without reviewing your settlement offer first." },
      { question: "How long do I have before Copart charges storage fees?", answer: "Copart typically begins charging storage fees after a 10-day grace period. However, during an active insurance claim, the insurer is responsible for these fees. Keep a record of when the vehicle was towed and all dates of communication with the insurer." },
      { question: "Can I retrieve my personal items from Copart even before the claim is settled?", answer: "Yes. You have the right to remove personal belongings from your vehicle at any time during the claim. Call the specific Copart facility, bring a government-issued ID, and be prepared to sign a release for access. Do not sign anything that relinquishes your claim rights." },
    ],
    cta: { title: "Don't Fight This Alone", description: "You're 72 hours into a process the insurance company has perfected over decades. Get equally prepared.", link: "/intake", label: "Protect My Case — Free →" },
  },
  "recovery-journal": {
    title: "The Recovery Journal: The Hidden Multiplier for Your PI Claim",
    metaDescription: "Learn why documenting your post-accident pain and recovery daily is the highest-value action you can take for your Texas personal injury settlement.",
    heroSubtitle: "Insurance adjusters are trained to exploit gaps in your story. A daily recovery journal eliminates every gap.",
    sections: [
      { heading: "The Gap Between Pain and Proof", content: "An insurance adjuster is a professional listener. They'll call you two or three days after the crash with a friendly, sympathetic tone: 'How are you feeling today? Any pain?'\n\nIf you say, 'I'm okay, just a little sore,' they've already won. That single sentence is recorded and used three months from now to justify a $1,500 nuisance settlement.\n\nThe problem isn't that you aren't in pain — it's that you don't have proof." },
      { heading: "Why Personal Injury Lawyers Need Your Help", content: "A top-tier PI lawyer in Texas can negotiate a $50,000 settlement. But they can only fight with the evidence they have on the table. If they only have the police report and a single ER bill, they are fighting with one hand tied behind their back.\n\nThe largest settlements aren't just about the crash. They are about the impact on your life. Every day you don't document is a day the insurance company can claim you were fine." },
      { heading: "The Hidden Multiplier: Clinical Precision", content: "Most people try to remember how they felt three months later during a deposition. They guess. They generalize. 'My back hurt a lot in February.'\n\nA daily log increases settlement value because it eliminates the Gap of Doubt.\n\nWhen you have a Recovery Journal, you don't say 'it hurt a lot.' You say:\n- Feb 14: 7/10 pain. Could not lift my 2-year-old. Missed work because I couldn't sit for 4 hours.\n- Feb 22: 4/10 pain. Slept for only 3 hours due to shooting pain in the left shoulder.\n\nNo adjuster can argue with daily, timestamped clinical data." },
      { heading: "What to Document Every Day", content: "For maximum settlement impact, your Recovery Journal should include:\n\nPhysical Symptoms: Pain location, intensity (1-10 scale), duration, what makes it worse/better\n\nFunctional Limitations: Activities you cannot do or must modify (driving, lifting, exercise, work tasks, household chores, parenting activities)\n\nMedical Appointments: Date, provider, what was treated, prescribed medications, follow-up instructions\n\nMissed Work: Dates, hours missed, estimated income loss (an employer verification letter matters here)\n\nEmotional Impact: Sleep disturbance, anxiety about driving, changes in mood or relationships" },
      { heading: "When to Stop and See a Doctor", content: "Regardless of whether you feel okay, you should see a doctor within 72 hours of any accident that triggered airbag deployment, significant impact force, or any symptom of injury — including headache, neck stiffness, back pain, or dizziness.\n\nInsurance companies use gaps in medical treatment as their primary defense: 'If you were really hurt, you would have seen a doctor.' A personal injury attorney can connect you with qualified medical professionals who treat accident victims on a lien — meaning zero upfront cost to you.\n\nDon't let a reluctance to bother your doctor cost you your settlement." },
    ],
    faq: [
      { question: "How does a recovery journal increase my settlement value?", answer: "A daily log creates a documented, timestamped record of your symptoms and functional limitations that insurance adjusters cannot argue with. It eliminates 'gaps' in your history that insurers use to minimize claims, and it gives your attorney a precise clinical timeline to present to a jury or mediator." },
      { question: "What if I forget to document for several days?", answer: "Start documenting as soon as you remember. A journal that starts on day 5 and continues consistently is still far more valuable than no documentation. For the missing days, write out your best recollection (even approximate) and mark them as retroactive entries." },
      { question: "Can I use my phone notes or a Google Doc as a recovery journal?", answer: "Yes, any timestamped digital format works — phone notes, Google Docs, a dedicated app. The key is consistency and timestamps. A printed or typed journal also works. Your attorney will advise you on format when you connect with one." },
    ],
    cta: { title: "Connect With a Texas PI Attorney Today", description: "An attorney can connect you with medical care at zero upfront cost, and help document your case correctly from day one.", link: "/intake", label: "Start My Case — Free →" },
  },
};

// Fallback for future topics
const FALLBACK: TopicData = {
  title: "Total Loss Guide",
  metaDescription: "Texas total loss information and resources from TexasTotalLoss.com",
  heroSubtitle: "Expert guidance for your total loss situation.",
  sections: [{ heading: "Coming Soon", content: "This guide is being written by our claims specialists. Check back soon for comprehensive coverage of this topic." }],
  faq: [],
  cta: { title: "Need Help Now?", description: "Get connected with the right resources for your situation.", link: "/intake", label: "Get Free Help →" },
};

export async function generateStaticParams() {
  return Object.keys(TOPIC_CONTENT).map((slug) => ({ topic: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const data = TOPIC_CONTENT[topic] || FALLBACK;
  return {
    title: `${data.title} | TexasTotalLoss.com`,
    description: data.metaDescription,
    openGraph: { title: data.title, description: data.metaDescription, url: `https://www.texastotalloss.com/total-loss/${topic}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const data = TOPIC_CONTENT[topic] || FALLBACK;

  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/total-loss" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none" }}>
              ← All Guides
            </Link>
            <Link href="/intake" className="btn btn-primary btn-sm">Free Evaluation →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ minHeight: "40vh" }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "5rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div className="hero-eyebrow">📖 Texas Total Loss Guide</div>
            <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              {data.title}
            </h1>
            <p className="hero-subtitle" style={{ margin: "0 auto" }}>
              {data.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: "780px" }}>
          {data.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
                {section.heading}
              </h2>
              {section.content.split("\n\n").map((paragraph, j) => (
                <p key={j} style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {/* FAQ Section */}
          {data.faq.length > 0 && (
            <div style={{ marginTop: "3rem", borderTop: "1px solid var(--surface-border)", paddingTop: "2rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>
              {data.faq.map((item, i) => (
                <div key={i} className="card" style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="card" style={{ textAlign: "center", marginTop: "3rem", padding: "2.5rem" }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: "0.75rem" }}>{data.cta.title}</h2>
            <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>{data.cta.description}</p>
            <Link href={data.cta.link} className="btn btn-primary">{data.cta.label}</Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      {data.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: data.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
    </main>
  );
}
