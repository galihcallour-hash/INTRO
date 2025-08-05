'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/components/Auth/AuthContext';
import SignIn from '@/components/Auth/SignIn';
import Dashboard from '@/components/Dashboard/Dashboard';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
