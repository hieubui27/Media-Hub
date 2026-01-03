"use client";

import { useState } from "react";
import { Upload, Button, message, Avatar, Modal } from "antd";
import { UploadOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { uploadUserAvatar, deleteUserAvatar } from "@/src/services/upload";
import { useUser } from "@/src/contexts/UserContext";

export default function AvatarManager() {
  const { user, login } = useUser();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);
    try {
      const res = await uploadUserAvatar(file);
      if (user && res?.avatarUrl) {
        login({ ...user, avatar: res.avatarUrl }); 
      }
      onSuccess("Ok");
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      onError({ err });
      message.error("Lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xóa ảnh đại diện",
      content: "Bạn có chắc chắn muốn xóa ảnh đại diện hiện tại?",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUserAvatar();
          if (user) {
             login({ ...user, avatar: "" }); 
          }
          message.success("Đã xóa ảnh đại diện");
        } catch (error) {
          message.error("Lỗi khi xóa ảnh");
        }
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#1f1f1f] p-6 rounded-2xl border border-white/10 shadow-lg text-center">
      {/* Avatar Container */}
      <div className="relative group mb-4">
        <Avatar 
          size={120} 
          src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app"}${user.avatar}` : undefined} 
          icon={<UserOutlined />} 
          className="bg-violet-600 border-4 border-zinc-800 shadow-2xl"
        />
        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-white font-bold text-lg">Ảnh đại diện</h3>
        <p className="text-zinc-500 text-xs mb-2 px-4">
            Hỗ trợ định dạng JPG, PNG. Kích thước tối ưu 500x500px.
        </p>
        
        <div className="flex flex-col gap-2 w-full">
          <Upload 
            customRequest={handleUpload} 
            showUploadList={false}
            accept="image/*"
            className="w-full"
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
              block // Antd prop để button full width
              className="bg-violet-600 text-white border-none hover:!bg-violet-500 font-medium h-10 rounded-lg"
            >
              Tải ảnh mới
            </Button>
          </Upload>
          
          {user?.avatar && (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDelete}
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