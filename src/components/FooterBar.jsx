import React from 'react';

export default function FooterBar() {
  return (
    <footer className="bg-white border-t border-slate-100">
      
      {/* 4 Columns Service Guarantees Bar */}
      <div className="py-7 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center">
            
            {/* Free Shipping */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05a1 1 0 0 0-.78-.38H14v10" />
                  <circle cx="17" cy="18.5" r="2.5" />
                  <circle cx="7" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Free Shipping
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  On all orders
                </span>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Easy Returns
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  Hassle-free returns
                </span>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="14" x="3" y="7" rx="2" />
                  <path d="M12 11v3" />
                  <circle cx="12" cy="12.5" r="0.5" fill="currentColor" />
                  <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  Secure Payment
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  100% safe & secure
                </span>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight">
                  24/7 Support
                </h4>
                <span className="text-[11px] sm:text-xs text-glow-slate mt-0.5 font-normal">
                  We're here to help
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Copyright */}
      <div className="py-8 bg-[#FAFCFF] text-glow-slate text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/glow-finder-logo-official.png"
              alt="Glow Finder Official Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="text-slate-400">|</span>
            <span>© {new Date().getFullYear()} Glow Finder Skincare. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-glow-slate font-medium">
            <a href="#home" className="hover:text-glow-navy transition-colors">Privacy Policy</a>
            <a href="#home" className="hover:text-glow-navy transition-colors">Terms of Service</a>
            <a href="#home" className="hover:text-glow-navy transition-colors">Contact Us</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
