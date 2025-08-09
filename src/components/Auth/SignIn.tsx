import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const DEMO_CREDENTIAL = { email: 'designer@gmail.com', password: 'test1234' };

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    if (!email.trim()) { setEmailError('Email is required'); isValid = false; }
    if (!password.trim()) { setPasswordError('Password is required'); isValid = false; }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) setPasswordError(result.error || 'Login failed');
    } catch {
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const autofill = () => { setEmail(DEMO_CREDENTIAL.email); setPassword(DEMO_CREDENTIAL.password); };

  return (
    <div className="min-h-screen bg-[#0f1114] text-neutral-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#11141a] rounded-xl shadow-xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-[#0f1114]">
          <h1 className="text-2xl font-semibold">Sign in to OURBOOK</h1>
        </div>

        {/* Demo Credential (collapsible) */}
        <div className="px-6 py-4 bg-[#121826] border-b border-neutral-800">
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            className="w-full flex items-center justify-between"
            aria-expanded={showDemo}
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-400">⚡</span>
              <h2 className="font-medium">Demo Credentials</h2>
              <span className="ml-2 text-xs bg-green-600/80 text-white px-2 py-0.5 rounded-full">Ready to Use</span>
            </div>
            <svg className={`w-4 h-4 text-neutral-400 transition-transform ${showDemo ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Smooth collapse container */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showDemo ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <p className="text-sm text-neutral-400">Use this credential to sign in:</p>
            <div className="mt-3 flex items-center justify-between bg-[#0f141e] border border-neutral-700 rounded-lg p-4">
              <div className="text-sm">
                <div className="mb-2">
                  <span className="text-neutral-400">Email: </span>
                  <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-blue-300 font-mono">{DEMO_CREDENTIAL.email}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Password: </span>
                  <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-blue-300 font-mono">{DEMO_CREDENTIAL.password}</span>
                </div>
              </div>
              <button
                onClick={autofill}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
              >
                Use This Account
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 bg-[#11141a]">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-[#0f1114] border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors ${
                  emailError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
            </div>
            {emailError && <p className="mt-2 text-sm text-red-400">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-12 bg-[#0f1114] border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors ${
                  passwordError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                disabled={isLoading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                )}
              </button>
            </div>
            {passwordError && <p className="mt-2 text-sm text-red-400">{passwordError}</p>}
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2b9ab3] hover:bg-[#268aa0] disabled:opacity-70 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Footer note */}
          <p className="text-xs text-neutral-500 text-center mt-2">
            This is a demo application. Use the credential above to test login.
          </p>
        </form>
      </div>
    </div>
  );
} 