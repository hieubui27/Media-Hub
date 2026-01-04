// src/app/main/dashboard/account/page.tsx
"use client";
import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager";
import { useUser } from "@/src/contexts/UserContext";
import { getUserData } from "@/src/services/authService";
import { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";

const AccountPage = () => {
  const { user, login } = useUser();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const res = await getUserData(user.accessToken);
      if (res.success && res.data) {
        // Update Context with the latest data from the Server
        login({
          ...user,
          displayName: res.data.name,
          gender: res.data.userGender || "other",
          userDob: res.data.userDob,
          avatar: res.data.avatar || user.avatar
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, login, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !user?.email) {
    return <div className="p-10 text-center"><Spin size="large"/></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Account</h2>
        <p className="text-zinc-400 text-sm">Manage personal information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Form now takes the first 2 columns on large screens */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-violet-500 pl-3">Detailed Information</h3>
             <AccountForm 
                key={user?.email} 
                email={user?.email || ""} 
                displayName={user?.displayName || ""} 
                userGender={user?.gender || "other"} 
                userDob={user?.userDob}
                onSubmit={fetchData}
              />
          </div>
        </div>

        {/* Avatar Manager now takes the last column on large screens */}
        <div className="lg:col-span-1 order-1 lg:order-2">
           <div className="sticky top-24">
              <AvatarManager onAvatarChange={fetchData} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;