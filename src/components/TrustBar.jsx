import React from 'react';

export default function TrustBar() {
  return (
    <section className="py-7 bg-white border-y border-slate-100/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center">
          
          {/* Item 1: Dermatologically Tested */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.31a2 2 0 0 1-.37 1.17L4.35 18a2 2 0 0 0 1.65 3h12a2 2 0 0 0 1.65-3l-5.28-7.52A2 2 0 0 1 14 9.31V2" />
                <path d="M8.5 2h7" />
                <path d="M14 9.3a6.5 6.5 0 0 0-4 0" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                Dermatologically Tested
              </h4>
              <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                Safe & gentle on skin
              </span>
            </div>
          </div>

          {/* Item 2: Clean & Safe Formula */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 4 13C4 7 11 2 20 2c0 9-5 16-11 16a7 7 0 0 1-2-.28" />
                <path d="M20 2c-4 5-8 10-15 15" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                Clean & Safe Formula
              </h4>
              <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                Paraben & Sulfate Free
              </span>
            </div>
          </div>

          {/* Item 3: Suitable For All Skin Types */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 9.5a1 1 0 1 0 0 .01" />
                <path d="M15.5 9.5a1 1 0 1 0 0 .01" />
                <path d="M9 15c1 1.2 2 1.5 3 1.5s2-.3 3-1.5" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                Suitable For All Skin Types
              </h4>
              <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                Even for sensitive skin
              </span>
            </div>
          </div>

          {/* Item 4: Cruelty Free (Bunny) */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 5a2 2 0 0 1 4 0v4a2 2 0 0 1-4 0V5z" />
                <path d="M6 8a2 2 0 0 1 4 0v2a2 2 0 0 1-4 0V8z" />
                <path d="M14 10a5 5 0 0 1 5 5c0 3-2 5-6 5s-6-2-6-5a5 5 0 0 1 7-4.5" />
                <circle cx="15.5" cy="14.5" r="0.8" fill="currentColor" />
                <path d="M18 16c1 .5 2 0 2-1" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                Cruelty Free
              </h4>
              <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                Not tested on animals
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
