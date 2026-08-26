import React from 'react';
import { ShieldCheck, Leaf, Sparkles, CheckCircle, Info } from 'lucide-react';

export default function AboutPage({ onAddToCart }) {
  const inciList = [
    { name: "Aqua (Purified Water)", category: "Base Solvent", desc: "Provides essential hydration and serves as the clean vehicle for active delivery." },
    { name: "Vitamin C EAA (3% Ascorbic Acid)", category: "Active Antioxidant", desc: "Potent ethyl ascorbic acid derivative that brightens dull skin and boosts collagen." },
    { name: "Niacinamide (5% Vitamin B3)", category: "Active Restorative", desc: "Strengthens skin barrier, minimizes pores, and balances oil production." },
    { name: "Alpha Arbutin (2%)", category: "Active Brightener", desc: "Inhibits tyrosinase enzymes to fade dark spots and hyperpigmentation." },
    { name: "Hyaluronic Acid", category: "Humectant", desc: "Attracts up to 1,000x its weight in water to plump and deeply hydrate skin cells." },
    { name: "Extract Aloevera WS", category: "Botanical Soother", desc: "Calms inflammation, reduces redness, and soothes sensitive skin." },
    { name: "Allantoin", category: "Skin Conditioning", desc: "Promotes skin healing and cell turnover for a smoother surface." },
    { name: "Glycerin & PG", category: "Hydrators", desc: "Locks in moisture and prevents trans-epidermal water loss." },
    { name: "Amaze XT", category: "Texture Enhancer", desc: "Delivers a silky, non-sticky gel texture upon application." },
    { name: "Euxyl K510 & Phenoxyethanol", category: "Clean Preservative", desc: "Ensures formula safety, freshness, and stability without parabens." },
    { name: "Beusil AMO 918 EM & Credo FM GGL", category: "Emulsion Matrix", desc: "Stabilizes active ingredients for optimal shelf stability." },
    { name: "IFRA Certified Safe Fragrance", category: "Safe Aroma", desc: "Dermatologically tested, hypo-allergenic scent at safe usage thresholds." }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Philosophy Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-glow-orange font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              CLEAN SKINCARE INNOVATION
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy leading-tight tracking-tight">
              Why Choose <span className="text-glow-orange">Glow Finder:</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Glow Finder blends modern dermatological science with clean skincare innovation. Each formula is dermatologist-tested, cruelty-free, and crafted to bring visible, long-lasting glow using effective, gentle ingredients.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-6 h-6 text-glow-orange shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-glow-navy">Dermatologist Tested</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Leaf className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-glow-navy">Clean & Safe Formula</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onAddToCart}
                className="px-8 py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm tracking-wide rounded-xl shadow-glow-soft hover:shadow-lg transition-all"
              >
                TRY GLOW FINDER TODAY
              </button>
            </div>
          </div>

          {/* Right Column: Clean Ultra-HD Product Presentation (No Grey Parts) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50 bg-white p-6 flex items-center justify-center">
              <img
                src="/assets/product-hd-clean.jpg"
                alt="Glow Finder TriActive Serum Box and Bottle"
                className="w-full h-auto max-h-[460px] object-contain rounded-2xl"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-glow-navy shadow-sm flex items-center gap-1.5 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-green-500" />
                TriActive Formula
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Full INCI Ingredients Breakdown */}
        <div className="bg-[#FAFCFF] rounded-3xl p-8 lg:p-12 border border-slate-200/80 shadow-sm space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-glow-blue-tag-text bg-glow-blue-tag px-3 py-1 rounded-full">
              <Info className="w-3.5 h-3.5" /> 100% FORMULA TRANSPARENCY
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-glow-navy">
              The Ingredients:
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Aqua, EDTA, Allantion, Amaze XT, Glycerin, PG, EXTRACT ALOEVERA WS, Euxyl K510, Phenoxyethanol, Hyaluronic Acid, Vitamin C EAA, Niacinamide, Alpha Arbutin, Beusil AMO 918 EM, Credo FM GGL, IFRA Certified Safe Fragrance.
            </p>
          </div>

          {/* INCI Detailed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {inciList.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-amber-200 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-glow-orange uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <h4 className="text-sm font-bold text-glow-navy mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
