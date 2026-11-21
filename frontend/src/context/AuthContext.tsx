import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemoDriver: () => Promise<void>;
  loginAsDemoPassenger: () => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dz_current_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('dz_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('dz_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('dz_current_user', JSON.stringify(currentUser));
    } catch {
      const cached = localStorage.getItem('dz_current_user');
      if (cached) {
        setUser(JSON.parse(cached));
      } else {
        localStorage.removeItem('dz_token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await api.login({ email, password: pass });
    localStorage.setItem('dz_token', response.access_token);
    localStorage.setItem('dz_current_user', JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
  };

  const loginAsDemoDriver = async () => {
    try {
      await login('amine.benali@dz-carpool.dz', 'password123');
    } catch {
      const driver = DEMO_USERS.driver;
      const fakeToken = 'demo_driver_token';
      localStorage.setItem('dz_token', fakeToken);
      localStorage.setItem('dz_current_user', JSON.stringify(driver));
      setToken(fakeToken);
      setUser(driver);
    }
  };

  const loginAsDemoPassenger = async () => {
    try {
      await login('amina.mansouri@dz-carpool.dz', 'password123');
    } catch {
      const passenger = DEMO_USERS.passenger;
      const fakeToken = 'demo_passenger_token';
      localStorage.setItem('dz_token', fakeToken);
      localStorage.setItem('dz_current_user', JSON.stringify(passenger));
      setToken(fakeToken);
      setUser(passenger);
    }
  };

  const register = async (data: Record<string, unknown>) => {
    const response = await api.register(data);
    localStorage.setItem('dz_token', response.access_token);
    localStorage.setItem('dz_current_user', JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('dz_token');
    localStorage.removeItem('dz_current_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginAsDemoDriver,
        loginAsDemoPassenger,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
