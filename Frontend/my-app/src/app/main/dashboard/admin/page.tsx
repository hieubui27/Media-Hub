"use client";

import { useUser } from "@/src/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserManager from "@/src/components/admin/UserManager";
import { Tabs } from "antd";

function AdminDashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/main/dashboard/account");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-[#16181c]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  const tabItems = [
    {
      key: 'users',
      label: <span className="text-lg px-4">Quản lý User</span>,
      children: <UserManager />,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-8">
      <header className="px-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Hệ thống quản trị</h1>
        <p className="text-sm md:text-base text-gray-400">Quản lý người dùng và nội dung.</p>
      </header>

      {/* Stats Cards: 1 cột trên Mobile, 3 cột trên Desktop */}


      <div className="bg-[#1f232b] rounded-2xl border border-gray-800 overflow-hidden">
        <Tabs 
          defaultActiveKey="users" 
          items={tabItems} 
          className="admin-tabs px-2 md:px-4"
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;