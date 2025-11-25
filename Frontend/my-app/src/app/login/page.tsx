"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('username') as HTMLInputElement).value; // Cách lấy value an toàn hơn
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/proxy/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      console.log("Login thành công:", data);
      const accessToken = data.accessToken;
      
      const userRes = await fetch('/api/proxy/user-info', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const userData = await userRes.json();
      console.log("User Info:", userData);
      

      // Chuyển trang sau khi login thành công
      router.push('/dashboard'); 

    } catch (error) {
      console.error("Lỗi mạng hoặc hệ thống:", error);
      setError("Lỗi kết nối đến server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 rounded-xl shadow-lg w-[600px] h-[400px] flex overflow-hidden" 
        // Lưu ý: w-150 và h-100 không phải class mặc định của Tailwind, 
        // mình đổi tạm sang w-[600px] để demo, bạn có thể đổi lại w-150 nếu đã config theme.
      >
        {/* Phần ảnh bên trái */}
        <div className="bg-[url(/images/Gemini_Generated_Image_n59kzzn59kzzn59k.png)] h-full w-60 bg-cover bg-center mr-5 shrink-0"></div>

        {/* Phần Content: Thêm flex-1 để chiếm hết phần còn lại */}
        <div className="content_login p-8 pl-4 flex-1 flex flex-col justify-center">
          
          <h1 className="text-[22px] text-white font-bold text-star mb-4">
            Đăng nhập
          </h1>
          
          <p className="mb-4 text-[11px] text-gray-400 text-start">
            If you don't have an account,{" "}
            <Link 
              href="/register" 
              className="text-blue-500 hover:text-blue-400 hover:underline font-semibold"
            >
              Register Now
            </Link>
          </p>

          <div className="mb-4 w-full">
            <input
              name="username"
              placeholder="Email"
              className="w-full pl-4 pr-4 p-2 mt-1 bg-gray-700 text-white text-[13px] rounded transition-colors duration-[50000s]"
              required
            />
          </div>

          <div className="mb-2">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full pl-4 pr-4 p-2 text-[13px] bg-gray-700 text-white rounded transition-colors duration-[50000s]"
              required
            />
          </div>
          <p className="mb-4 text-[11px] text-gray-400 text-start">
            Forgot password,{" "}
            <Link 
              href="/reset" 
              className="text-gray hover:text-blue-400 hover:underline font-semibold"
            >
              Reset now ?
            </Link>
          </p>
          {error && <p className="text-red-500 text-[12px] mb-3 text-start">{error}</p>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 transition-colors">
            Đăng nhập
          </button>
          
        </div>
      </form>
    </div>
  );
}