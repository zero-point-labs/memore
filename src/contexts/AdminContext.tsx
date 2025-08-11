'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = 'Memora-11062003';
  const ADMIN_KEY = 'memora_admin_authenticated';

  useEffect(() => {
    // Check if user was previously authenticated as admin
    const adminStatus = localStorage.getItem(ADMIN_KEY);
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  };

  const value = {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};