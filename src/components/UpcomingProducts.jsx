import React, { useState } from 'react';
import { Sparkles, Bell, CheckCircle2, Shield, X, Clock } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UpcomingProducts({ onShopSerum }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const upcomingList = [
    {
      id: 'freshglow-facewash',
      name: 'FreshGlow Face Wash',
      size: '100 ML / 3.38 FL OZ',
      image: '/assets/freshglow-facewash.jpg',
    },
    {
      id: 'hydraglow-moisturiser',
      name: 'HydraGlow Moisturiser',
      size: '50 g / Net Wt. 1.76 OZ',
      image: '/assets/hydraglow-moisturiser.jpg',
    },
    {
      id: 'sunglow-sunscreen',
      name: 'SunGlow Sunscreen SPF 50',
      size: '50 g / Net Wt. 1.76 OZ',
      image: '/assets/sunglow-sunscreen.jpg',
    }
  ];

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setSubmitting(true);
    const leadPayload = {
      productName: selectedProduct?.name || 'Upcoming Products',
      productId: selectedProduct?.id || 'all',
      email: waitlistEmail,
      createdAt: serverTimestamp(),
      dateStr: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('glowfinder_waitlist') || '[]');
      localStorage.setItem('glowfinder_waitlist', JSON.stringify([leadPayload, ...existing]));
    } catch (err) {
      console.warn('Local storage error:', err);
    }

    try {
      await addDoc(collection(db, 'waitlist_leads'), leadPayload);
    } catch (err) {
      console.warn('Firestore waitlist sync error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="upcoming" className="py-14 sm:py-20 bg-gradient-to-b from-[#F8FAFD] via-white to-[#F8FAFD] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-glow-orange font-bold text-xs uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-glow-orange" />
            <span>New Launches</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-glow-navy tracking-tight">
            Coming Soon
          </h2>

          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Exciting new additions coming soon to your daily skincare ritual.
          </p>
        </div>

        {/* Minimal Clean Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {upcomingList.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              
              {/* Product Image */}
              <div className="relative bg-slate-50/60 p-6 flex items-center justify-center border-b border-slate-100">
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                  Coming Soon
                </span>

                <div className="w-full aspect-square max-w-[240px] mx-auto flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Minimal Card Details */}
              <div className="p-5 sm:p-6 text-center space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-glow-navy">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {product.size}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setSubmitted(false);
                      setWaitlistEmail('');
                    }}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-glow-orange text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notify Me When Available</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Simple Notify Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 animate-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div className="space-y-4 pt-2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-contain mx-auto rounded-xl bg-slate-50 border border-slate-100 p-1"
                />

                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-glow-orange uppercase">
                    Coming Soon
                  </span>
                  <h3 className="text-lg font-bold text-glow-navy">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your email to get notified the moment it launches.
                  </p>
                </div>

                <form onSubmit={handleJoinWaitlist} className="space-y-3 pt-1 text-left">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Notify Me'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-glow-navy">
                  You're on the list!
                </h3>
                <p className="text-xs text-slate-500">
                  We'll notify you at <strong className="text-slate-700">{waitlistEmail}</strong> as soon as it's available.
                </p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
