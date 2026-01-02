"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from "next/navigation";

// Define the shape of an admin
export interface Admin {
  id: number;
  email: string;
  displayName: string;
  avatar: string;
  accessToken: string;
  role: "ADMIN"; // Enforce strict type
}

// Define the shape of the context
interface AdminContextType {
  admin: Admin | null;
  login: (adminData: Admin) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Create the provider component
export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Check LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("admin_user");
      
      if (storedAdmin) {
        try {
          const parsedAdmin = JSON.parse(storedAdmin);
          // Double check role integrity
          if (parsedAdmin.role === "ADMIN") {
            setAdmin(parsedAdmin);
          } else {
            localStorage.removeItem("admin_user");
          }
        } catch (error) {
          console.error("Error parsing admin user:", error);
          localStorage.removeItem("admin_user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Login
  const login = (adminData: Admin) => {
    if (adminData.role !== "ADMIN") {
      console.error("Access Denied: User is not an ADMIN");
      return;
    }
    setAdmin(adminData);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
  };

  // 3. Logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }
  return context;
};