"use client";
import AccountForm from "@/src/components/dashboard/AccountForm";
import AvatarManager from "@/src/components/AvatarManager";
import { useUser } from "@/src/contexts/UserContext";
import { getUserData, deleteAccount } from "@/src/services/authService"; // Thêm deleteAccount
import { useEffect, useState, useCallback } from "react";
import { Spin, Modal, message } from "antd"; // Thêm Modal, message
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const { user, login, logout } = useUser(); // Lấy thêm hàm logout từ context
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

  // Hàm xử lý xóa tài khoản với xác nhận
  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản?',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: (
        <div className="text-zinc-400">
          <p>Hành động này <b>không thể hoàn tác</b>.</p>
          <p>Toàn bộ thông tin cá nhân, lịch sử và dữ liệu của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
        </div>
      ),
      okText: 'Xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      centered: true,
      onOk: async () => {
        if (!user?.accessToken) return;
        setIsDeleting(true);
        try {
          await deleteAccount(user.accessToken);
          message.success("Tài khoản của bạn đã được xóa.");
          
          // Xóa session và đẩy về trang chủ
          logout(); 
          router.push("/");
        } catch (error: any) {
          message.error(error.message || "Xóa tài khoản thất bại.");
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
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Cài đặt tài khoản</h2>
        <p className="text-zinc-400 text-sm">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          {/* Form Thông tin chi tiết */}
          <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-violet-500 pl-3">
               Thông tin cá nhân
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

          {/* Danger Zone - Khu vực nguy hiểm */}
          <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6 shadow-xl">
             <div className="flex items-start gap-4">
               <div className="p-3 bg-red-500/10 rounded-lg">
                  <ExclamationCircleOutlined className="text-red-500 text-xl" />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-500 mb-1">Xóa tài khoản</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Một khi bạn xác nhận xóa, không có cách nào để khôi phục lại dữ liệu. Vui lòng cân nhắc kỹ.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {isDeleting ? "Đang xử lý..." : "Xóa tài khoản ngay lập tức"}
                  </button>
               </div>
             </div>
          </div>
        </div>

        {/* Quản lý Ảnh đại diện */}
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