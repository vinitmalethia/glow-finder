import React, { useState } from 'react';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';

export default function Navbar({ activeTab, onSelectTab, cartCount, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About Us' },
    { id: 'ingredients', name: 'Ingredients' },
    { id: 'benefits', name: 'Benefits' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'faq', name: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - New Official Logo */}
        <button 
          onClick={() => onSelectTab('home')}
          className="flex items-center group text-left cursor-pointer transition-transform hover:opacity-90 py-1"
        >
          <img
            src={brandLogo}
            alt="Glow Finder Logo"
            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`text-sm tracking-wide relative py-1 cursor-pointer font-medium transition-colors duration-200 group ${
                  isActive
                    ? 'text-glow-navy font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-glow-orange after:rounded-full'
                    : 'text-slate-600 hover:text-glow-navy after:absolute after:bottom-[-2px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-glow-orange after:rounded-full after:transition-all after:duration-300 after:ease-out'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right Side User & Cart Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            aria-label="User Account"
            onClick={() => onSelectTab('about')}
            className="p-2 text-slate-700 hover:text-glow-navy hover:bg-slate-50 rounded-full transition-colors hidden sm:flex cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="relative p-2 text-slate-700 hover:text-glow-navy hover:bg-slate-50 rounded-full transition-colors flex items-center justify-center cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 bg-glow-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-glow-navy md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === link.id
                  ? 'bg-glow-orange-light text-glow-orange font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
