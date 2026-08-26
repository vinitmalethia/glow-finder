import React, { useState } from 'react';
import { ArrowRight, Sun, Sparkles, Droplets } from 'lucide-react';

export default function Hero({ onAddToCart }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#F2F7FD] via-[#F8FAFC] to-white pt-6 pb-12 sm:pb-16 lg:py-16">
      
      {/* Background Water Caustics Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/70 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[520px]">
          
          {/* =========================================================================
              LEFT COLUMN — STAGGERED REVEAL CONTENT & CALL TO ACTIONS
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* 1. Tag Badge (Fades in first) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E5] border border-[#FEE0C8] text-[#E67A18] font-bold text-xs uppercase tracking-wider shadow-2xs animate-fade-in opacity-0">
              NEW & IMPROVED
            </div>

            {/* 2 & 3. Main Headline (Staggered slide-up) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-glow-navy leading-[1.12] tracking-tight">
              <span className="inline-block animate-reveal-up delay-100 opacity-0">
                Find Your Glow.
              </span>
              <br />
              <span className="inline-block text-glow-navy animate-reveal-up delay-200 opacity-0">
                Every Day.
              </span>
            </h1>

            {/* 4. Product Subtitle (Fades in) */}
            <p className="text-glow-slate text-base sm:text-lg max-w-lg leading-relaxed font-normal animate-fade-in delay-350 opacity-0">
              Glow Finder TriActive Brightening Serum is formulated to brighten, even skin tone, and reveal your natural radiance.
            </p>

            {/* 5. 3 Key Benefits Icons Grid (Staggered reveal one-by-one) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2 pb-2">
              
              {/* Benefit 1: Brightens Skin (Delay 500ms) */}
              <div className="flex flex-col items-start gap-1 animate-reveal-up delay-500 opacity-0">
                <div className="w-8 h-8 flex items-center justify-center text-slate-800 mb-1">
                  <svg className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Brightens Skin
                </span>
                <span className="text-[11px] sm:text-xs text-glow-slate leading-snug">
                  Enhances natural <br className="hidden sm:inline" />radiance
                </span>
              </div>

              {/* Benefit 2: Fights Acne (Delay 650ms) */}
              <div className="flex flex-col items-start gap-1 animate-reveal-up delay-650 opacity-0">
                <div className="w-8 h-8 flex items-center justify-center text-slate-800 mb-1">
                  <svg className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 10h.01" />
                    <path d="M15 10h.01" />
                    <path d="M9.5 15.5c1.33 1 3.67 1 5 0" />
                    <path d="M17 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none" opacity="0.8" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Fights Acne
                </span>
                <span className="text-[11px] sm:text-xs text-glow-slate leading-snug">
                  Helps reduce <br className="hidden sm:inline" />breakouts
                </span>
              </div>

              {/* Benefit 3: Fades Dark Spots (Delay 800ms) */}
              <div className="flex flex-col items-start gap-1 animate-reveal-up delay-800 opacity-0">
                <div className="w-8 h-8 flex items-center justify-center text-slate-800 mb-1">
                  <svg className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Fades Dark Spots
                </span>
                <span className="text-[11px] sm:text-xs text-glow-slate leading-snug">
                  Evens tone & reduces <br className="hidden sm:inline" />pigmentation
                </span>
              </div>

            </div>

            {/* 6. Action Buttons (Appear last at 950ms) */}
            <div className="flex flex-wrap items-center gap-5 pt-2 animate-reveal-up delay-950 opacity-0">
              <button
                onClick={onAddToCart}
                className="px-7 py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm tracking-wide rounded-xl shadow-glow-soft hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href="#ingredients"
                className="px-4 py-3.5 text-glow-navy font-bold text-sm tracking-wide hover:text-glow-orange transition-colors flex items-center gap-2 group"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4 text-glow-navy group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN — LUXURY PRODUCT SHOWCASE WITH INTERACTIVE AMBIANCE
             ========================================================================= */}
          <div
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0 cursor-default select-none"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* 8. Interactive Cursor-Following Soft Ambient Glow */}
            <div
              className="absolute -inset-12 pointer-events-none transition-opacity duration-700 ease-out filter blur-2xl z-0"
              style={{
                opacity: isHovered ? 0.9 : 0.45,
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(251, 191, 36, 0.16) 0%, rgba(186, 230, 253, 0.14) 30%, transparent 65%)`
              }}
            />

            {/* 7. Product Overhead Luxury Spotlight */}
            <div className="absolute -top-16 inset-x-12 h-36 bg-gradient-to-b from-white/90 via-amber-100/20 to-transparent filter blur-xl pointer-events-none z-0"></div>

            {/* 2. Before/After Luminous Transformation Split Halo (Behind Product) */}
            <div className="absolute inset-2 sm:inset-6 rounded-full bg-[radial-gradient(circle_at_60%_50%,_rgba(251,191,36,0.18)_0%,_rgba(186,230,253,0.14)_45%,_transparent_70%)] filter blur-xl pointer-events-none z-0"></div>

            {/* 4. Premium Circular Background Text (Very Low Opacity, Slowly Rotating) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-15">
              <svg className="w-[420px] h-[420px] text-slate-700 animate-spin-ultra-slow" viewBox="0 0 200 200">
                <path
                  id="circlePathBackdrop"
                  d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                  fill="none"
                />
                <text className="text-[11px] font-extrabold uppercase tracking-[0.38em] fill-[#1B2A4A]">
                  <textPath href="#circlePathBackdrop">
                    • RADIANCE • CLARITY • GLOW • RADIANCE • CLARITY • GLOW •
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Elegant Botanical Leaves Entering from the Far Right Edge */}
            <div className="absolute -top-10 -right-6 sm:-top-12 sm:-right-8 w-36 sm:w-48 h-48 sm:h-60 pointer-events-none z-10 opacity-70 overflow-hidden">
              <svg viewBox="0 0 160 200" className="w-full h-full" fill="none">
                <path d="M170,-10 C140,40 120,90 95,160" stroke="#2D5A3D" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <path d="M150,15 C132,18 120,6 116,0 C128,15 145,22 150,15" fill="#3D7B52" opacity="0.85" />
                <path d="M142,35 C118,30 106,50 110,60 C122,46 138,42 142,35" fill="#4B9364" opacity="0.85" />
                <path d="M130,65 C110,56 94,76 98,90 C112,76 126,72 130,65" fill="#3D7B52" opacity="0.9" />
                <path d="M118,95 C94,86 82,110 86,124 C100,106 114,102 118,95" fill="#52A26E" opacity="0.8" />
                <path d="M106,128 C86,118 74,142 78,154 C92,136 104,132 106,128" fill="#3D7B52" opacity="0.75" />
              </svg>
            </div>

            {/* =========================================================================
                1. FLOATING BENEFIT BUBBLES (☀️ Brightens, ✨ Fades Spots, 💧 Hydrates)
               ========================================================================= */}
            {/* Bubble 1: Brightens (Top-Left) */}
            <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 z-25 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-glow-navy animate-float-smooth delay-100 pointer-events-none">
              <span className="text-amber-500 text-xs">☀️</span>
              <span>Brightens</span>
            </div>

            {/* Bubble 2: Fades Dark Spots (Bottom-Left) */}
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-5 z-25 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-glow-navy animate-float-smooth delay-400 pointer-events-none">
              <span className="text-glow-orange text-xs">✨</span>
              <span>Fades Spots</span>
            </div>

            {/* Bubble 3: Hydrates (Right-Center) */}
            <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 z-25 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-glow-navy animate-float-smooth delay-700 pointer-events-none">
              <span className="text-sky-500 text-xs">💧</span>
              <span>Hydrates</span>
            </div>

            {/* =========================================================================
                6. INTERACTIVE GLASS INGREDIENT BADGES (Hover for active benefit tooltip)
               ========================================================================= */}
            {/* Badge 1: 3% Vitamin C */}
            <div className="absolute top-16 -left-6 sm:-left-8 z-30 group/ing pointer-events-auto">
              <div className="bg-white/85 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-200/80 shadow-xs text-[11px] font-bold text-glow-navy hover:text-glow-orange transition-all duration-300 flex items-center gap-1 cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>3% Vitamin C</span>
              </div>
              <div className="absolute left-0 top-full mt-1 w-36 p-2 bg-white rounded-lg shadow-lg border border-slate-100 text-[10px] text-slate-600 opacity-0 group-hover/ing:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
                Boosts natural collagen & defends against free radicals
              </div>
            </div>

            {/* Badge 2: 2% Alpha Arbutin */}
            <div className="absolute bottom-16 -right-4 sm:-right-6 z-30 group/ing pointer-events-auto">
              <div className="bg-white/85 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-xl border border-red-200/80 shadow-xs text-[11px] font-bold text-glow-navy hover:text-glow-orange transition-all duration-300 flex items-center gap-1 cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>2% Alpha Arbutin</span>
              </div>
              <div className="absolute right-0 top-full mt-1 w-36 p-2 bg-white rounded-lg shadow-lg border border-slate-100 text-[10px] text-slate-600 opacity-0 group-hover/ing:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
                Inhibits melanin synthesis & evens pigmentation
              </div>
            </div>

            {/* Floating Circular CLINICALLY TESTED Badge (Strict Pixel Sized, Non-overlapping) */}
            <div className="absolute -top-3 right-0 sm:-top-5 sm:right-2 z-30 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md ring-4 ring-white/80 flex items-center justify-center w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] shrink-0 pointer-events-none">
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-1">
                <svg className="w-full h-full text-slate-700 animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    id="circlePathFloating"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text className="text-[10px] font-bold uppercase tracking-[0.24em] fill-[#1B2A4A]">
                    <textPath href="#circlePathFloating">
                      • CLINICALLY TESTED •
                    </textPath>
                  </text>
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-glow-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    <path d="M9 13l2 2 4-4" stroke="#F07E00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Floating Stage Container */}
            <div className="relative w-full max-w-[540px] flex flex-col items-center justify-center animate-hero-float z-20">
              
              {/* Master Luxury Product Artwork */}
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-[#F3F8FE] via-white to-[#F8FAFD] p-2 sm:p-3 flex items-center justify-center">
                <img
                  src="/assets/hero-master-product.jpg"
                  alt="Glow Finder TriActive Brightening Serum Luxury Showcase"
                  className="w-full h-auto object-contain rounded-2xl transition-transform duration-700 hover:scale-[1.01]"
                />
              </div>

              {/* Realistic Soft Drop Shadows below Product Base */}
              <div className="w-4/5 h-4 bg-slate-900/10 rounded-[50%] filter blur-md mt-3"></div>
              <div className="w-full h-8 bg-blue-950/5 rounded-[50%] filter blur-xl -mt-3"></div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
