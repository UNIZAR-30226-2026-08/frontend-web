import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { refreshToken } from '@/api/authServices'; 

interface AuthContextType {
  token: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshAuthToken = async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    
    if (!currentRefreshToken) {
      logout();
      return;
    }

    await refreshToken(currentRefreshToken, (data: any) => {
      const newAccessToken = data.accessToken || data.access;
      const newRefreshToken = data.refreshToken || data.refresh;

      if (newAccessToken) {
        setToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
      }
      
      if (newRefreshToken) {
         localStorage.setItem('refreshToken', newRefreshToken);
      }
    });
  };

  useEffect(() => {
    if (!token) return;

    const REFRESH_INTERVAL = 10 * 60 * 1000; 

    const intervalId = setInterval(() => {
      refreshAuthToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, refreshAuthToken, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
