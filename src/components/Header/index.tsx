import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navigation from './Navigation';
import { useAuth } from '@/components/Auth/AuthContext';
import { TabType } from './Navigation';

export default function Header({ onTabChange }: { onTabChange?: (tabId: TabType) => void }) {
  const { logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEditProfile = () => {
    // Handle edit profile functionality
    console.log('Edit profile clicked');
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && 
          dropdownRef.current && 
          buttonRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="backdrop-blur-sm backdrop-filter sticky top-0 pointer-events-auto">
        <div className="absolute border-b border-neutral-800/30 inset-0 pointer-events-none" />
        
        {/* Top Header Bar */}
        <div className="flex flex-row h-14 items-center justify-between px-7 py-0 relative w-full">
          <div className="font-bold text-lg text-neutral-50">
            INTRO
          </div>
          <div className="flex flex-row-reverse items-center relative">
            {/* User Profile Dropdown */}
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center space-x-3 bg-neutral-800 hover:bg-neutral-700 h-[34px] px-3 rounded-md transition-colors duration-200"
              title="User menu"
            >
              {/* Avatar */}
              <div className="w-6 h-6 bg-[#359aba] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              
              {/* User Name */}
              <span className="font-normal text-white text-xs max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
              
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu - Using Portal to prevent stacking context issues */}
            {showDropdown && typeof document !== 'undefined' && createPortal(
              <div 
                ref={dropdownRef}
                className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg min-w-[160px] overflow-hidden"
                style={{
                  zIndex: 999999,
                  position: 'fixed',
                  right: buttonRef.current ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 0,
                  top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
                }}
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-neutral-700">
                  <p className="text-sm text-white font-medium truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {user?.email || ''}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
              </div>
              </div>,
              document.body
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <Navigation onTabChange={onTabChange} />
      </div>
    </div>
  );
} 