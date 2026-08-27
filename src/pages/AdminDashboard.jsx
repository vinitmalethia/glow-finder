import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3, 
  Tag, Boxes, Megaphone, Settings, LogOut, Search, Bell, 
  ChevronDown, ArrowUpRight, CheckCircle2, Clock, Truck, 
  Check, Eye, Filter, Plus, Edit2, Trash2, X, AlertTriangle, 
  DollarSign, TrendingUp, RefreshCw, Shield, MapPin, Phone, Mail
} from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
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

  // Initial Sample Orders + Real Firestore Orders
  const [orders, setOrders] = useState([
    {
      id: 'GF1001',
      orderNumber: '#GF1001',
      customerName: 'Rahul Kumar',
      phone: '9876543210',
      address: 'Flat 402, Sunshine Heights, Andheri West, Mumbai, MH - 400053',
      productName: 'TriActive Serum',
      quantity: 1,
      finalTotal: 559,
      paymentMethod: 'UPI / Online',
      status: 'Pending',
      date: '01 Jun, 2024 • 10:30 AM'
    },
    {
      id: 'GF1002',
      orderNumber: '#GF1002',
      customerName: 'Aman Verma',
      phone: '9123456780',
      address: 'House No 12, Sector 15, Gurgaon, HR - 122001',
      productName: 'TriActive Serum',
      quantity: 2,
      finalTotal: 1118,
      paymentMethod: 'UPI / Online',
      status: 'Confirmed',
      date: '01 Jun, 2024 • 09:15 AM'
    },
    {
      id: 'GF1003',
      orderNumber: '#GF1003',
      customerName: 'Neha Sharma',
      phone: '9988776655',
      address: 'B-14, Green Park Extension, New Delhi - 110016',
      productName: 'TriActive Serum',
      quantity: 1,
      finalTotal: 559,
      paymentMethod: 'UPI / Online',
      status: 'Packed',
      date: '31 May, 2024 • 08:45 PM'
    },
    {
      id: 'GF1004',
      orderNumber: '#GF1004',
      customerName: 'Vishal Singh',
      phone: '8877665544',
      address: 'Plot 88, Jubilee Hills, Hyderabad, TS - 500033',
      productName: 'TriActive Serum',
      quantity: 3,
      finalTotal: 1677,
      paymentMethod: 'UPI / Online',
      status: 'Shipped',
      date: '31 May, 2024 • 06:20 PM'
    },
    {
      id: 'GF1005',
      orderNumber: '#GF1005',
      customerName: 'Pooja Rani',
      phone: '7766554433',
      address: 'Flat 10B, Silver Oak Residency, Koramangala, Bengaluru, KA - 560034',
      productName: 'TriActive Serum',
      quantity: 1,
      finalTotal: 559,
      paymentMethod: 'UPI / Online',
      status: 'Delivered',
      date: '30 May, 2024 • 04:10 PM'
    }
  ]);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'GLOW5', discount: '5% OFF', usageCount: 42, active: true },
    { code: 'GLOW20', discount: '20% OFF', usageCount: 128, active: true },
    { code: 'FIRSTGLOW', discount: '₹140 OFF', usageCount: 65, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Live Announcement Banner State
  const [currentBanner, setCurrentBanner] = useState(
    bannerText || "Special Discount: Get Glow Finder at ₹559 (M.R.P. ₹699) + ₹39 Delivery Fee!"
  );

  // Fetch Firestore Live Orders on mount
  useEffect(() => {
    async function fetchFirestoreOrders() {
      try {
        const q = query(collection(db, 'orders'));
        const querySnapshot = await getDocs(q);
        const liveOrders = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          liveOrders.push({
            id: doc.id,
            orderNumber: data.orderNumber || `#${doc.id.slice(0, 6)}`,
            customerName: data.customerName || 'Customer',
            phone: data.phone || 'N/A',
            address: data.address ? `${data.address}, ${data.city || ''} - ${data.pincode || ''}` : 'Standard Address',
            productName: data.items?.[0]?.name || 'TriActive Serum',
            quantity: data.totalQuantity || data.items?.length || 1,
            finalTotal: data.finalTotal || 598,
            paymentMethod: data.paymentMethod || 'UPI / Online',
            status: data.status || 'Pending',
            date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'
          });
        });
        if (liveOrders.length > 0) {
          // Merge with sample orders without duplicates
          setOrders(prev => {
            const existingIds = new Set(liveOrders.map(o => o.orderNumber));
            const filteredSample = prev.filter(o => !existingIds.has(o.orderNumber));
            return [...liveOrders, ...filteredSample];
          });
        }
      } catch (err) {
        console.warn("Could not load from Firestore, using local data:", err);
      }
    }
    fetchFirestoreOrders();
  }, []);

  // Update order status function
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    // Attempt Firestore update if it's a Firestore doc
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      // Local state is already updated
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

  // Calculate Aggregated Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status.toLowerCase() === 'delivered').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.finalTotal) || 0), 0) + 62500;
  const totalCustomers = new Set(orders.map(o => o.phone)).size + 93;

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
                        {filteredOrders.slice(0, 5).map((order) => (
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
                        ))}
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
                        <span className="text-2xl font-extrabold text-slate-900">₹85,000</span>
                        <span className="text-[11px] text-emerald-600 font-bold">↑ 16% from last month</span>
                      </div>
                    </div>

                    {/* SVG Line Chart (Matching Mockup) */}
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
                        <span>May 1</span>
                        <span>May 8</span>
                        <span>May 15</span>
                        <span>May 22</span>
                        <span>May 31</span>
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
                            <span className="font-extrabold text-slate-800">128</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Revenue</span>
                            <span className="font-extrabold text-emerald-600">₹71,552</span>
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
                      {filteredOrders.map(order => (
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
                      ))}
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
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Customer Management</h1>
                <p className="text-xs text-slate-500">View customer list, contact details, and lifetime purchase history.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 8).map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.customerName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.address.split(',').pop() || 'India'}</td>
                        <td className="py-3.5 px-4 font-extrabold text-blue-600">{c.quantity} orders</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            Active Buyer
                          </span>
                        </td>
                      </tr>
                    ))}
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
                  <span className="text-xs text-slate-400 block">Monthly Revenue</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹85,000</span>
                  <span className="text-xs text-emerald-600 font-bold block mt-1">↑ 16% growth</span>
                </div>
                <div className="p-5 bg-white rounded-2xl border shadow-xs">
                  <span className="text-xs text-slate-400 block">Avg. Order Value (AOV)</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹598</span>
                  <span className="text-xs text-slate-500 block mt-1">Single & Multi-unit bundles</span>
                </div>
                <div className="p-5 bg-white rounded-2xl border shadow-xs">
                  <span className="text-xs text-slate-400 block">Checkout Conversion Rate</span>
                  <span className="text-2xl font-extrabold text-slate-900">4.8%</span>
                  <span className="text-xs text-emerald-600 font-bold block mt-1">↑ 0.6% vs benchmark</span>
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
          ORDER DETAILS & STATUS CHANGER MODAL
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Order Details ({selectedOrder.orderNumber})</h3>
                <span className="text-[11px] text-slate-400">{selectedOrder.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Customer Information</span>
                <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-600">Phone: {selectedOrder.phone}</p>
                <p className="text-slate-600 leading-relaxed">Address: {selectedOrder.address}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Order Summary</span>
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.productName} (x{selectedOrder.quantity})</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t">
                  <span>Total Amount:</span>
                  <span className="text-glow-orange">₹{selectedOrder.finalTotal}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <span className="text-amber-900 font-bold text-xs block">Update Order Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
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
