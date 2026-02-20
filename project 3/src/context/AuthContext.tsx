import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import API_BASE_URL from '../config/api';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  balance?: number;
  currency?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'admin', phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fs_token'));
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem('fs_token');
      if (!stored) { setLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data.user);
          setToken(stored);
        } else {
          localStorage.removeItem('fs_token');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('fs_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    localStorage.setItem('fs_token', data.token);
    setToken(data.token);
    setUser(data.data.user);
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'admin', phone?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, phone }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('fs_token', data.token);
    setToken(data.token);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      localStorage.removeItem('fs_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
