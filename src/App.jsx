import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Ingredients from './components/Ingredients';
import Testimonials from './components/Testimonials';
import PromoBanner from './components/PromoBanner';
import FAQSection from './components/FAQSection';
import FooterBar from './components/FooterBar';
import CartDrawer from './components/CartDrawer';

// Multi-Page Views
import AboutPage from './pages/AboutPage';
import IngredientsPage from './pages/IngredientsPage';
import RoutinePage from './pages/RoutinePage';
import BenefitsPage from './pages/BenefitsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Glow Finder™ TriActive Brightening Serum',
      size: '30ML / 1.01 FL.OZ',
      originalPrice: 699,
      price: 559,
      quantity: 1,
      image: '/assets/product-hd-clean.jpg'
    }
  ]);

  const handleAddToCart = () => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === 1);
      if (existing) {
        return prevItems.map((item) =>
          item.id === 1 ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          id: 1,
          name: 'Glow Finder™ TriActive Brightening Serum',
          size: '30ML / 1.01 FL.OZ',
          originalPrice: 699,
          price: 559,
          quantity: 1,
          image: '/assets/product-hd-clean.jpg'
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white font-sans text-glow-navy selection:bg-glow-orange selection:text-white flex flex-col">
      {/* Top Banner Notice */}
      <div className="bg-glow-navy text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
        <span className="bg-glow-orange text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          SPECIAL OFFER
        </span>
        <span>Special Discount: Get Glow Finder at ₹559 (M.R.P. ₹699) + ₹39 Delivery Fee!</span>
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Dynamic Multi-Page Router View */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero onAddToCart={handleAddToCart} />
            <TrustBar />
            <Ingredients />
            <Testimonials />
            <PromoBanner onAddToCart={handleAddToCart} />
            <FAQSection />
          </>
        )}

        {activeTab === 'about' && (
          <AboutPage onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'ingredients' && (
          <IngredientsPage onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'routine' && (
          <RoutinePage onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'benefits' && (
          <BenefitsPage onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'reviews' && (
          <div className="py-8">
            <Testimonials />
            <PromoBanner onAddToCart={handleAddToCart} />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="py-8">
            <FAQSection />
          </div>
        )}
      </main>

      {/* Footer & Guarantees */}
      <FooterBar />

      {/* Interactive Cart Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddItem={handleAddToCart}
      />
    </div>
  );
}
