import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      stars: 5,
      quote: "This serum made my skin brighter and smoother in just 2 weeks!",
      author: "Ananya S.",
    },
    {
      stars: 5,
      quote: "Dark spots are fading and my skin feels so healthy and fresh.",
      author: "Mehak D.",
    },
    {
      stars: 5,
      quote: "Lightweight, non-sticky and works wonders on my acne marks.",
      author: "Pooja R.",
    },
  ];

  // 5. Automatic Review Slider (Every 5 seconds, pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* 4. Left Column - Lady Product Image with Slow Ken Burns Zoom (10s, 1 to 1.03) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50 bg-[#F4F9FE]">
              <img
                src="/assets/model-hd-exact.jpg"
                alt="Glowing skin model applying Glow Finder TriActive Brightening Serum"
                className="w-full h-full object-cover object-center animate-ken-burns origin-center"
              />
            </div>
          </div>

          {/* Right Column - Reviews & Testimonials Carousel */}
          <div
            className="lg:col-span-7 space-y-4 text-left"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Blue Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glow-blue-tag text-glow-blue-tag-text font-bold text-xs uppercase tracking-wider shadow-2xs">
              REAL RESULTS. REAL PEOPLE.
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-glow-navy tracking-tight">
              Loved by Thousands
            </h2>

            {/* Testimonials 3 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {reviews.map((rev, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`bg-white p-4 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-glow-orange/80 shadow-md ring-2 ring-glow-orange/20 -translate-y-1'
                        : 'border-slate-100 shadow-card-soft hover:border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      {/* 5 Amber/Orange Stars */}
                      <div className="flex items-center gap-0.5 text-[#F59E0B] mb-2.5">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-slate-700 text-xs sm:text-[13px] font-normal leading-relaxed mb-3">
                        "{rev.quote}"
                      </p>
                    </div>

                    {/* Author */}
                    <span className={`text-xs font-bold block transition-colors ${
                      isActive ? 'text-glow-orange' : 'text-glow-navy'
                    }`}>
                      – {rev.author}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 5. Carousel Pagination Dots */}
            <div className="flex items-center gap-2 pt-3">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeIndex === i
                      ? 'w-7 bg-glow-orange'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Select testimonial ${i + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
