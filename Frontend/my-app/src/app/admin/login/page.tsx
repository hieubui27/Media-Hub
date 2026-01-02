"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/src/contexts/AdminContext";
import { login as loginApi } from "@/src/services/authService";
import { ConfigProvider, theme, message, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setLoading(true);
    try {
      const data = await loginApi(email, password);
      const accessToken = data.data?.accessToken;
      
      if (!accessToken) {
         throw new Error("Email hoặc mật khẩu không đúng");
      }

      // Check ROLE ngay lập tức
      const userRole = data.data.user.role;
      if (userRole !== 'ADMIN') {
        throw new Error("Tài khoản này không có quyền truy cập trang Quản trị.");
      }

      // Lưu thông tin admin vào context và localStorage
      login({
        id: data.data.user.id,
        email: data.data.user.email,
        displayName: data.data.user.name || "Admin",
        avatar: data.data.user.avatar || "/images/avatar.png",
        accessToken: accessToken,
        role: userRole,
      });

      if (data.success) {
        message.success("Đăng nhập Admin thành công!");
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      message.error(error.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#141414',
          colorBgBase: '#0a0a0a',
        },
      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="bg-[#141414] p-10 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Media Hub</h1>
            <p className="text-gray-400">Admin Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Email Quản trị</label>
              <Input
                name="email"
                size="large"
                prefix={<UserOutlined className="text-gray-500" />}
                placeholder="admin@mediahub.com"
                required
                className="bg-[#1f1f1f] border-gray-700 hover:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Mật khẩu</label>
              <Input.Password
                name="password"
                size="large"
                prefix={<LockOutlined className="text-gray-500" />}
                placeholder="••••••••"
                required
                className="bg-[#1f1f1f] border-gray-700 hover:border-blue-500"
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-500 border-none mt-4"
            >
              Đăng nhập hệ thống
            </Button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-gray-500 text-xs italic">
                Truy cập hạn chế. Chỉ dành cho nhân viên quản trị.
             </p>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}