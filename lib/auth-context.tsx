"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '@/types/auth';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          return {
            success: false,
            error: 'Email đã được sử dụng'
          };
        }
        if (response.status === 422) {
          return {
            success: false,
            error: 'Mật khẩu phải có ít nhất 6 ký tự'
          };
        }
        return {
          success: false,
          error: `Đăng ký thất bại: ${response.status} ${response.statusText}`
        };
      }

      // After successful registration, automatically login
      return await login(email, password);
    } catch {
      return {
        success: false,
        error: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
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

      const responseData = await response.json();

      // Validate that the responseData has the expected shape
      if (!responseData || typeof responseData !== 'object' || !responseData.access_token || !responseData.user) {
        return {
          success: false,
          error: 'Invalid response format from server'
        };
      }

      // Extract the user data and token
      const userData = responseData.user;
      const token = responseData.access_token;

      // Store user in state
      setUser(userData);

      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);

      // Set a cookie for server-side access (used by middleware)
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${30 * 24 * 60 * 60}`;
      document.cookie = `authToken=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'An error occurred during login. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    // Clear cookies
    document.cookie = 'user=; path=/; max-age=0';
    document.cookie = 'authToken=; path=/; max-age=0';
    
    // Use window.location for a full page refresh instead of router.push
    // This ensures the middleware properly handles the redirect
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
