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
      // Giả sử API trả về URL avatar mới trong res.avatarUrl
      if (user && res?.avatarUrl) {
        // Cập nhật context để UI thay đổi ngay lập tức
        login({ ...user, avatar: res.avatarUrl }); 
      }
      onSuccess("Ok");
      message.success("Avatar updated!");
    } catch (err) {
      onError({ err });
      message.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Avatar",
      content: "Are you sure you want to remove your avatar?",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUserAvatar();
          if (user) {
             // Reset về ảnh mặc định
             login({ ...user, avatar: "" }); 
          }
          message.success("Avatar removed");
        } catch (error) {
          message.error("Failed to remove avatar");
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-6 bg-[#1f1f1f] p-6 rounded-xl border border-white/10 shadow-lg">
      <Avatar 
        size={80} 
        src={user?.avatar} 
        icon={<UserOutlined />} 
        className="bg-violet-600 border-2 border-white/20"
      />
      
      <div className="flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg">Profile Picture</h3>
        <div className="flex gap-2">
          <Upload 
            customRequest={handleUpload} 
            showUploadList={false}
            accept="image/*"
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
              className="bg-violet-600 text-white border-none hover:!bg-violet-500 font-medium"
            >
              Upload New
            </Button>
          </Upload>
          
          {user?.avatar && (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDelete}
              className="bg-red-500/10 border-red-500/50 hover:!bg-red-500/20"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
