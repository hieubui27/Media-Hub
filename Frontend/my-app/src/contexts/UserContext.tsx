"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { refreshAccessToken } from '../services/authService'; // Đảm bảo import service này

interface User {
  id: number;
  email: string;
  displayName: string;
  avatar: string;
  gender: string;
  role: "ADMIN" | "USER";
  accessToken: string;
  refreshToken: string;   
  userDob: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  handleRefreshToken: () => Promise<string | null>; // Thêm hàm này vào interface
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hàm helper lấy cookie
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return "";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
    return "";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Đọc User Info từ Session Storage
      const storedUser = sessionStorage.getItem("user");
      // 2. Đọc Refresh Token từ Cookie
      const storedRefreshToken = getCookie("refreshToken");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Ghép refresh token từ cookie vào object user (nếu có)
          if (storedRefreshToken) {
            parsedUser.refreshToken = storedRefreshToken;
          }
          setUser(parsedUser);
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu user từ storage:", error);
          sessionStorage.removeItem("user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * MỚI: Hàm xử lý làm mới Access Token khi hết hạn
   */
  const handleRefreshToken = async (): Promise<string | null> => {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      console.warn("No refresh token found in cookies");
      logout();
      return null;
    }

    try {
      const data = await refreshAccessToken(refreshToken); // Gọi API refresh
      
      if (data && data.accessToken) {
        // Cập nhật state user với access token mới
        const updatedUser = { ...user, accessToken: data.accessToken } as User;
        setUser(updatedUser);

        // Cập nhật lại Session Storage (không lưu refresh token vào đây)
        const userToStore = { ...updatedUser };
        delete (userToStore as any).refreshToken; 
        sessionStorage.setItem("user", JSON.stringify(userToStore));

        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error("Refresh token failed or expired:", error);
      logout();
      return null;
    }
  };

  const login = (userData: User) => {
    setUser(userData);

    // 1. Lưu Refresh Token vào Cookie (HttpOnly giả lập bằng document.cookie)
    // Thời hạn 7 ngày (60*60*24*7 = 604800s)
    document.cookie = `refreshToken=${userData.refreshToken}; path=/; max-age=604800; SameSite=Strict`;

    // 2. Lưu User Info + Access Token vào Session Storage
    const userToStore = { ...userData };
    delete (userToStore as any).refreshToken; 
    
    sessionStorage.setItem("user", JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    // Xóa Cookie
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Xóa Session Storage
    sessionStorage.removeItem("user");
    
    // Dọn dẹp cả localStorage cũ nếu có để tránh conflict
    localStorage.removeItem("user");
    
    router.push("/auth/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, handleRefreshToken, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};