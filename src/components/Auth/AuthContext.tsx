import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid credentials
const VALID_EMAIL = 'designer@callourstudio.com';
const VALID_PASSWORD = 'testing1234';
const STORAGE_KEY = 'intro_auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Basic validation
    if (!email.trim()) {
      return { success: false, error: 'Email cannot be empty' };
    }

    // Check credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const userData: User = {
        email: email,
        name: 'Designer User' // You can extract name from email or set a default
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 