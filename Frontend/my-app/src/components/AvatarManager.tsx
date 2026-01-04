// src/components/AvatarManager.tsx
"use client";

import { useState } from "react";
import { Upload, Button, message, Avatar, Modal, Alert } from "antd"; // Import Alert để hiển thị status
import { UploadOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { uploadUserAvatar, deleteUserAvatar } from "@/src/services/upload";
import { useUser } from "@/src/contexts/UserContext";

export default function AvatarManager({ onAvatarChange }: { onAvatarChange?: () => void }) {
  const { user, login } = useUser();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Hàm xử lý upload theo cấu trúc yêu cầu
  const handleAvatarUpload = async (options: any) => {
    const { file } = options;
    
    // Khởi tạo trạng thái y hệt handleSubmit
    setStatus(null);
    setLoading(true);

    // Kiểm tra session
    if (!user || !user.accessToken) {
      setStatus({ type: 'error', message: "Phiên làm việc đã hết hạn." });
      setLoading(false);
      if (options.onError) options.onError();
      return;
    }

    try {
      // 1. Gọi API Upload
      const res = await uploadUserAvatar(file);

      // 2. Kiểm tra phản hồi (Giả sử API trả về object có avatarUrl)
      if (!res?.path) {
        throw new Error("Không nhận được URL ảnh từ máy chủ");
      }

      // 3. Set trạng thái thành công
      setStatus({ type: 'success', message: "Ảnh đại diện đã được cập nhật!" });

      // 4. Cập nhật Global State (UserContext) để Header/Sidebar thay đổi ngay lập tức
      const updatedUser = {
        ...user,
        avatar: res.path,
      };
      login(updatedUser); 

      // 5. Cleanup và Callback
      setTimeout(() => setStatus(null), 3000);
      if (options.onSuccess) options.onSuccess(res);
      if (onAvatarChange) onAvatarChange();

    } catch (err) {
      // 6. Xử lý lỗi
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tải ảnh.";
      setStatus({ type: 'error', message: msg });
      if (options.onError) options.onError(err);
    } finally {
      // 7. Kết thúc loading
      setLoading(false);
    }
  };

  // Helper để hiển thị URL ảnh tránh cache (vẫn giữ logic timestamp)
  const getAvatarUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";
    return `${baseUrl}${path}?t=${new Date().getTime()}`;
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#1f1f1f] p-6 rounded-2xl border border-white/10 shadow-lg text-center">
      {/* Hiển thị Alert nếu có status (giống cách AccountForm hoạt động) */}
      {status && (
        <div className="w-full mb-4">
          <Alert 
            message={status.message} 
            type={status.type} 
            showIcon 
            closable 
            onClose={() => setStatus(null)}
          />
        </div>
      )}

      <div className="relative group mb-4">
        <Avatar 
          size={120} 
          src={user?.avatar ? getAvatarUrl(user.avatar) : undefined} 
          icon={<UserOutlined />} 
          className="bg-violet-600 border-4 border-zinc-800 shadow-2xl"
        />
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-white font-bold text-lg">Ảnh đại diện</h3>
        <div className="flex flex-col gap-2 w-full">
          <Upload 
            customRequest={handleAvatarUpload} // Truyền hàm logic vào đây
            showUploadList={false}
            accept="image/*"
            className="w-full"
            disabled={loading}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
              block 
              className="bg-violet-600 text-white border-none hover:!bg-violet-500 font-medium h-10 rounded-lg"
            >
              {loading ? "Đang tải..." : "Tải ảnh mới"}
            </Button>
          </Upload>
          
          {user?.avatar && !loading && (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => { /* Logic delete cũng nên viết theo try/catch tương tự */ }}
              block
              className="bg-red-500/10 border-red-500/50 hover:!bg-red-500/20 text-red-500 h-10 rounded-lg"
            >
              Gỡ ảnh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}