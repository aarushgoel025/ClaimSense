import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';

// ──────────────────────────────────────────────────────────
// LoginPage Component
// ──────────────────────────────────────────────────────────
// A premium login/signup page with:
//  - Email + Password authentication via Supabase
//  - Toggle between Sign In and Sign Up modes
//  - Password visibility toggle
//  - Error display with contextual messages
//  - Full light/dark theme support
// ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setSuccess('Account created! Check your email for a confirmation link, then sign in.');
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
        }
        // On success, the AuthContext listener will update the user state automatically
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-arctic-bg text-text-muted">
      {/* Background with Hero Section */}
      <div className="relative overflow-hidden bg-navy-deep flex-grow flex flex-col">
        {/* Giant Watermark */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[400px] font-display font-extrabold text-white/[0.03] select-none pointer-events-none leading-none z-0">
          CS
        </div>

        {/* Floating Orbs (decorative) */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-orange/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Logo Header */}
        <header className="relative z-50 max-w-7xl mx-auto w-full px-6 pt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-neon-orange/20 flex items-center justify-center text-neon-orange font-display font-bold text-2xl">C</div>
            <h1 className="text-3xl font-display font-light text-white tracking-tight">
              Claim<span className="font-bold text-neon-orange">Sense</span>
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center px-6 py-16 relative z-10">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-arctic-card rounded-2xl shadow-2xl border border-border-default/50 overflow-hidden">
              {/* Card Header */}
              <div className="bg-arctic-secondary px-8 py-6 border-b border-border-default">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-electric-blue/10 rounded-lg text-electric-blue">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-navy-deep">
                      {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      {isSignUp
                        ? 'Join ClaimSense to start fighting rejections'
                        : 'Sign in to access your claims dashboard'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-deep mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-arctic-bg border border-border-default rounded-xl text-navy-deep placeholder:text-text-muted/50 focus:ring-4 focus:ring-electric-blue/20 focus:border-electric-blue outline-none transition-all duration-300 text-sm"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-deep mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-10 pr-12 py-3 bg-arctic-bg border border-border-default rounded-xl text-navy-deep placeholder:text-text-muted/50 focus:ring-4 focus:ring-electric-blue/20 focus:border-electric-blue outline-none transition-all duration-300 text-sm"
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-navy-deep transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up only) */}
                  {isSignUp && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-semibold text-navy-deep mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full pl-10 pr-4 py-3 bg-arctic-bg border border-border-default rounded-xl text-navy-deep placeholder:text-text-muted/50 focus:ring-4 focus:ring-electric-blue/20 focus:border-electric-blue outline-none transition-all duration-300 text-sm"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-danger-red/10 border border-danger-red/20 rounded-lg animate-fade-in">
                      <AlertCircle size={16} className="text-danger-red flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-danger-red font-medium">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="flex items-start gap-2 p-3 bg-success-green/10 border border-success-green/20 rounded-lg animate-fade-in">
                      <ShieldCheck size={16} className="text-success-green flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-success-green font-medium">{success}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                      loading
                        ? 'bg-border-default/40 text-text-muted/60 cursor-not-allowed'
                        : 'bg-neon-orange hover:bg-neon-orange-dark text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Toggle Sign In / Sign Up */}
                <div className="mt-6 pt-6 border-t border-border-default/50 text-center">
                  <p className="text-sm text-text-muted">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setSuccess('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="font-bold text-electric-blue hover:text-navy-deep transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Encrypted & Secure
              </span>
              <span>·</span>
              <span>Powered by Supabase</span>
              <span>·</span>
              <span>Zero data selling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
