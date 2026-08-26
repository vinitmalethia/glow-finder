import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function IngredientsPage({ onAddToCart }) {
  const [selectedActive, setSelectedActive] = useState(0);

  const actives = [
    {
      name: "Alpha Arbutin",
      percentage: "2%",
      tagline: "Dark Spot & Hyperpigmentation Corrector",
      description: "Targets hyperpigmentation and dark spots to reveal a clearer, more radiant complexion.",
      image: "/assets/alpha-arbutin-exact.png",
      benefits: [
        "Inhibits melanin synthesis at the cellular level",
        "Reduces stubborn sun spots, age spots & acne scarring",
        "Gentler alternative to harsh hydroquinone",
        "Evens out skin tone for glass-like clarity"
      ]
    },
    {
      name: "Niacinamide",
      percentage: "5%",
      tagline: "Pore Minimizer & Barrier Reinforcer",
      description: "Reduces redness, controls excess oil, minimizes pores, and strengthens the skin barrier.",
      image: "/assets/niacinamide.jpg",
      benefits: [
        "Controls sebum production to prevent breakouts",
        "Visible pore refinement in 14 days",
        "Stimulates ceramide synthesis for barrier health",
        "Soothes redness and post-inflammatory erythema"
      ]
    },
    {
      name: "Ascorbic Acid",
      percentage: "3%",
      tagline: "Radiance & Collagen Booster",
      description: "A potent antioxidant that brightens skin, boosts collagen, and protects against environmental damage.",
      image: "/assets/ascorbic-acid-exact.png",
      benefits: [
        "Neutralizes free radicals from UV & pollution",
        "Stimulates natural skin collagen synthesis",
        "Restores healthy luminous radiance to dull skin",
        "Enhanced ethylated ascorbic acid for maximum stability"
      ]
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-glow-orange font-bold text-xs uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            TRI-ACTIVE SYNERGY FORMULA
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy tracking-tight">
            Why is this different ?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Unlike single-ingredient serums, Glow Finder combines three clinically proven actives in precise dermatological ratios for maximum efficacy without irritation.
          </p>
        </div>

        {/* Interactive 3 Callouts Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAFCFF] p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          
          {/* Active Selectors Column */}
          <div className="lg:col-span-7 space-y-4">
            {actives.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedActive(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  selectedActive === idx
                    ? 'bg-white border-glow-orange shadow-lg ring-2 ring-glow-orange/20 scale-101'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white bg-glow-orange px-3 py-1 rounded-full shadow-xs">
                      {item.percentage}
                    </span>
                    <h3 className="text-xl font-bold text-glow-navy">{item.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    Click to view science
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Product Center Bottle Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={actives[selectedActive].image}
                alt={actives[selectedActive].name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {actives[selectedActive].percentage} Concentration
                </span>
                <h4 className="text-lg font-extrabold">{actives[selectedActive].name}</h4>
              </div>
            </div>

            <button
              onClick={onAddToCart}
              className="w-full max-w-sm py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm rounded-xl shadow-glow-soft hover:shadow-lg transition-all cursor-pointer"
            >
              ADD TO BAG (₹559)
            </button>
          </div>

        </div>

        {/* Benefits Breakdown List */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card-soft">
          <h3 className="text-2xl font-extrabold text-glow-navy mb-6 text-center">
            Detailed Mechanisms of {actives[selectedActive].name} ({actives[selectedActive].percentage})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actives[selectedActive].benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-glow-orange shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
