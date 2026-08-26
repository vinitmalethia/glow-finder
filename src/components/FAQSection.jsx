import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How soon can I expect results from Glow Finder TriActive Serum?",
      a: "Most customers notice an increase in skin hydration and glow within 3-5 days. Visible reduction in dark spots, acne marks, and uneven tone typically shows within 2 to 4 weeks of daily morning & night application."
    },
    {
      q: "Can I use this serum if I have sensitive or acne-prone skin?",
      a: "Yes! Glow Finder TriActive is dermatologically tested, non-comedogenic, and paraben/sulfate-free. Niacinamide actively soothes inflammation while Ascorbic Acid & Alpha Arbutin gently brighten without irritation."
    },
    {
      q: "How do I layer this serum in my daily skincare routine?",
      a: "Apply 2–3 drops to freshly cleansed face & neck before moisturizer. Use both morning and evening. For daytime use, always follow up with a broad-spectrum sunscreen (SPF 30+)."
    },
    {
      q: "What if my serum slightly changes color over time?",
      a: "Due to the active photochemical formulation (Vitamin C & Alpha Arbutin), the serum may tend to slightly change color over time upon exposure to air. However, the product's clinical efficacy and safety remain completely unchanged."
    },
    {
      q: "Is Glow Finder cruelty-free and vegan?",
      a: "100% yes! We never test on animals, and our clean formula contains zero animal-derived ingredients."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-[#FAFCFF] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-glow-orange" />
          FREQUENTLY ASKED QUESTIONS
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-glow-navy tracking-tight mb-10">
          Everything You Need to Know
        </h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left font-bold text-slate-800 hover:text-glow-navy transition-colors"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180 text-glow-orange' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100/60 mt-1 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
