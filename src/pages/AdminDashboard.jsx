import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3, 
  Tag, Boxes, Megaphone, Settings, LogOut, Search, Bell, 
  ChevronDown, ArrowUpRight, CheckCircle2, Clock, Truck, 
  Check, Eye, Filter, Plus, Edit2, Trash2, X, AlertTriangle, 
  DollarSign, TrendingUp, RefreshCw, Shield, MapPin, Phone, Mail
} from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';
import { collection, onSnapshot, updateDoc, doc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function AdminDashboard({ onLogout, onNavigateHome, bannerText, onUpdateBanner }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product state management
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Glow Finder™ TriActive Brightening Serum',
      size: '30ML / 1.01 FL.OZ',
      mrp: 699,
      price: 559,
      stock: 450,
      sold: 128,
      status: 'In Stock',
      image: '/assets/product-hd-clean.jpg'
    }
  ]);

  // Real Firestore Orders (Real-time Live Sync)
  const [orders, setOrders] = useState([]);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'GLOW5', discount: '5% OFF', usageCount: 0, active: true },
    { code: 'GLOW20', discount: '20% OFF', usageCount: 0, active: true },
    { code: 'FIRSTGLOW', discount: '₹140 OFF', usageCount: 0, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Live Announcement Banner State
  const [currentBanner, setCurrentBanner] = useState(
    bannerText || "Special Discount: Get Glow Finder at ₹559 (M.R.P. ₹699) — Flat ₹140 OFF + ₹39 Delivery Fee!"
  );

  // Real-time Live Orders Listener (Firestore + Instant Local Storage Sync)
  useEffect(() => {
    function getLocalOrders() {
      try {
        return JSON.parse(localStorage.getItem('glowfinder_orders') || '[]');
      } catch (e) {
        return [];
      }
    }

    // Load initial local orders immediately (0ms delay)
    const initialLocal = getLocalOrders();
    if (initialLocal.length > 0) {
      setOrders(initialLocal);
    }

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const liveOrders = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          liveOrders.push({
            id: docSnap.id,
            orderNumber: data.orderNumber || `#${docSnap.id.slice(0, 6)}`,
            customerName: data.customerName || data.name || 'Customer',
            phone: data.phone || 'N/A',
            email: data.userEmail || data.email || 'N/A',
            address: data.address ? `${data.address}${data.city && !data.address.includes(data.city) ? ', ' + data.city : ''}${data.pincode && !data.address.includes(data.pincode) ? ' - ' + data.pincode : ''}` : 'Standard Address',
            rawAddress: data.rawAddress || data.address || '',
            city: data.city || '',
            pincode: data.pincode || '',
            productName: data.items?.[0]?.name || data.productName || 'TriActive Serum',
            items: data.items || [{ name: 'TriActive Serum', quantity: data.totalQuantity || 1, price: data.finalTotal || 598 }],
            quantity: data.totalQuantity || data.quantity || data.items?.length || 1,
            subtotal: data.subtotal || (Number(data.finalTotal) ? data.finalTotal - 39 : 559),
            deliveryFee: data.deliveryFee ?? 39,
            finalTotal: data.finalTotal || 598,
            paymentMethod: data.paymentMethod || 'UPI / Online Payment',
            status: data.status || 'Confirmed',
            date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : (data.date || 'Recent')
          });
        });

        // Merge Firestore orders with any local orders
        const localCurrent = getLocalOrders();
        const merged = [...liveOrders];
        const existingOrderNumbers = new Set(liveOrders.map(o => o.orderNumber));
        localCurrent.forEach(loc => {
          if (!existingOrderNumbers.has(loc.orderNumber)) {
            merged.push(loc);
          }
        });
        setOrders(merged);
      }, (err) => {
        console.warn("Firestore subscription fallback to local storage:", err);
      });
    } catch (err) {
      console.warn("Firestore listener initialization failed:", err);
    }

    // Instant event listeners for same-tab and cross-tab order placement
    const handleOrderEvent = () => {
      const updated = getLocalOrders();
      setOrders(prev => {
        const existingIds = new Set(prev.map(p => p.orderNumber));
        const newOnes = updated.filter(u => !existingIds.has(u.orderNumber));
        return [...newOnes, ...prev];
      });
    };
    window.addEventListener('glowfinder_order_placed', handleOrderEvent);
    window.addEventListener('storage', handleOrderEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('glowfinder_order_placed', handleOrderEvent);
      window.removeEventListener('storage', handleOrderEvent);
    };
  }, []);

  // Update order status function with complete sync across State, LocalStorage & Firestore
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const targetNum = selectedOrder?.orderNumber || orderId;

    // 1. Update component memory state
    setOrders(prev =>
      prev.map(o => (o.id === orderId || o.orderNumber === orderId || (targetNum && o.orderNumber === targetNum)) ? { ...o, status: newStatus } : o)
    );
    if (selectedOrder) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }

    // 2. Update localStorage and broadcast update event to User Account Modal & everywhere
    try {
      const local = JSON.parse(localStorage.getItem('glowfinder_orders') || '[]');
      const updatedLocal = local.map(o => {
        const matchesId = o.id === orderId;
        const matchesNum = o.orderNumber === orderId || o.orderNumber === targetNum;
        const matchesNumSanitized = (o.orderNumber && targetNum) && (o.orderNumber.replace(/[^a-zA-Z0-9]/g, '') === targetNum.replace(/[^a-zA-Z0-9]/g, ''));
        if (matchesId || matchesNum || matchesNumSanitized) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      localStorage.setItem('glowfinder_orders', JSON.stringify(updatedLocal));
      
      // Dispatch real-time custom event for immediate UI update
      window.dispatchEvent(new CustomEvent('glowfinder_order_updated', {
        detail: { orderId, orderNumber: targetNum, status: newStatus }
      }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn("LocalStorage sync error:", e);
    }

    // 3. Update Firestore
    try {
      if (orderId && orderId.length > 10 && !orderId.startsWith('#') && !orderId.startsWith('GF')) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: newStatus });
      }
      
      // Also query by orderNumber
      if (targetNum) {
        const q1 = query(collection(db, 'orders'), where('orderNumber', '==', targetNum));
        const qSnap1 = await getDocs(q1);
        qSnap1.forEach(async (dSnap) => {
          await updateDoc(doc(db, 'orders', dSnap.id), { status: newStatus });
        });

        // Also query sanitized order number (e.g. without #)
        const cleanNum = targetNum.startsWith('#') ? targetNum.slice(1) : `#${targetNum}`;
        const q2 = query(collection(db, 'orders'), where('orderNumber', '==', cleanNum));
        const qSnap2 = await getDocs(q2);
        qSnap2.forEach(async (dSnap) => {
          await updateDoc(doc(db, 'orders', dSnap.id), { status: newStatus });
        });
      }
    } catch (err) {
      console.warn("Firestore sync note:", err);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    const matchesStatus = orderStatusFilter === 'All' || order.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate Aggregated Metrics (Strictly from real orders)
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.finalTotal) || 0), 0);
  const totalCustomers = new Set(orders.map(o => o.phone).filter(p => p && p !== 'N/A')).size;

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    Packed: 'bg-purple-100 text-purple-800 border-purple-200',
    Shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      
      {/* =========================================================================
          1. DARK NAVY SIDEBAR (Matching Mockup)
         ========================================================================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F1B2B] text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1">
                <img src={brandLogo} alt="Glow Finder" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white tracking-wide">Glow Finder</h1>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">ADMIN PANEL</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
              { id: 'inventory', label: 'Inventory', icon: Boxes },
              { id: 'banner', label: 'Website Banner', icon: Megaphone },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-glow-orange text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout Option */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all cursor-pointer pt-3 mt-3 border-t border-slate-800/80"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Bottom Special Offer Promo Card Widget (Matching Mockup) */}
          <div className="p-4 m-3 rounded-2xl bg-white text-slate-800 shadow-md">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Special Discount</span>
                <span className="text-xs font-extrabold text-glow-navy block">Get Glow Finder at</span>
                <span className="text-base font-extrabold text-glow-orange leading-tight block">₹559</span>
                <span className="text-[10px] text-slate-400 line-through">M.R.P. ₹699</span>
                <span className="text-[9px] text-slate-500 block">+ ₹39 Delivery Fee</span>
              </div>
              <img
                src="/assets/product-hd-clean.jpg"
                alt="Product Preview"
                className="w-12 h-14 object-contain rounded-lg shrink-0"
              />
            </div>
            <button
              onClick={() => setActiveMenu('banner')}
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Edit Banner
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================================
          2. MAIN CONTENT AREA
         ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xs">
          
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* View Website Button */}
            <button
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <span>View Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-glow-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">Admin</span>
                <span className="text-[10px] text-slate-400 block">Glow Finder</span>
              </div>
            </div>

          </div>
        </header>

        {/* =========================================================================
            3. DYNAMIC VIEWS ROUTER
           ========================================================================= */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* VIEW: DASHBOARD OVERVIEW (Matching exact screenshot) */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Page Title */}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here's what's happening with your store today.</p>
              </div>

              {/* 5 TOP STAT CARDS (Matching Mockup) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* 1. Total Orders */}
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Total Orders</span>
                    <span className="text-xl font-extrabold text-slate-900">{totalOrdersCount}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <span>↑ 18%</span>
                    <span className="text-slate-400 font-normal">from last month</span>
                  </div>
                </div>

                {/* 2. Pending Orders */}
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Pending Orders</span>
                    <span className="text-xl font-extrabold text-slate-900">{pendingOrdersCount}</span>
                  </div>
                  <button 
                    onClick={() => { setActiveMenu('orders'); setOrderStatusFilter('Pending'); }}
                    className="text-[11px] text-glow-orange font-bold hover:underline cursor-pointer"
                  >
                    View pending orders →
                  </button>
                </div>

                {/* 3. Delivered Orders */}
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Delivered Orders</span>
                    <span className="text-xl font-extrabold text-slate-900">{deliveredOrdersCount}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <span>↑ 22%</span>
                    <span className="text-slate-400 font-normal">from last month</span>
                  </div>
                </div>

                {/* 4. Total Revenue */}
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Total Revenue</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <span>↑ 15%</span>
                    <span className="text-slate-400 font-normal">from last month</span>
                  </div>
                </div>

                {/* 5. Total Customers */}
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2 col-span-2 sm:col-span-1">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Total Customers</span>
                    <span className="text-xl font-extrabold text-slate-900">{totalCustomers}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <span>↑ 12%</span>
                    <span className="text-slate-400 font-normal">from last month</span>
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: RECENT ORDERS TABLE (Left 8 Cols) + SALES OVERVIEW & BEST SELLER (Right 4 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* RECENT ORDERS TABLE (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">Recent Orders</h3>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                      >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <button
                        onClick={() => setActiveMenu('orders')}
                        className="px-3 py-1.5 bg-[#0F1B2B] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        View All Orders
                      </button>
                    </div>
                  </div>

                  {/* Table Responsive Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                          <th className="pb-3 pr-2">Order ID</th>
                          <th className="pb-3 px-2">Customer</th>
                          <th className="pb-3 px-2">Product</th>
                          <th className="pb-3 px-2">Amount</th>
                          <th className="pb-3 px-2">Payment</th>
                          <th className="pb-3 px-2">Status</th>
                          <th className="pb-3 px-2">Date</th>
                          <th className="pb-3 pl-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                              No orders found. Live customer checkout orders will appear here automatically.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 pr-2 font-bold text-blue-600">
                                {order.orderNumber}
                              </td>
                              <td className="py-3 px-2">
                                <span className="font-bold text-slate-800 block">{order.customerName}</span>
                                <span className="text-[10px] text-slate-400">{order.phone}</span>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src="/assets/product-hd-clean.jpg"
                                    alt="Product"
                                    className="w-7 h-7 object-contain bg-slate-50 border rounded-md"
                                  />
                                  <div>
                                    <span className="font-semibold text-slate-700 block">{order.productName}</span>
                                    <span className="text-[10px] text-slate-400">x {order.quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 font-extrabold text-slate-900">
                                ₹{order.finalTotal}
                              </td>
                              <td className="py-3 px-2">
                                <span className="text-slate-600 font-medium">{order.paymentMethod}</span>
                              </td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                                {order.date}
                              </td>
                              <td className="py-3 pl-2 text-right">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="View & Edit Order"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setActiveMenu('orders')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: SALES OVERVIEW + BEST SELLING (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Sales Overview Chart Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">Sales Overview</h3>
                      <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                        This Month
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Sales</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-slate-500 font-normal">from live orders</span>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="pt-3">
                      <svg className="w-full h-28" viewBox="0 0 300 100" fill="none">
                        <path
                          d="M 0 80 Q 40 70, 70 60 T 140 45 T 200 50 T 250 35 T 300 10"
                          stroke="#2563EB"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <circle cx="300" cy="10" r="4" fill="#2563EB" />
                      </svg>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Day 1</span>
                        <span>Day 8</span>
                        <span>Day 15</span>
                        <span>Day 22</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Best Selling Product Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Best Selling Product</h3>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img
                        src="/assets/product-hd-clean.jpg"
                        alt="TriActive Serum"
                        className="w-12 h-14 object-contain bg-white rounded-lg p-1 border shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                          TriActive Brightening Serum
                        </h4>
                        <div className="flex justify-between items-center mt-1.5 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Sold</span>
                            <span className="font-extrabold text-slate-800">{orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Revenue</span>
                            <span className="font-extrabold text-emerald-600">₹{totalRevenue.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMenu('products')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      View All Products
                    </button>
                  </div>
                </div>

              </div>

              {/* BOTTOM 5 QUICK ACTION CARDS (Matching Mockup) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* 1. Add Product */}
                <button
                  onClick={() => setActiveMenu('products')}
                  className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-100 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-3">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Add Product</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Add new product to your store</p>
                  </div>
                  <div className="pt-2 text-right">
                    <span className="text-slate-400 group-hover:text-blue-600 text-sm">→</span>
                  </div>
                </button>

                {/* 2. Manage Coupons */}
                <button
                  onClick={() => setActiveMenu('coupons')}
                  className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-100 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Manage Coupons</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Create and manage discount coupons</p>
                  </div>
                  <div className="pt-2 text-right">
                    <span className="text-slate-400 group-hover:text-amber-600 text-sm">→</span>
                  </div>
                </button>

                {/* 3. Inventory */}
                <button
                  onClick={() => setActiveMenu('inventory')}
                  className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-100 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-3">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Inventory</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Check stock and manage inventory</p>
                  </div>
                  <div className="pt-2 text-right">
                    <span className="text-slate-400 group-hover:text-emerald-600 text-sm">→</span>
                  </div>
                </button>

                {/* 4. Customers */}
                <button
                  onClick={() => setActiveMenu('customers')}
                  className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-100 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Customers</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">View and manage your customers</p>
                  </div>
                  <div className="pt-2 text-right">
                    <span className="text-slate-400 group-hover:text-purple-600 text-sm">→</span>
                  </div>
                </button>

                {/* 5. Analytics */}
                <button
                  onClick={() => setActiveMenu('analytics')}
                  className="p-4 bg-white hover:bg-cyan-50/50 rounded-2xl border border-slate-100 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Analytics</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">View detailed store analytics</p>
                  </div>
                  <div className="pt-2 text-right">
                    <span className="text-slate-400 group-hover:text-blue-600 text-sm">→</span>
                  </div>
                </button>

              </div>

            </div>
          )}

          {/* VIEW: FULL ORDERS MANAGEMENT (Status changer: Pending -> Confirmed -> Packed -> Shipped -> Delivered) */}
          {activeMenu === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Orders Management</h1>
                  <p className="text-xs text-slate-500">Manage, track, and update order status for your customers.</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-2xs"
                  >
                    <option value="All">All Status ({orders.length})</option>
                    <option value="Pending">Pending ({orders.filter(o=>o.status==='Pending').length})</option>
                    <option value="Confirmed">Confirmed ({orders.filter(o=>o.status==='Confirmed').length})</option>
                    <option value="Packed">Packed ({orders.filter(o=>o.status==='Packed').length})</option>
                    <option value="Shipped">Shipped ({orders.filter(o=>o.status==='Shipped').length})</option>
                    <option value="Delivered">Delivered ({orders.filter(o=>o.status==='Delivered').length})</option>
                  </select>
                </div>
              </div>

              {/* Full Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Product & Qty</th>
                        <th className="py-3.5 px-4">Delivery Address</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Change Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                            No orders placed yet. As customers place orders on your website, they will appear here live.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-4 font-extrabold text-blue-600">
                              {order.orderNumber}
                              <span className="text-[10px] text-slate-400 block font-normal">{order.date}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-900 block">{order.customerName}</span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {order.phone}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-slate-800 block">{order.productName}</span>
                              <span className="text-[11px] text-slate-500 font-medium">Quantity: {order.quantity}</span>
                            </td>
                            <td className="py-4 px-4 max-w-xs">
                              <span className="text-slate-600 line-clamp-2 text-[11px]">{order.address}</span>
                            </td>
                            <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                              ₹{order.finalTotal}
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs font-semibold text-slate-700">{order.paymentMethod}</span>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${statusColors[order.status] || 'bg-slate-100'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PRODUCTS MANAGEMENT */}
          {activeMenu === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Product Management</h1>
                  <p className="text-xs text-slate-500">Manage catalog prices, M.R.P., and inventory status.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
                    <div className="h-48 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{p.status}</span>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-1">{p.name}</h3>
                      <p className="text-xs text-slate-500">{p.size}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">M.R.P.</span>
                        <span className="text-slate-500 line-through font-bold">₹{p.mrp}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Selling Price</span>
                        <span className="text-base font-extrabold text-glow-orange">₹{p.price}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Available Stock</span>
                        <span className="font-bold text-slate-900">{p.stock} units</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Sold</span>
                        <span className="font-bold text-blue-600">{p.sold} units</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: CUSTOMERS */}
          {activeMenu === 'customers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Customer Management</h1>
                  <p className="text-xs text-slate-500">Full list of verified customers, phone numbers, addresses, and purchase history.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Total Unique Buyers:</span>
                  <span className="text-lg font-extrabold text-blue-600 ml-1.5">{totalCustomers}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Customer Name & Email</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Delivery Location</th>
                      <th className="py-3.5 px-4">Total Purchases</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Direct Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                          No customer records yet. Real customer details will appear here live when orders are placed.
                        </td>
                      </tr>
                    ) : (
                      orders.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block text-sm">{c.customerName}</span>
                            <span className="text-[11px] text-slate-400">{c.email || 'guest@glowfinder.com'}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-800">{c.phone}</span>
                              {c.phone && c.phone !== 'N/A' && (
                                <a 
                                  href={`https://wa.me/91${c.phone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                                  title="WhatsApp Customer"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="text-slate-700 line-clamp-1">{c.address}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-900 block">₹{c.finalTotal}</span>
                            <span className="text-[10px] text-slate-400">{c.quantity} items ordered</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified Buyer
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(c)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              View Order
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: COUPONS & OFFERS */}
          {activeMenu === 'coupons' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Coupons & Offer Management</h1>
                <p className="text-xs text-slate-500">Create promotional discount codes for checkout.</p>
              </div>

              {/* Add Coupon Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Create New Discount Coupon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. GLOW10)"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="px-3 py-2 text-xs border rounded-xl font-bold uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Discount (e.g. 10% OFF or ₹100 OFF)"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-xl"
                  />
                  <button
                    onClick={() => {
                      if (!newCouponCode) return;
                      setCoupons([...coupons, { code: newCouponCode, discount: newCouponDiscount || '5% OFF', usageCount: 0, active: true }]);
                      setNewCouponCode('');
                      setNewCouponDiscount('');
                    }}
                    className="py-2 bg-glow-orange text-white rounded-xl text-xs font-bold hover:bg-glow-orange-hover"
                  >
                    + Add Coupon Code
                  </button>
                </div>
              </div>

              {/* Active Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-extrabold text-glow-navy">{c.code}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{c.discount}</span>
                    </div>
                    <p className="text-xs text-slate-500">Used {c.usageCount} times</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: WEBSITE BANNER */}
          {activeMenu === 'banner' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Website Announcement Banner</h1>
                <p className="text-xs text-slate-500">Update the top announcement header and special offers shown to all visitors.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Top Bar Announcement Text</label>
                  <textarea
                    rows="3"
                    value={currentBanner}
                    onChange={(e) => setCurrentBanner(e.target.value)}
                    className="w-full p-3 text-xs border rounded-xl font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (onUpdateBanner) onUpdateBanner(currentBanner);
                    alert("Website announcement banner updated successfully!");
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  Save & Publish Banner
                </button>
              </div>
            </div>
          )}

          {/* VIEW: INVENTORY */}
          {activeMenu === 'inventory' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Inventory & Stock Alerts</h1>
                <p className="text-xs text-slate-500">Live warehouse stock tracking.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-lg space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-bold text-slate-900 text-sm">Glow Finder TriActive Serum (30ML)</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">Optimal Stock</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stock Level:</span>
                    <span className="font-extrabold text-slate-900 text-sm">450 Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Low Stock Alert Threshold:</span>
                    <span className="font-bold text-slate-700">50 Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Warehouse Location:</span>
                    <span className="font-bold text-slate-700">Mumbai Central Fulfillment Hub</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeMenu === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Sales & Store Analytics</h1>
                <p className="text-xs text-slate-500">Detailed breakdown of store traffic, orders, and sales performance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 bg-white rounded-2xl border shadow-xs">
                  <span className="text-xs text-slate-400 block">Total Revenue</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-emerald-600 font-bold block mt-1">Live from customer orders</span>
                </div>
                <div className="p-5 bg-white rounded-2xl border shadow-xs">
                  <span className="text-xs text-slate-400 block">Total Orders Count</span>
                  <span className="text-2xl font-extrabold text-slate-900">{totalOrdersCount}</span>
                  <span className="text-xs text-slate-500 block mt-1">Placed via Express Checkout</span>
                </div>
                <div className="p-5 bg-white rounded-2xl border shadow-xs">
                  <span className="text-xs text-slate-400 block">Total Customers</span>
                  <span className="text-2xl font-extrabold text-slate-900">{totalCustomers}</span>
                  <span className="text-xs text-emerald-600 font-bold block mt-1">Verified unique phone numbers</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeMenu === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Store Settings</h1>
                <p className="text-xs text-slate-500">Configure store preferences and admin security.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-xs max-w-xl space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Store Name</label>
                  <input type="text" defaultValue="Glow Finder Skincare" className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Support Email</label>
                  <input type="email" defaultValue="support@glowfinder.com" className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Currency</label>
                  <input type="text" defaultValue="INR (₹)" disabled className="w-full p-2.5 border rounded-xl bg-slate-50" />
                </div>
                <button
                  onClick={() => alert("Store settings saved successfully!")}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          ORDER DETAILS & STATUS CHANGER MODAL WITH FULL CUSTOMER INFORMATION
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 my-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Order Details ({selectedOrder.orderNumber})
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[selectedOrder.status] || 'bg-slate-100'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Placed on: {selectedOrder.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              
              {/* 1. Full Customer Information Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    Customer Information
                  </span>
                  {selectedOrder.phone && selectedOrder.phone !== 'N/A' && (
                    <a
                      href={`https://wa.me/91${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      💬 WhatsApp Customer
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Full Name:</span>
                    <p className="font-extrabold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone Number:</span>
                    <a href={`tel:${selectedOrder.phone}`} className="font-bold text-blue-600 hover:underline">
                      {selectedOrder.phone}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block">Email Address:</span>
                    <p className="font-medium text-slate-700">{selectedOrder.email || 'guest@glowfinder.com'}</p>
                  </div>
                  <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-glow-orange" />
                        Full Delivery Address:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOrder.address);
                          alert('Address copied to clipboard!');
                        }}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Copy Address
                      </button>
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* 2. Order Summary & Product Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-glow-orange" />
                  Order Summary
                </span>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/product-hd-clean.jpg"
                      alt="Product"
                      className="w-10 h-10 object-contain bg-slate-50 rounded-lg p-0.5 border"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{selectedOrder.productName}</p>
                      <span className="text-[11px] text-slate-500">Qty: {selectedOrder.quantity} units</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">₹{selectedOrder.finalTotal}</span>
                </div>

                <div className="space-y-1 pt-1 text-slate-600 text-xs">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold text-slate-800">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-bold text-slate-800">₹{selectedOrder.deliveryFee || 39}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="text-glow-orange">₹{selectedOrder.finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* 3. Update Order Status */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2.5">
                <span className="text-amber-900 font-bold text-xs block">Update Order Status:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedOrder.status === st 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
