import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginAsDemoDriver: () => Promise<User>;
  loginAsDemoPassenger: () => Promise<User>;
  register: (data: Record<string, unknown>) => Promise<User>;
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
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dz_token'));
  // If user is already loaded from localStorage, loading is immediately false!
  const [loading, setLoading] = useState<boolean>(() => !localStorage.getItem('dz_current_user') && !!localStorage.getItem('dz_token'));

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('dz_token');
    const cachedUser = localStorage.getItem('dz_current_user');
    
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
      // If network fails or on static host, retain cached user! NEVER kick them out unexpectedly
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.login({ email, password: pass });
      localStorage.setItem('dz_token', response.access_token);
      localStorage.setItem('dz_current_user', JSON.stringify(response.user));
      setToken(response.access_token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoDriver = async (): Promise<User> => {
    setLoading(true);
    try {
      return await login('amine.benali@dz-carpool.dz', 'password123');
    } catch {
      const driver = DEMO_USERS.driver;
      const fakeToken = 'dz_demo_token_driver';
      localStorage.setItem('dz_token', fakeToken);
      localStorage.setItem('dz_current_user', JSON.stringify(driver));
      setToken(fakeToken);
      setUser(driver);
      return driver;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoPassenger = async (): Promise<User> => {
    setLoading(true);
    try {
      return await login('amina.mansouri@dz-carpool.dz', 'password123');
    } catch {
      const passenger = DEMO_USERS.passenger;
      const fakeToken = 'dz_demo_token_passenger';
      localStorage.setItem('dz_token', fakeToken);
      localStorage.setItem('dz_current_user', JSON.stringify(passenger));
      setToken(fakeToken);
      setUser(passenger);
      return passenger;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Record<string, unknown>): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.register(data);
      localStorage.setItem('dz_token', response.access_token);
      localStorage.setItem('dz_current_user', JSON.stringify(response.user));
      setToken(response.access_token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dz_token');
    localStorage.removeItem('dz_current_user');
    setToken(null);
    setUser(null);
    setLoading(false);
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
