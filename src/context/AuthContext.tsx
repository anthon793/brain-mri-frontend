import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { authService } from '../api';
import { setToken, setRefreshToken, clearTokens } from '../api/client';

// ─── Context Shape ───────────────────────────────────────
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Session Storage Keys ────────────────────────────────
const STORAGE_KEY = 'neuroscan_session';

// ─── Provider ────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Try API first
        const response = await authService.login({ email, password });
        const { user: apiUser, token: authToken, refreshToken: authRefresh } = response;
        setToken(authToken);
        setRefreshToken(authRefresh);
        const sessionUser: User = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          password: '',
          role: apiUser.role,
          avatar: apiUser.avatar,
          department: apiUser.department,
          isActive: apiUser.isActive,
          lastLogin: apiUser.lastLogin,
        };
        setUser(sessionUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
        return { success: true };
      } catch {
        // Fallback to mock data if backend is unavailable
        await new Promise((resolve) => setTimeout(resolve, 800));

        const found = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }

        if (!found.isActive) {
          return { success: false, error: 'Account is deactivated. Contact your administrator.' };
        }

        const sessionUser = { ...found, lastLogin: new Date().toISOString() };
        setUser(sessionUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
        return { success: true };
      }
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    clearTokens();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
