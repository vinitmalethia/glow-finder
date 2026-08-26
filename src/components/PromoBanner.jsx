import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PromoBanner({ onAddToCart }) {
  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="bg-[#E8F2FC] rounded-3xl p-5 sm:p-6 lg:p-7 border border-blue-100/80 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          
          {/* Left Thumbnail + Center Content */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left w-full md:w-auto">
            
            {/* Thumbnail Product Shot */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white shadow-xs border-2 border-white shrink-0 p-1">
              <img
                src="/assets/product-hero-hd-clean.jpg"
                alt="Glow Finder TriActive Serum Limited Offer"
                className="w-full h-full object-contain object-center"
              />
            </div>

            {/* Text Copy */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-glow-orange block">
                  LIMITED TIME OFFER
                </span>
                <span className="text-[11px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save ₹140
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-glow-navy tracking-tight">
                Get Glow Finder at ₹559 <span className="text-base text-slate-400 line-through font-normal">₹699</span>
              </h3>
              
              <p className="text-glow-slate text-xs sm:text-sm font-normal">
                Start your journey to brighter, clearer skin today. Standard ₹39 delivery.
              </p>
            </div>

          </div>

          {/* Right Action CTA */}
          <button
            onClick={onAddToCart}
            className="px-7 py-3 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm tracking-wide rounded-xl shadow-glow-soft hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <span>ORDER NOW (₹559)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </section>
  );
}
