import React from 'react';
import { Sparkles, Sun, Droplet, Shield, Flame, CheckCircle, ArrowRight } from 'lucide-react';

export default function BenefitsPage({ onAddToCart }) {
  const keyBenefits = [
    {
      icon: Sun,
      title: "Brightens dull skin and evens out uneven tone",
      detail: "Formulated with 3% Ascorbic Acid (Vitamin C) to illuminate tired, hyperpigmented skin and bring back a glowing, vibrant complexional radiance."
    },
    {
      icon: Droplet,
      title: "Fades dark spots, blemishes, and sun damage",
      detail: "2% Alpha Arbutin specifically targets melanin clusters, fading stubborn acne scars, sun damage, and age spots naturally over time."
    },
    {
      icon: Shield,
      title: "Improves skin texture and minimizes enlarged pores",
      detail: "5% Niacinamide tightens enlarged pore walls, smooths coarse texture, and regulates sebum for a flawless glass-skin finish."
    },
    {
      icon: Flame,
      title: "Boosts collagen production for firmer, smoother skin",
      detail: "Stimulates structural skin proteins to improve elasticity, softening fine lines and enhancing youthfulness."
    },
    {
      icon: Sparkles,
      title: "Lightweight and non-sticky formula ideal for daily use",
      detail: "Absorbs instantly into skin layers with zero greasy residue, rendering it perfect under sunscreen and makeup."
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-glow-orange font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            CLINICALLY PROVEN RESULTS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy tracking-tight">
            Key Benefits
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Discover how Glow Finder TriActive Brightening Serum transforms skin texture, tone, and clarity step by step.
          </p>
        </div>

        {/* Main Grid Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 5 Benefits Cards */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {keyBenefits.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-100 bg-[#FAFCFF] hover:bg-white hover:border-amber-200 hover:shadow-lg transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-glow-orange shrink-0 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-glow-navy group-hover:text-glow-orange transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {b.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 bg-white">
              <img
                src="/assets/bottle-standalone.jpg"
                alt="Glow Finder Bottle Key Benefits"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-glow-navy shadow-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% Non-Sticky
              </div>
            </div>

            <button
              onClick={onAddToCart}
              className="w-full py-4 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-base rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>CLAIM YOUR BOTTLE NOW</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
