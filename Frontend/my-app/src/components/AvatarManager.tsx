// src/components/AvatarManager.tsx
"use client";

import { useState } from "react";
import { Upload, Button, message, Avatar, Modal, Alert } from "antd"; // Import Alert to display status
import { UploadOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { uploadUserAvatar, deleteUserAvatar } from "@/src/services/upload";
import { useUser } from "@/src/contexts/UserContext";

export default function AvatarManager({ onAvatarChange }: { onAvatarChange?: () => void }) {
  const { user, login } = useUser();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Upload handler function according to requirement
  const handleAvatarUpload = async (options: any) => {
    const { file } = options;
    
    // Initialize state similar to handleSubmit
    setStatus(null);
    setLoading(true);

    // Check session
    if (!user || !user.accessToken) {
      setStatus({ type: 'error', message: "Session expired." });
      setLoading(false);
      if (options.onError) options.onError();
      return;
    }

    try {
      // 1. Call Upload API
      const res = await uploadUserAvatar(file);

      // 2. Check response (Assume API returns object with avatarUrl)
      if (!res?.path) {
        throw new Error("Did not receive image URL from server");
      }

      // 3. Set success state
      setStatus({ type: 'success', message: "Profile picture updated!" });

      // 4. Update Global State (UserContext) so Header/Sidebar changes immediately
      const updatedUser = {
        ...user,
        avatar: res.path,
      };
      login(updatedUser); 

      // 5. Cleanup and Callback
      setTimeout(() => setStatus(null), 3000);
      if (options.onSuccess) options.onSuccess(res);
      if (onAvatarChange) onAvatarChange();

    } catch (err) {
      // 6. Error handling
      const msg = err instanceof Error ? err.message : "An error occurred while uploading the image.";
      setStatus({ type: 'error', message: msg });
      if (options.onError) options.onError(err);
    } finally {
      // 7. Finish loading
      setLoading(false);
    }
  };

  // Helper to display image URL avoiding cache (still keeps timestamp logic)
  const getAvatarUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";
    return `${baseUrl}${path}?t=${new Date().getTime()}`;
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#1f1f1f] p-6 rounded-2xl border border-white/10 shadow-lg text-center">
      {/* Display Alert if there is status (similar to AccountForm) */}
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
        <h3 className="text-white font-bold text-lg">Profile Picture</h3>
        <div className="flex flex-col gap-2 w-full">
          <Upload 
            customRequest={handleAvatarUpload} // Pass logic function here
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
              {loading ? "Uploading..." : "Upload new image"}
            </Button>
          </Upload>
          
          {user?.avatar && !loading && (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => { /* Delete logic should also be written with try/catch similarly */ }}
              block
              className="bg-red-500/10 border-red-500/50 hover:!bg-red-500/20 text-red-500 h-10 rounded-lg"
            >
              Remove image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}