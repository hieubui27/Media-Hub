//
"use client";

import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager";
import { useUser } from "@/src/contexts/UserContext";
import { getUserData } from "@/src/services/authService";
import { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";

const AccountPage = () => {
  const { user } = useUser();

  const [profile, setProfile] = useState({
    email: "",
    name: "",
    avatar: "",
    gender: "other",
  });

  const [loading, setLoading] = useState(true);

  // Define fetch function for reuse
  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;

    try {
      const data = await getUserData(user.accessToken);
      setProfile({
        email: data.data.email,
        name: data.data.name,
        gender: data.data.userGender || "other",
        avatar: data.data.avatar || "/images/avatar.png",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);

  // Fetch data for the first time
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Synchronize profile state when UserContext changes (Header/Sidebar updates from here)
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        avatar: user.avatar || "/images/avatar.png",
        name: user.displayName || prev.name,
        gender: user.gender || prev.gender,
      }));
    }
  }, [user]);

  if (loading && !profile.email) return <div className="p-10 text-center text-white"><Spin size="large"/></div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Account</h2>
        <p className="text-zinc-400 text-sm md:text-base">Manage personal information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col items-center lg:items-start space-y-6">
           <div className="w-full sticky top-24">
              {/* Pass fetchData into AvatarManager to call after upload is complete */}
              <AvatarManager onAvatarChange={fetchData} />
           </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-2">
          <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 md:p-6 lg:p-8 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-violet-500 pl-3">Detailed Information</h3>
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