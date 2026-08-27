import React, { useState } from 'react';
import { User, ShoppingBag, Menu, X, LogIn, Package } from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  cartCount, 
  onOpenCart,
  onOpenAuth,
  onOpenAccount 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const navLinks = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About Us' },
    { id: 'ingredients', name: 'Ingredients' },
    { id: 'benefits', name: 'Benefits' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'faq', name: 'FAQ' },
  ];

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

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
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* User Account / Login Button */}
          {currentUser ? (
            <button 
              onClick={onOpenAccount}
              className="flex items-center gap-2 py-1.5 px-3 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/70 rounded-full transition-all cursor-pointer group shadow-xs"
              title={`Logged in as ${displayName}`}
            >
              <div className="w-6 h-6 rounded-full bg-glow-orange text-white text-[11px] font-bold flex items-center justify-center overflow-hidden shrink-0">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <span className="text-xs font-bold text-glow-navy hidden sm:inline truncate max-w-[90px]">
                {displayName.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold text-slate-700 hover:text-glow-navy hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-glow-orange" />
              <span>Sign In</span>
            </button>
          )}

          {/* Shopping Bag Button */}
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

          {/* Mobile User Profile or Login CTA */}
          <div className="pt-3 mt-2 border-t border-slate-100">
            {currentUser ? (
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-glow-navy text-xs font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-glow-orange" />
                  <span>My Account ({displayName})</span>
                </div>
                <span className="text-[10px] text-glow-orange uppercase">View Orders →</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-glow-orange text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
