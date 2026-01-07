"use client";
import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager";
import { useUser } from "@/src/contexts/UserContext";
import { getUserData, deleteAccount } from "@/src/services/authService"; 
import { useEffect, useState, useCallback } from "react";
import { Spin, Modal, message } from "antd"; 
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const { user, login, logout } = useUser(); // Get logout function from context
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const res = await getUserData(user.accessToken);
      if (res.success && res.data) {
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

  // Handle account deletion with confirmation modal
  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Confirm Account Deletion?',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: (
        <div className="text-zinc-400">
          <p>This action <b>cannot be undone</b>.</p>
          <p>All personal information, history, and data will be permanently removed from the system.</p>
        </div>
      ),
      okText: 'Delete Permanently',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        if (!user?.accessToken) return;
        setIsDeleting(true);
        try {
          await deleteAccount(user.accessToken);
          message.success("Your account has been deleted.");
          
          // Clear session and redirect to home
          logout(); 
          router.push("/");
        } catch (error: any) {
          message.error(error.message || "Failed to delete account.");
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  if (loading && !user?.email) {
    return <div className="p-10 text-center"><Spin size="large"/></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-zinc-400 text-sm">Manage your personal information and account security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          {/* Detailed Information Form */}
          <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-violet-500 pl-3">
               Personal Information
             </h3>
             <AccountForm 
                key={user?.email} 
                email={user?.email || ""} 
                displayName={user?.displayName || ""} 
                userGender={user?.gender || "other"} 
                userDob={user?.userDob}
                onSubmit={fetchData}
              />
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6 shadow-xl">
             <div className="flex items-start gap-4">
               <div className="p-3 bg-red-500/10 rounded-lg">
                  <ExclamationCircleOutlined className="text-red-500 text-xl" />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-500 mb-1">Delete Account</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Once you confirm deletion, there is no way to recover your data. Please consider this carefully.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {isDeleting ? "Processing..." : "Delete My Account Immediately"}
                  </button>
               </div>
             </div>
          </div>
        </div>

        {/* Avatar Manager */}
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