import React, { useState } from 'react';
import { 
  Sparkles, Bell, CheckCircle2, Shield, Droplets, Sun, 
  Leaf, Heart, ArrowRight, X, Clock, Flame, Check
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UpcomingProducts({ onShopSerum }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'cleanse' | 'hydrate' | 'protect'

  const upcomingList = [
    {
      id: 'freshglow-facewash',
      name: 'FreshGlow Face Wash',
      category: 'cleanse',
      step: 'Step 01 • Cleanse',
      size: '100 ML / 3.38 FL OZ',
      tagline: 'Gentle Cleansing Face Wash • For Fresh & Clean Skin',
      slogan: 'Fresh Clean Confident • Everyday a Brighter You',
      image: '/assets/freshglow-facewash.jpg',
      badge: 'Coming Soon',
      badgeColor: 'bg-amber-500/90 text-white',
      actives: ['Vitamin C', 'Green Tea Extract'],
      highlights: [
        { label: 'Deep Cleanses', desc: 'Purifies pores without stripping moisture' },
        { label: 'Removes Impurities', desc: 'Lifts pollution and excess daily sebum' },
        { label: 'Maintains Natural Moisture', desc: 'pH-balanced for soft, supple comfort' }
      ],
      description: 'A gentle yet deep-cleansing facial wash packed with antioxidant Vitamin C and soothing Green Tea extract. Leaves your skin energized, clarified, and radiant every morning and night.',
      texture: 'Silky gel that transforms into a light, creamy micro-foam'
    },
    {
      id: 'hydraglow-moisturiser',
      name: 'HydraGlow Moisturiser',
      category: 'hydrate',
      step: 'Step 03 • Hydrate',
      size: '50 g / Net Wt. 1.76 OZ',
      tagline: 'Deep Hydration for Soft, Smooth & Glowing Skin',
      slogan: 'Lock in Dewy Radiance • All-Day Moisture Lock',
      image: '/assets/hydraglow-moisturiser.jpg',
      badge: 'Coming Soon',
      badgeColor: 'bg-sky-500/90 text-white',
      actives: ['Hyaluronic Acid', 'Vitamin C', 'Aloe Vera Extract'],
      highlights: [
        { label: 'Hydrates Deeply', desc: 'Multi-depth cellular hydration' },
        { label: 'Repairs Skin Barrier', desc: 'Fortifies lipid shield against sensitivity' },
        { label: 'Soft & Supple Finish', desc: 'Zero sticky residue with instant glow' }
      ],
      description: 'A featherlight, quick-absorbing gel cream infused with moisture-magnet Hyaluronic Acid, brightening Vitamin C, and soothing Aloe Vera. Quenches thirsty skin and seals in treatment benefits.',
      texture: 'Ultra-plush water-cream that melts immediately upon contact'
    },
    {
      id: 'sunglow-sunscreen',
      name: 'SunGlow Sunscreen SPF 50 PA+++',
      category: 'protect',
      step: 'Step 04 • Protect',
      size: '50 g / Net Wt. 1.76 OZ',
      tagline: 'Broad Spectrum Protection For Healthy & Glowing Skin',
      slogan: 'Broad Spectrum UVA/UVB Shield • Non-Greasy Satin Finish',
      image: '/assets/sunglow-sunscreen.jpg',
      badge: 'Coming Soon',
      badgeColor: 'bg-amber-600/90 text-white',
      actives: ['SPF 50 PA+++', 'Vitamin E', 'Hydrating Nourishers'],
      highlights: [
        { label: 'UVA / UVB Broad Spectrum', desc: 'Shields from sunspots & photoaging' },
        { label: 'Zero White Cast', desc: 'Blends invisibly into all Indian skin tones' },
        { label: 'Lightweight & Non-Greasy', desc: 'Dermatologically tested & water-resistant' }
      ],
      description: 'A breakthrough daily sunscreen that feels like a weightless moisturizer. Provides laboratory-verified SPF 50 PA+++ protection while antioxidant Vitamin E guards against free radicals and environmental stress.',
      texture: 'Invisible fluid lotion with a healthy, natural satin glow'
    }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? upcomingList 
    : upcomingList.filter(item => item.category === activeFilter);

  const handleOpenNotifyModal = (product) => {
    setSelectedProduct(product);
    setSubmitted(false);
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setSubmitting(true);
    const leadPayload = {
      productName: selectedProduct?.name || 'All Upcoming Products',
      productId: selectedProduct?.id || 'all',
      email: waitlistEmail,
      phone: waitlistPhone || null,
      source: 'website_coming_soon_section',
      createdAt: serverTimestamp(),
      dateStr: new Date().toISOString()
    };

    // 1. Local backup
    try {
      const existing = JSON.parse(localStorage.getItem('glowfinder_waitlist') || '[]');
      localStorage.setItem('glowfinder_waitlist', JSON.stringify([leadPayload, ...existing]));
    } catch (err) {
      console.warn('Local storage error:', err);
    }

    // 2. Firestore sync
    try {
      await addDoc(collection(db, 'waitlist_leads'), leadPayload);
    } catch (err) {
      console.warn('Firestore waitlist sync error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="upcoming" className="py-16 sm:py-24 bg-gradient-to-b from-[#F8FAFD] via-white to-[#F8FAFD] relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =====================================================================
            SECTION HEADER
           ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-glow-orange font-extrabold text-xs uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-glow-orange" />
            <span>Coming Soon • New Product Launches</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy tracking-tight leading-[1.15]">
            Complete Your Daily Skincare Ritual
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            We are expanding our science-backed skincare line. Formulated with dermatologist-approved clinical actives and soothing botanicals to purify, hydrate, and shield your skin.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'View All New Trio' },
              { id: 'cleanse', label: 'Step 1: Face Wash' },
              { id: 'hydrate', label: 'Step 3: Moisturiser' },
              { id: 'protect', label: 'Step 4: Sunscreen' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-glow-navy text-white shadow-md shadow-slate-900/10 scale-102'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* =====================================================================
            PRODUCT CARDS GRID (3 UPCOMING PRODUCTS)
           ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 items-stretch">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              
              {/* Product Image Header with Badges */}
              <div className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 p-6 sm:p-7 flex items-center justify-center overflow-hidden border-b border-slate-100">
                
                {/* Floating Routine Step Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-glow-navy border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-glow-orange" />
                    {product.step}
                  </span>
                </div>

                {/* Coming Soon Glowing Ribbon */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${product.badgeColor} shadow-xs flex items-center gap-1.5 animate-pulse`}>
                    <Sparkles className="w-3 h-3" />
                    {product.badge}
                  </span>
                </div>

                {/* Product HD Image with Smooth Zoom */}
                <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-2xl flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-106 drop-shadow-md"
                    loading="lazy"
                  />
                </div>

                {/* Size / Volume badge at bottom-right of image */}
                <div className="absolute bottom-3 right-4 z-10 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {product.size}
                </div>
              </div>

              {/* Product Info & Benefits Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                
                <div className="space-y-3">
                  
                  {/* Active Key Ingredients Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {product.actives.map((active, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60"
                      >
                        ✦ {active}
                      </span>
                    ))}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-glow-navy tracking-tight leading-tight group-hover:text-glow-orange transition-colors">
                    {product.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs font-semibold text-glow-orange">
                    {product.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* 3 Pill Highlights from packaging */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Clinical & Botanical Benefits
                    </span>
                    {product.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="leading-tight">
                          <span className="font-bold text-slate-800">{item.label}</span>
                          <span className="text-slate-500 font-normal"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Action CTA: Notify Me Button */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => handleOpenNotifyModal(product)}
                    className="w-full py-3.5 px-4 bg-glow-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <Bell className="w-4 h-4 text-amber-400 transition-transform group-hover/btn:rotate-12" />
                    <span>NOTIFY ME ON LAUNCH</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    Be the first to know & get <span className="font-bold text-slate-700">20% VIP launch discount</span>
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* =====================================================================
            BANNER: CONNECTING TO CURRENT HERO PRODUCT (TRIACTIVE SERUM)
           ===================================================================== */}
        <div className="mt-16 sm:mt-20 p-6 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-glow-navy via-slate-900 to-glow-navy text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-glow-orange/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-white/15">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Available & In Stock Right Now</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Can't wait? Start with our flagship <span className="text-glow-orange">TriActive Brightening Serum</span>.
              </h3>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                While our cleansing and hydration duo is in production, our 3% Ascorbic Acid, 5% Niacinamide & 2% Alpha Arbutin treatment is ready to transform your skin today.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  if (onShopSerum) onShopSerum();
                  else {
                    const hero = document.getElementById('home');
                    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-7 py-4 bg-glow-orange hover:bg-glow-orange-hover text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-glow-orange/30 transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>ORDER TRIACTIVE SERUM (₹559)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================================
          VIP LAUNCH NOTIFY MODAL
         ===================================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div className="space-y-5">
                
                {/* Product preview banner */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold text-glow-orange uppercase tracking-wider block">
                      {selectedProduct.step}
                    </span>
                    <h4 className="text-sm font-extrabold text-glow-navy truncate">
                      {selectedProduct.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {selectedProduct.size}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-glow-navy">
                    Get VIP Early Access
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Leave your contact details to be the first to know when <strong className="text-slate-800">{selectedProduct.name}</strong> launches, plus an exclusive <strong className="text-glow-orange">flat 20% launch coupon</strong>.
                  </p>
                </div>

                <form onSubmit={handleJoinWaitlist} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.name@gmail.com"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      WhatsApp / Phone Number (Optional for SMS drop alert)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={waitlistPhone}
                      onChange={(e) => setWaitlistPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{submitting ? 'RESERVING YOUR SPOT...' : 'NOTIFY ME ON LAUNCH'}</span>
                  </button>
                </form>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span>No spam ever. Unsubscribe anytime in 1 click.</span>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-in zoom-in-75">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-glow-navy">
                    You're on the VIP Launch List!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    We've saved your spot for <strong className="text-glow-navy">{selectedProduct.name}</strong>. We'll send your exclusive 20% discount code to <span className="font-bold text-glow-navy">{waitlistEmail}</span> as soon as batch 01 goes live.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs font-bold text-amber-900">
                  🎁 VIP Code Reserved: <span className="font-mono text-glow-orange font-extrabold">GLOW20</span>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-3 bg-glow-navy hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  CLOSE & CONTINUE EXPLORING
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </section>
  );
}
