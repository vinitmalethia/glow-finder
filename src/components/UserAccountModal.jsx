import React, { useState, useEffect } from 'react';
import { X, User, Package, LogOut, Calendar, MapPin, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UserAccountModal({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'

  useEffect(() => {
    async function fetchOrders() {
      if (!currentUser) return;
      setLoadingOrders(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userEmail', '==', currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending
        fetchedOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      setLoadingOrders(false);
    }

    if (isOpen && currentUser) {
      fetchOrders();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = currentUser.displayName || currentUser.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-glow-orange flex items-center justify-center font-extrabold text-lg border border-amber-200/60 shadow-xs">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={displayName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                initial
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-glow-navy leading-tight">{displayName}</h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 my-4 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-glow-navy shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-glow-navy shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-glow-navy">No orders placed yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    When you order your Glow Finder TriActive Serum, your live order details will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2.5">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 text-xs">
                        <div>
                          <span className="font-extrabold text-glow-navy block">Order #{order.orderNumber || order.id.slice(0, 8)}</span>
                          <span className="text-[10px] text-slate-400">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent Order'}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {order.status || 'Confirmed & Processing'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Items:</span>
                          <span className="font-semibold text-glow-navy">{order.totalQuantity || 1}x TriActive Serum</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Delivery Address:</span>
                          <span className="font-medium text-slate-700 truncate max-w-[220px]">
                            {order.address || order.city || 'Standard Address'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Payment Mode:</span>
                          <span className="font-medium text-glow-navy">{order.paymentMethod || 'UPI / Online'}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-glow-navy text-sm pt-1 border-t border-slate-200">
                          <span>Total Amount Paid:</span>
                          <span className="text-glow-orange">₹{order.finalTotal || 598}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Registered Email</span>
                <span className="font-bold text-glow-navy text-sm">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Display Name</span>
                <span className="font-bold text-glow-navy text-sm">{displayName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account ID (UID)</span>
                <span className="font-mono text-[11px] text-slate-500 break-all">{currentUser.uid}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 text-green-700 font-semibold text-[11px]">
                <Sparkles className="w-4 h-4 text-glow-orange" />
                <span>Verified Glow Member</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl text-xs font-bold bg-glow-navy hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
