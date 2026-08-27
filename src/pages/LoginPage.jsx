import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, 
  Sparkles, Leaf, FlaskConical, AlertCircle, CheckCircle2 
} from 'lucide-react';
import brandLogo from '../assets/glow-finder-logo.png';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigateHome, onLoginSuccess, onNavigateAdmin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      } else if (isSignUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName);
        if (onLoginSuccess) onLoginSuccess();
        if (onNavigateHome) onNavigateHome();
      } else {
        await login(email, password);
        if (onLoginSuccess) onLoginSuccess();
        if (onNavigateHome) onNavigateHome();
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
      if (onNavigateHome) onNavigateHome();
    } catch (err) {
      console.error(err);
      setError('Google Sign-In was cancelled or failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-[#F5F8FC] via-[#EEF4FB] to-[#E5EFF8] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decorative Water Glow / Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Bubbles */}
      <div className="absolute top-1/3 left-1/2 w-8 h-8 rounded-full bg-white/40 backdrop-blur-xs border border-white/60 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full bg-white/30 backdrop-blur-xs border border-white/50 pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* =========================================================================
            LEFT COLUMN: BRAND SHOWCASE & VALUE PROPOSITION
           ========================================================================= */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
          
          {/* Brand Logo Header */}
          <button 
            onClick={onNavigateHome}
            className="flex items-center group cursor-pointer text-left transition-transform hover:opacity-90"
          >
            <img
              src={brandLogo}
              alt="Glow Finder Logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </button>

          {/* Pill Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-extrabold uppercase tracking-wider shadow-2xs border border-amber-200/50">
              <Sparkles className="w-3.5 h-3.5 text-glow-orange" />
              <span>DISCOVER YOUR GLOW</span>
            </span>
          </div>

          {/* Large Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B2A4A] tracking-tight leading-[1.15]">
              {isSignUp ? 'Create Your Account' : isForgotPassword ? 'Forgot Password?' : 'Welcome Back!'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
              {isSignUp 
                ? 'Join Glow Finder today and unlock personalized skincare routines and exclusive offers.'
                : isForgotPassword
                ? 'Enter your registered email address and we will send you a secure link to reset your password.'
                : 'Login to continue your skincare journey and discover products that bring out your natural glow.'}
            </p>
          </div>

          {/* 3 Benefit Items with Minimal Circle Icons */}
          <div className="space-y-4 pt-2">
            
            {/* 1. Secure & Private */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-glow-navy leading-tight">Secure & Private</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your data is 100% safe with us</p>
              </div>
            </div>

            {/* 2. Premium Quality */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Leaf className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-glow-navy leading-tight">Premium Quality</h4>
                <p className="text-xs text-slate-500 mt-0.5">Carefully curated, clinically tested</p>
              </div>
            </div>

            {/* 3. Dermatologically Tested */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <FlaskConical className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-glow-navy leading-tight">Dermatologically Tested</h4>
                <p className="text-xs text-slate-500 mt-0.5">Safe and effective for your skin</p>
              </div>
            </div>

          </div>

          {/* Bottom Product Showcase on Clean Pedestal */}
          <div className="pt-4 max-w-sm">
            <div className="relative">
              <img
                src="/assets/product-hd-clean.jpg"
                alt="Glow Finder TriActive Serum and Box"
                className="w-full h-44 object-contain rounded-2xl drop-shadow-md"
              />
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: THE LOGIN / SIGNUP CARD
           ========================================================================= */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 p-6 sm:p-10 space-y-6">
            
            {/* Form Header */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-glow-navy tracking-tight">
                {isForgotPassword 
                  ? 'Reset Password' 
                  : isSignUp 
                  ? 'Create Your Account' 
                  : 'Login to Your Account'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isForgotPassword
                  ? 'Enter your email to receive recovery instructions'
                  : isSignUp
                  ? 'Sign up in less than 30 seconds'
                  : 'Enter your details to access your account'}
              </p>
            </div>

            {/* Error / Feedback Notice */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3.5 bg-green-50 border border-green-200/80 rounded-xl flex items-center gap-2.5 text-xs text-green-700 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                <span>{message}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name Field (Signup Mode only) */}
              {isSignUp && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:ring-2 focus:ring-glow-orange/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Email Address Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:ring-2 focus:ring-glow-orange/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              {!isForgotPassword && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-glow-navy focus:outline-none focus:border-glow-orange focus:ring-2 focus:ring-glow-orange/20 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link */}
              {!isSignUp && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                      setMessage('');
                    }}
                    className="text-xs font-bold text-glow-orange hover:text-glow-orange-hover hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-glow-orange hover:bg-glow-orange-hover text-white font-bold text-sm rounded-xl shadow-glow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>
                  {loading 
                    ? 'Processing...' 
                    : isForgotPassword 
                    ? 'Send Reset Link' 
                    : isSignUp 
                    ? 'Create Account' 
                    : 'Login'}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

            </form>

            {/* Social Divider */}
            {!isForgotPassword && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200/80" />
                  <span className="text-xs text-slate-400 font-normal">or continue with</span>
                  <div className="flex-1 h-px bg-slate-200/80" />
                </div>

                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all flex items-center justify-center gap-3 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

                {/* Facebook Sign-In */}
                <button
                  type="button"
                  onClick={() => alert("Facebook login will be available soon. Please use Google or Email to login instantly!")}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all flex items-center justify-center gap-3 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>
            )}

            {/* Bottom Toggle Link */}
            <div className="pt-2 text-center text-xs sm:text-sm text-slate-600">
              {isForgotPassword ? (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsSignUp(false);
                      setError('');
                      setMessage('');
                    }}
                    className="font-bold text-glow-orange hover:underline cursor-pointer ml-1"
                  >
                    Back to Login
                  </button>
                </p>
              ) : isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                      setMessage('');
                    }}
                    className="font-bold text-glow-orange hover:underline cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </p>
              ) : (
                <p>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                      setMessage('');
                    }}
                    className="font-bold text-glow-orange hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>

            {/* Admin Portal Direct Access Button */}
            <div className="pt-3 border-t border-slate-100/90 text-center">
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-glow-orange" />
                <span>Admin Portal Login</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
