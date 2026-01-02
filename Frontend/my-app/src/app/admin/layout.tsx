"use client";

import React, { useEffect } from 'react';
import { AdminProvider, useAdmin } from '@/src/contexts/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import { ConfigProvider, theme, Spin } from 'antd';

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { admin, isLoading, logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Force logout and clear storage on first entry to admin section in a session
    const hasReset = sessionStorage.getItem('admin_reset_performed');
    if (!hasReset) {
      localStorage.clear();
      sessionStorage.setItem('admin_reset_performed', 'true');
      logout();
      return;
    }

    if (isLoading) return;

    // Normalize path (remove trailing slash)
    const path = pathname?.replace(/\/$/, '') || '/';
    const isLoginPage = path === '/admin/login';
    const isAdminRoot = path === '/admin';

    if (!admin) {
      // Nếu chưa đăng nhập và không ở trang login -> Chuyển về login
      if (!isLoginPage) {
        router.push('/admin/login');
      }
    } else {
      // Nếu đã đăng nhập mà ở trang login hoặc trang root admin -> Chuyển về dashboard
      if (isLoginPage || isAdminRoot) {
        router.push('/admin/dashboard');
      }
    }
  }, [admin, isLoading, pathname, router, logout]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  // Normalize path for render logic
  const path = pathname?.replace(/\/$/, '') || '/';
  const isLoginPage = path === '/admin/login';

  // Nếu đang redirect (chưa login và không ở trang login), hiện loading thay vì null
  if (!admin && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Spin size="large" tip="Đang chuyển hướng..." />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#141414',
          colorBgBase: '#0a0a0a',
          colorTextBase: '#ffffff',
        },
      }}
    >
      <AdminProvider>
        <AdminAuthGuard>
          {children}
        </AdminAuthGuard>
      </AdminProvider>
    </ConfigProvider>
  );
}
