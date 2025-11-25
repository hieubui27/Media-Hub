"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const gender = (form.elements.namedItem('gender') as HTMLSelectElement).value;
    const userDob = (form.elements.namedItem('dob') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await fetch('/api/proxy/register/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
         },
        body: JSON.stringify({ 
            email, 
            name, 
            password,
            confirmPassword,
            gender, 
            userDob,
        }),
      });
      const data = await res.json();
      console.log("Register thành công:", data);
      if(data.success === true){
        router.push('/verified'); 
      }
      

    } catch (error) {
      console.error("Lỗi mạng hoặc hệ thống:", error);
      setError("Lỗi kết nối đến server");
    }
  };
  const inputClass = "w-full pl-4 pr-4 p-2 mt-1 bg-gray-700 text-white text-[13px] rounded transition-colors duration-[50000s] focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 rounded-xl shadow-lg w-[1200px] h-auto flex overflow-hidden" 
      >
        <div className="hidden md:block bg-[url(/images/Gemini_Generated_Image_n59kzzn59kzzn59k.png)] min-h-full w-lg bg-cover bg-center bg-no-repeat shrink-0"></div>
        <div className="content_login p-8 pl-6 flex-1 flex flex-col justify-center">
          
          <h1 className="text-[22px] text-white font-bold text-start mb-2">
            Đăng ký tài khoản
          </h1>
          
          <p className="mb-6 text-[11px] text-gray-400 text-start">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-blue-500 hover:text-blue-400 hover:underline font-semibold"
            >
              Login Now
            </Link>
          </p>

          <div className="mb-3 w-full">
            <label className="text-gray-400 text-[11px] ml-1">Full Name</label>
            <input
              name="name"
              placeholder="Nguyen Van A"
              className={inputClass}
              required
            />
          </div>

          <div className="mb-3 w-full">
            <label className="text-gray-400 text-[11px] ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="example@email.com"
              className={inputClass}
              required
            />
          </div>

          {/* Gender & DOB Group - Gom 2 cái này 1 dòng cho gọn */}
          <div className="flex gap-4 mb-3">
            <div className="w-1/2">
                <label className="text-gray-400 text-[11px] ml-1">Gender</label>
                <select name="gender" className={inputClass} defaultValue="male">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="w-1/2">
                <label className="text-gray-400 text-[11px] ml-1">Date of Birth</label>
                {/* [color-scheme:dark] giúp icon lịch biến thành màu trắng */}
                <input
                  name="dob"
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                  required
                />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-gray-400 text-[11px] ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-gray-400 text-[11px] ml-1">Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              className={inputClass}
              required
            />
          </div>

          {error && <p className="text-red-500 text-[12px] mb-3 text-start">{error}</p>}
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 transition-colors font-medium">
            Đăng ký
          </button>
          
        </div>
      </form>
    </div>
  );
}