"use client";

import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager"; // Import mới
import { useUser } from "@/src/contexts/UserContext";
import { getUserData } from "@/src/services/authService";
import { useEffect, useState } from "react";

const AccountPage = () => {
  const { user } = useUser();

  // 1. Use State to store data. This ensures the UI updates when data changes.
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    avatar: "",
    gender: "other",
  });

  const [loading, setLoading] = useState(true);

  // 2. Initialize state from Context when `user` becomes available
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

  // 3. Fetch fresh data from API
  useEffect(() => {
    async function fetchData() {
      if (!user?.accessToken) return;

      try {
        const data = await getUserData(user.accessToken);
        
        // Update state with fresh API data
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
    // 4. Add dependency array. Only run this when the accessToken changes.
  }, [user?.accessToken]);

  if (loading && !profile.email) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h2 className="text-3xl font-bold mb-2">Account</h2>
        <p className="text-gray-400 mb-8">Update account information</p>

        <AccountForm 
          key={profile.email} 
          email={profile.email} 
          displayName={profile.name} 
          userGender={profile.gender} 
        />
      </div>
      <div className="flex flex-col items-center pt-20">
        <AvatarManager /> {/* Thay thế ảnh tĩnh bằng component quản lý avatar */}
      </div>
    </div>
  );
};

export default AccountPage;