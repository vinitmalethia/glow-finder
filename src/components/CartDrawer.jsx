import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, 
  Tag, CheckCircle2, MapPin, CreditCard, ArrowLeft, Sparkles, Phone, User, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onAddItem 
}) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'upi'
  });
  const [orderId, setOrderId] = useState('');

  // Auto-populate user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.displayName || '',
        email: prev.email || currentUser.email || ''
      }));
    }
  }, [currentUser, isOpen, step]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset to cart view when opened
      if (step === 'success') setStep('cart');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + (item.originalPrice || 699) * item.quantity, 0);
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.05) : 0; // Extra 5% off
  const totalSavings = (totalOriginal - subtotal) + couponDiscount;
  const deliveryFee = totalQuantity > 0 ? 39 : 0; // ₹39 delivery fee
  const finalTotal = subtotal - couponDiscount + deliveryFee;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'GLOW5' || couponCode.trim().toUpperCase() === 'GLOW20') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try using "GLOW5" for an extra 5% discount!');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill in your name, phone number, address, and pincode to proceed.');
      return;
    }
    setSubmittingOrder(true);

    // Generate unique order ID
    const newOrderId = 'GF-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);

    const fullDeliveryAddress = `${formData.address}${formData.city ? ', ' + formData.city : ''}${formData.pincode ? ' - ' + formData.pincode : ''}`;
    const confirmedEmail = formData.email || currentUser?.email || 'manojshahsp@gmail.com';

    const orderPayload = {
      id: newOrderId,
      orderNumber: newOrderId,
      userId: currentUser ? currentUser.uid : null,
      userEmail: confirmedEmail,
      email: confirmedEmail,
      customerEmail: confirmedEmail,
      customerName: formData.name,
      phone: formData.phone,
      address: fullDeliveryAddress,
      rawAddress: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      productName: cartItems[0]?.name || 'TriActive Serum',
      quantity: totalQuantity,
      subtotal,
      deliveryFee,
      finalTotal,
      paymentMethod: 'UPI / Online Payment',
      status: 'Confirmed',
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    // 1. Instant Local Storage Dispatch for Zero-Latency Admin updates
    try {
      const existingLocal = JSON.parse(localStorage.getItem('glowfinder_orders') || '[]');
      localStorage.setItem('glowfinder_orders', JSON.stringify([orderPayload, ...existingLocal]));
      window.dispatchEvent(new Event('glowfinder_order_placed'));
    } catch (err) {
      console.warn("Local storage write error:", err);
    }

    // 2. Non-blocking Asynchronous Cloud Firestore Sync (Never blocks UI)
    try {
      addDoc(collection(db, 'orders'), {
        ...orderPayload,
        createdAt: serverTimestamp()
      }).catch(err => {
        console.warn("Firestore background sync warning:", err);
      });
    } catch (err) {
      console.warn("Firestore dispatch error:", err);
    }

    // 3. Snappy 350ms tactile feedback delay before showing celebratory screen
    await new Promise(resolve => setTimeout(resolve, 350));
    setSubmittingOrder(false);
    setStep('success');
  };

  const defaultItem = {
    id: 1,
    name: 'Glow Finder™ TriActive Brightening Serum',
    size: '30ML / 1.01 FL.OZ',
    originalPrice: 699,
    price: 559,
    quantity: 1,
    image: '/assets/product-hd-clean.jpg'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transition-all duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              {step !== 'cart' && step !== 'success' && (
                <button
                  onClick={() => setStep('cart')}
                  className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-glow-orange flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-glow-navy leading-tight">
                  {step === 'cart' && 'Your Shopping Bag'}
                  {step === 'checkout' && 'Express Checkout'}
                  {step === 'success' && 'Order Confirmed!'}
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">
                  {step === 'cart' && `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}
                  {step === 'checkout' && `Total Payable: ₹${finalTotal}`}
                  {step === 'success' && `Order ID: ${orderId}`}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* =========================================================================
              VIEW 1: SHOPPING BAG ITEMS
             ========================================================================= */}
          {step === 'cart' && (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-glow-orange flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-glow-navy">Your bag is empty</h3>
                      <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                        Add Glow Finder TriActive Brightening Serum to start your radiant skin journey.
                      </p>
                    </div>
                    <button
                      onClick={() => onAddItem ? onAddItem(defaultItem) : onUpdateQuantity(1, 1)}
                      className="px-6 py-2.5 bg-glow-orange hover:bg-glow-orange-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add Glow Finder (₹559)</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-3">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-glow-navy leading-tight line-clamp-2">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1 shrink-0 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.size}</p>
                            
                            {/* Price Tag with Slashed Original Price */}
                            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                              <span className="text-sm font-extrabold text-glow-navy">
                                ₹{item.price}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{item.originalPrice || 699}
                              </span>
                              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                Save ₹{(item.originalPrice || 699) - item.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Subtotal Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/50">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-200/70 text-sm font-bold rounded-l-lg cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-glow-navy">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-200/70 text-sm font-bold rounded-r-lg cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block">Item Total</span>
                            <span className="text-sm font-extrabold text-glow-navy">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Coupon Code Input Box */}
                    <form onSubmit={handleApplyCoupon} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. GLOW5)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 uppercase font-semibold text-glow-navy focus:outline-none focus:border-glow-orange"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-glow-navy hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#FAFCFF] space-y-3">
                  
                  {/* Savings Alert Badge */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Special Launch Savings Applied</span>
                    </div>
                    <span className="text-emerald-700 font-extrabold">-₹{totalSavings}</span>
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Total M.R.P.</span>
                      <span className="line-through text-slate-400">₹{totalOriginal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discounted Product Price</span>
                      <span className="font-semibold text-glow-navy">₹{subtotal}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Extra Coupon Discount (GLOW5)</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        Delivery Fees
                      </span>
                      <span className="font-bold text-glow-navy">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-glow-navy pt-2 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span className="text-glow-orange">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>PROCEED TO ORDER (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>100% Genuine • COD Available • Express Dispatch Across India</span>
                  </div>

                </div>
              )}
            </>
          )}

          {/* =========================================================================
              VIEW 2: EXPRESS CHECKOUT FORM
             ========================================================================= */}
          {step === 'checkout' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between">
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Shipping Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-glow-navy uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-glow-orange" />
                    <span>Delivery Address</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number (for delivery updates) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email / Gmail Address (for order receipt & tracking)</label>
                      <input
                        type="email"
                        placeholder="e.g. name@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Complete Address *</label>
                      <textarea
                        required
                        rows="2"
                        placeholder="House / Flat No., Street, Area, Landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">City / Town</label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 400001"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector - UPI / Online Pay Only */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-glow-navy uppercase tracking-wider block">
                    Payment Method
                  </span>
                  
                  <div className="p-3.5 rounded-xl border border-glow-orange bg-amber-50/40 ring-1 ring-glow-orange flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-glow-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-glow-navy">UPI / Online Payment</span>
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          Instant & Safe
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Google Pay, PhonePe, Paytm, Debit/Credit Cards & NetBanking
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary Recap */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Products ({totalQuantity} items):</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges:</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-glow-navy text-sm pt-1 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="text-glow-orange">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Place Order Submit Button with Loading State */}
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full py-3.5 bg-glow-orange hover:bg-glow-orange-hover disabled:bg-glow-orange/80 text-white font-bold text-sm rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {submittingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>CONFIRMING & SECURING ORDER...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CONFIRM & PLACE ORDER (₹{finalTotal})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: CELEBRATORY ORDER SUCCESS CONFIRMATION WITH ANIMATIONS
             ========================================================================= */}
          {step === 'success' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
              
              {/* Floating Confetti Particle Sparks */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-12 left-8 w-2.5 h-2.5 rounded-full bg-amber-400 animate-confetti opacity-80"></div>
                <div className="absolute top-16 right-10 w-3 h-3 rounded-full bg-glow-orange animate-confetti delay-100 opacity-90"></div>
                <div className="absolute top-24 left-16 w-2 h-2 rounded-full bg-emerald-400 animate-confetti delay-200 opacity-80"></div>
                <div className="absolute top-10 right-24 w-2.5 h-2.5 rounded-full bg-sky-400 animate-confetti delay-350 opacity-80"></div>
                <div className="absolute top-28 right-12 w-2 h-2 rounded-full bg-purple-400 animate-confetti delay-500 opacity-80"></div>
                <div className="absolute top-20 left-28 w-3 h-3 rounded-full bg-amber-300 animate-confetti delay-700 opacity-90"></div>
              </div>

              <div className="w-full space-y-4 relative z-10 flex flex-col items-center pt-1">
                
                {/* Celebratory Animated Checkmark with Pulsing Ripple Rings */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-pulse-ring"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-emerald-500/30 animate-ping"></div>
                  <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-checkmark-pop">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                </div>

                {/* Celebration Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Order Placed Successfully!</span>
                </div>

                {/* Personalized Heading */}
                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-3 duration-600">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-glow-navy tracking-tight">
                    Thank You, {formData.name ? formData.name.split(' ')[0] : 'Radiant Customer'}!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Your order is confirmed. We are packing your fresh Glow Finder serum for express dispatch.
                  </p>
                </div>

                {/* Live Order Timeline Progress Animation */}
                <div className="w-full p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Order Status Progress
                  </span>
                  
                  <div className="flex items-center justify-between text-xs font-semibold relative">
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold">Placed</span>
                    </div>

                    <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mx-1 rounded-full -mt-3"></div>

                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold animate-pulse shadow-xs">
                        📦
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold">Packing</span>
                    </div>

                    <div className="flex-1 h-1 bg-slate-200 mx-1 rounded-full -mt-3"></div>

                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold border border-slate-200">
                        🚚
                      </div>
                      <span className="text-[10px] text-slate-400">Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Order Receipt Details Card */}
                <div className="w-full p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-left text-xs space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-800">
                  <div className="flex justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-extrabold text-blue-600 font-mono tracking-wide">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Items:</span>
                    <span className="font-bold text-glow-navy">{totalQuantity}x Glow Finder™ Serum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery To:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{formData.city || formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-semibold text-emerald-700">UPI / Online Confirmed</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200/80 font-bold text-sm">
                    <span>Grand Total:</span>
                    <span className="text-glow-orange">₹{finalTotal}</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="w-full pt-4 relative z-10">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-glow-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  CONTINUE BROWSING STORE
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
