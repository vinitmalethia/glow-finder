import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setMessage('');
  };

  const handleSwitchView = (newView) => {
    resetForm();
    setView(newView);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
        onClose();
      } else if (view === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName);
        onClose();
      } else if (view === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please provide a valid email address.');
      } else {
        setError(err.message || 'Failed to authenticate. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error("Google Sign-In error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setError(`Domain not authorized: Please add "${currentDomain}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing login.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in Firebase Console. Please enable Google under Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'Google Sign-In was cancelled or failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-glow-orange mb-1 shadow-xs border border-amber-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-glow-navy">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Your Glow Account'}
            {view === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {view === 'login' && 'Sign in to access your orders, saved routines, and exclusive offers.'}
            {view === 'signup' && 'Join Glow Finder to track orders and unlock personalized skincare.'}
            {view === 'forgot' && 'Enter your registered email and we’ll send you a password reset link.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200/80 rounded-xl flex items-center gap-2 text-xs text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
            <span>{message}</span>
          </div>
        )}

        {/* Google One-Click Sign In (For login & signup views) */}
        {view !== 'forgot' && (
          <div className="space-y-3 mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 uppercase font-semibold">or email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {view === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white transition-all"
              />
            </div>
          </div>

          {view !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-600">Password</label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot')}
                    className="text-[11px] text-glow-orange hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-xs rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
          >
            <span>
              {loading ? 'Processing...' : view === 'login' ? 'SIGN IN' : view === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
            </span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer View Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {view === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('signup')}
                className="text-glow-orange font-bold hover:underline cursor-pointer ml-1"
              >
                Sign up here
              </button>
            </p>
          )}

          {view === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="text-glow-orange font-bold hover:underline cursor-pointer ml-1"
              >
                Sign in
              </button>
            </p>
          )}

          {view === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="text-glow-orange font-bold hover:underline cursor-pointer ml-1"
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
