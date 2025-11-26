"use client";


import AccountForm from "@/src/components/dashboard/AccountForm";
import { useUser } from "@/src/contexts/UserContext";
import Image from "next/image";

const AccountPage = () => {
  const {user} = useUser();
  const userEmail = user?.email || "";
  const userName = user?.displayName || "";
  const userAvatar = user?.avatar || "/images/avatar.png";
  const userGender = user?.gender || "other";
  console.log(userGender);
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h2 className="text-3xl font-bold mb-2">Tài khoản</h2>
        <p className="text-gray-400 mb-8">Cập nhật thông tin tài khoản</p>
        <AccountForm key={userEmail} email={userEmail} displayName={userName} userGender={userGender} />
      </div>
      <div className="flex flex-col items-center pt-20">
        <Image
          src={userAvatar}
          alt="User Avatar"
          width={150}
          height={150}
          className="rounded-full mb-4"
        />
        <button className="bg-[#353a45] px-4 py-2 rounded-lg text-sm hover:bg-[#4a505c]">
          Ảnh có sẵn
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
