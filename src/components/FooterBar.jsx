import React from 'react';
import { Mail, ShieldCheck, Truck, Headphones } from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';

export default function FooterBar() {
  return (
    <footer className="bg-white border-t border-slate-100">
      
      {/* 3 Columns Service Guarantees Bar (₹39 Delivery, Secure Payment, 24/7 Support) */}
      <div className="py-7 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center">
            
            {/* ₹39 Delivery */}
            <div className="flex items-center gap-3.5 group justify-start sm:justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-700">
                <Truck className="w-5 h-5 text-glow-orange" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  ₹39 Delivery
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  Affordable shipping across India
                </span>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="flex items-center gap-3.5 group justify-start sm:justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Secure Payment
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  100% safe & encrypted UPI / Cards
                </span>
              </div>
            </div>

            {/* 24/7 Support with Email */}
            <div className="flex items-center gap-3.5 group justify-start sm:justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-700">
                <Headphones className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  24/7 Customer Support
                </h4>
                <a 
                  href="mailto:info@glowfinder.store" 
                  className="text-[11px] sm:text-xs text-glow-orange hover:underline font-bold mt-0.5 flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  info@glowfinder.store
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Row */}
      <div className="py-8 bg-[#FAFCFF] text-glow-slate text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <img
              src={brandLogo}
              alt="Glow Finder Logo"
              className="h-11 w-auto object-contain"
            />
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} Glow Finder. All Rights Reserved.
            </span>
          </div>

          {/* Official Email & Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-glow-slate font-medium text-xs">
            <a 
              href="mailto:info@glowfinder.store" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-glow-navy font-bold hover:bg-amber-100 hover:text-glow-orange transition-all shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-glow-orange" />
              <span>info@glowfinder.store</span>
            </a>
            <a href="#home" className="hover:text-glow-navy transition-colors">Privacy Policy</a>
            <a href="#home" className="hover:text-glow-navy transition-colors">Terms of Service</a>
            <a href="mailto:info@glowfinder.store" className="hover:text-glow-navy transition-colors">Contact Support</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
