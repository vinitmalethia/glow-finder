import React from 'react';
import { Sparkles, Sun, Moon, ArrowDown, CheckCircle2, Clock, AlertCircle, Droplets } from 'lucide-react';

export default function RoutinePage({ onAddToCart }) {
  const steps = [
    {
      number: "01",
      title: "Cleanser",
      subtitle: "Purify & Prep",
      description: "Start with a gentle hydrating cleanser to remove surface dirt, oil, and impurities without stripping your natural moisture barrier.",
      highlight: false,
    },
    {
      number: "02",
      title: "Toner",
      subtitle: "Balance pH",
      description: "Apply a balancing toner to restore skin pH and prepare pores for optimal absorption of high-potency actives.",
      highlight: false,
    },
    {
      number: "03",
      title: "Serum",
      brand: "Glow Finder™ TriActive",
      subtitle: "Targeted Brightening Treatment",
      description: "Dispense 2–3 drops of Glow Finder TriActive Serum onto cleansed face & neck. Use morning & evening before moisturizer.",
      highlight: true,
    },
    {
      number: "04",
      title: "Sunscreen / Moisturizer",
      subtitle: "Lock & Protect",
      description: "Seal in active ingredients with your favorite light moisturizer. Always follow with sunscreen in daytime.",
      highlight: false,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-glow-orange font-bold text-xs uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            OPTIMAL SKINCARE SEQUENCE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy tracking-tight">
            Where does this fit in your routine ?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Layering your skincare correctly unlocks maximum potency. Follow our dermatologist-approved 4-step routine for glass-skin radiance.
          </p>
        </div>

        {/* Routine Flowchart & Infographic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive 4 Steps Flowchart Timeline */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5 ${
                    step.highlight
                      ? 'bg-gradient-to-r from-[#FFF7ED] via-[#FFF5EB] to-white border-glow-orange shadow-md ring-2 ring-glow-orange/30'
                      : 'bg-[#FAFCFF] border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {/* Step Number Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                      step.highlight
                        ? 'bg-glow-orange text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-extrabold text-glow-navy">{step.title}</h3>
                      {step.brand && (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-glow-orange text-white px-2.5 py-0.5 rounded-full">
                          {step.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-glow-orange uppercase tracking-wide">
                      {step.subtitle}
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-0.5">
                      {step.description}
                    </p>
                  </div>

                  {/* Right Action for Highlighted Serum */}
                  {step.highlight && (
                    <div className="sm:pl-3 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={onAddToCart}
                        className="w-full sm:w-auto px-5 py-2.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  )}
                </div>

                {/* Connecting Down Arrow */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-1.5 text-slate-300">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Right Column: Routine Infographic Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50 bg-white">
              <img
                src="/assets/routine-infographic.jpg"
                alt="Where does this fit in your routine infographic"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

        </div>

        {/* How to Use & Formulation Disclaimer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAFCFF] p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          
          {/* Left Column: Official Infographic Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white">
              <img
                src="/assets/how-to-use-infographic.jpg"
                alt="How to Use and Disclaimer Infographic"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Column: Detailed Breakdown Cards */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* How to Use Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-glow-orange">
                <Droplets className="w-5 h-5" />
                <h3 className="text-lg font-bold text-glow-navy">How to Use:</h3>
              </div>
              <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                Apply 2–3 drops on cleansed face & neck. Use morning & evening before moisturizer. Always follow with sunscreen in daytime.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Fast absorption • 0% greasy residue</span>
              </div>
            </div>

            {/* Disclaimer Notice Card */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-5 h-5 text-glow-orange shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Disclaimer:</h3>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                Photochemical formulation may tend to change color over time, However, the product’s efficacy remains unchanged.
              </p>
            </div>

          </div>

        </div>

        {/* Morning & Night Usage Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          <div className="p-8 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-glow-navy">Morning Routine (AM)</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Apply Glow Finder Serum after cleansing and toning. The Vitamin C and Niacinamide antioxidant blend shields skin from free radicals and environmental stress throughout the day. Always finish with SPF 30+.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Night Routine (PM)</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Apply before bedtime to support skin cellular repair while you sleep. Alpha Arbutin actively works overnight to target dark spots and restore smooth, luminous texture by morning.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
