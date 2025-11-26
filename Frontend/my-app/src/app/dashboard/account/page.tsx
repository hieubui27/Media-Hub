"use client";

import AccountForm from "@/src/components/dashboard/AccountForm";
import { useUser } from "@/src/contexts/UserContext";
import Image from "next/image";

const AccountPage = () => {
  const { user } = useUser();
  const userEmail = user?.email || "";
  const userName = user?.displayName || "";
  const userAvatar = user?.avatar || "/images/avatar.png";
  
  // Ensure gender has a valid fallback
  const userGender = user?.gender || "other";
  
  console.log("Current Gender:", userGender);

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h2 className="text-3xl font-bold mb-2">My Account</h2>
        <p className="text-gray-400 mb-8">Update your account information</p>
        
        <AccountForm 
            key={userEmail} // Important: Force re-render when data loads
            email={userEmail} 
            displayName={userName} 
            userGender={userGender} 
        />
      </div>
      
      <div className="flex flex-col items-center pt-20">
        <Image
          src={userAvatar}
          alt="User Avatar"
          width={150}
          height={150}
          className="rounded-full mb-4 object-cover border-4 border-gray-700"
          priority // Prioritize loading the avatar
        />
        <button className="bg-[#353a45] px-4 py-2 rounded-lg text-sm text-white hover:bg-[#4a505c] transition-colors">
          Preset Avatars
        </button>
      </div>
    </div>
  );
};

export default AccountPage;