import React from 'react';

export default function Ingredients() {
  const ingredients = [
    {
      title: '3% Ascorbic Acid',
      description: 'Brightens skin, boosts collagen, and protects against free radicals.',
      image: '/assets/ingredient_ascorbic_exact.jpg',
      alt: 'Orange slice for 3% Ascorbic Acid',
      delayClass: 'delay-100',
    },
    {
      title: '5% Niacinamide',
      description: 'Improves skin texture, minimizes pores & strengthens skin barrier.',
      image: '/assets/ingredient_niacinamide_exact.jpg',
      alt: 'Translucent active molecules for 5% Niacinamide',
      delayClass: 'delay-200',
    },
    {
      title: '2% Alpha Arbutin',
      description: 'Reduces dark spots and evens out skin tone naturally.',
      image: '/assets/ingredient_arbutin_exact.jpg',
      alt: 'Bearberry red berries for 2% Alpha Arbutin',
      delayClass: 'delay-350',
    },
  ];

  return (
    <section id="ingredients" className="py-12 sm:py-16 bg-[#FAFCFF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-glow-blue-tag text-glow-blue-tag-text font-bold text-xs uppercase tracking-wider mb-3 shadow-2xs">
          POWERED BY TRI-ACTIVE FORMULA
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-glow-navy tracking-tight mb-10">
          3 Powerful Ingredients. <span className="text-glow-orange">1 Radiant You.</span>
        </h2>

        {/* 3 Ingredients Cards Grid with Staggered Entrance & Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 text-left">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 group cursor-pointer animate-reveal-up ${item.delayClass}`}
            >
              {/* Ingredient Thumbnail Square */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100/80">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-glow-navy mb-1 group-hover:text-glow-orange transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-glow-slate text-xs sm:text-[13px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
