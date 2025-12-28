"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from "next/navigation";

// Define the shape of a user
interface User {
  id: number; // Thêm trường id từ ảnh image_ede53e.png
  email: string;
  displayName: string;
  avatar: string;
  gender: string;
  accessToken: string;
}

// Define the shape of the context
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. KHI LOAD TRANG (F5): Kiểm tra LocalStorage để khôi phục user
  useEffect(() => {
    // Kiểm tra xem code có đang chạy ở client không
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          // Parse chuỗi JSON thành object và set vào state
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu user từ storage:", error);
          // Nếu dữ liệu lỗi, xóa luôn cho sạch
          localStorage.removeItem("user");
        }
      }
    }
    // Dù có user hay không, cũng tắt trạng thái loading
    setIsLoading(false);
  }, []);

  // 2. KHI ĐĂNG NHẬP: Lưu user vào LocalStorage
  const login = (userData: User) => {
    setUser(userData);
    // Lưu object user vào localStorage (phải chuyển thành string)
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. KHI ĐĂNG XUẤT: Xóa sạch dữ liệu
  const logout = () => {
    setUser(null);
    
    // Xóa token trong cookies
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Xóa user info trong localStorage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    router.push("/auth/login"); // Thường logout xong sẽ đẩy về trang login
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};