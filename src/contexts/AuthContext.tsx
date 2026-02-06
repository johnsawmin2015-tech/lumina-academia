import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';
import { MOCK_ADMIN_CREDENTIALS, MOCK_STUDENT_CREDENTIALS } from '@/lib/constants';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'academic_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validate credentials based on role
    if (role === 'admin') {
      if (email === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password) {
        const adminUser = mockUsers.find(u => u.role === 'admin');
        if (adminUser) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
          setState({
            user: adminUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        }
      }
      return { success: false, error: 'Invalid admin credentials. Please check your email and password.' };
    }

    if (role === 'student') {
      if (email === MOCK_STUDENT_CREDENTIALS.email && password === MOCK_STUDENT_CREDENTIALS.password) {
        const studentUser = mockUsers.find(u => u.role === 'student');
        if (studentUser) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(studentUser));
          setState({
            user: studentUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        }
      }
      return { success: false, error: 'Invalid student credentials. Please check your email and password.' };
    }

    return { success: false, error: 'Invalid role specified.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
