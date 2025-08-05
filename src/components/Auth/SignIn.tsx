import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        // If login fails, show error under password field
        setPasswordError(result.error || 'Login failed');
      }
    } catch {
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* INTRO Title */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold">
            INTRO
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address Field */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(''); // Clear error when user types
              }}
              placeholder="Enter work email"
              className={`w-full px-4 py-3 bg-[#2a2d31] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-400">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(''); // Clear error when user types
                }}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 bg-[#2a2d31] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  passwordError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-400">{passwordError}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors focus:outline-none focus:underline"
              onClick={() => {
                // Handle forgot password functionality here
                console.log('Forgot password clicked');
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1b1e]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 