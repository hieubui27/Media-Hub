"use client";

import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager";
import { useUser } from "@/src/contexts/UserContext";
import { getUserData } from "@/src/services/authService";
import { useEffect, useState } from "react";
import { Spin } from "antd"; // Thêm loading spinner cho đẹp nếu muốn

const AccountPage = () => {
  const { user } = useUser();

  const [profile, setProfile] = useState({
    email: "",
    name: "",
    avatar: "",
    gender: "other",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        name: user.displayName || "",
        avatar: user.avatar || "/images/avatar.png",
        gender: user.gender || "other",
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.accessToken) return;

      try {
        const data = await getUserData(user.accessToken);
        
        setProfile((prev) => ({
          ...prev,
          email: data.data.email,
          name: data.data.name,
          gender: data.data.userGender || "other",
          avatar: data.data.avatar || "/images/avatar.png",
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.accessToken]);

  if (loading && !profile.email) return <div className="p-10 text-center text-white"><Spin size="large"/></div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Tài khoản</h2>
        <p className="text-zinc-400 text-sm md:text-base">Quản lý thông tin cá nhân và bảo mật</p>
      </div>

      {/* Grid Layout: Mobile 1 cột, Desktop 3 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Cột Avatar: Trên mobile nằm đầu (order-1), Desktop nằm cuối (order-2) */}
        <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col items-center lg:items-start space-y-6">
           <div className="w-full sticky top-24">
              <AvatarManager />
           </div>
        </div>

        {/* Cột Form: Trên mobile nằm sau (order-2), Desktop nằm trước (order-1) */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 md:p-6 lg:p-8 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-violet-500 pl-3">Thông tin chi tiết</h3>
             <AccountForm 
                key={profile.email} 
                email={profile.email} 
                displayName={profile.name} 
                userGender={profile.gender} 
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;