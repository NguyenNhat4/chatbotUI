"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '@/types/auth';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://denti-chatbot.hiaivn.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { 
          success: false, 
          error: `Login failed: ${response.status} ${response.statusText}` 
        };
      }

      const userData = await response.json();
      
      // Validate that the userData has the expected shape
      if (!userData || typeof userData !== 'object' || !('email' in userData)) {
        return {
          success: false,
          error: 'Invalid response format from server'
        };
      }
      
      // Store user in state, localStorage, and a cookie
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set a cookie for server-side access (used by middleware)
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${30 * 24 * 60 * 60}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Clear the cookie as well
    document.cookie = 'user=; path=/; max-age=0';
    
    // Use window.location for a full page refresh instead of router.push
    // This ensures the middleware properly handles the redirect
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
