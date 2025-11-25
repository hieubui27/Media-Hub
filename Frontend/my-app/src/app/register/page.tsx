"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  // State quản lý trạng thái lạc quan
  // false: hiện form
  // true: hiện giao diện "Giả vờ thành công"
  const [isOptimisticSuccess, setIsOptimisticSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    // Lấy dữ liệu form
    const formData = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        password: (form.elements.namedItem('password') as HTMLInputElement).value,
        confirmPassword: (form.elements.namedItem('confirm_password') as HTMLInputElement).value,
        gender: (form.elements.namedItem('gender') as HTMLSelectElement).value || null,
        userDob: (form.elements.namedItem('dob') as HTMLInputElement).value || null,
    };

    // 1. Validate Client (Bắt buộc phải check kỹ ở đây trước khi lạc quan)
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // --- BẮT ĐẦU OPTIMISTIC UI ---
    
    // 2. GIẢ VỜ THÀNH CÔNG NGAY LẬP TỨC (Người dùng thấy cái này ngay, ko phải chờ 5s)
    setIsOptimisticSuccess(true); 

    try {
      // 3. Gọi API ngầm bên dưới (Lúc này người dùng đang nhìn thấy màn hình waiting đẹp đẽ)
      const res = await fetch('/api/proxy/register/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === true) {
        // 4. Nếu thành công thật -> Chuyển trang
        console.log("Register thành công thật:", data);
        router.push('/verified'); 
      } else {
        // 5. Rủi ro: Nếu API báo lỗi (VD: Email trùng) -> Phải quay xe
        throw new Error(data.message || "Đăng ký thất bại");
      }

    } catch (error: any) {
      console.error("Lỗi:", error);
      // Hoàn tác Optimistic UI: Quay lại form và báo lỗi
      setIsOptimisticSuccess(false);
      setError(error.message || "Lỗi kết nối đến server");
    }
  };

  const inputClass = "w-full pl-4 pr-4 p-2 mt-1 bg-gray-700 text-white text-[13px] rounded transition-colors duration-[50000s] focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
      
      {/* Container chính */}
      <div className="bg-gray-800 rounded-xl shadow-lg w-[1200px] h-auto flex overflow-hidden relative min-h-[600px]">
        
        {/* Phần ảnh bên trái (Giữ nguyên) */}
        <div className="hidden md:block bg-[url(/images/Gemini_Generated_Image_n59kzzn59kzzn59k.png)] w-1/2 bg-cover bg-center bg-no-repeat"></div>

        {/* Phần nội dung bên phải */}
        <div className="w-1/2 flex flex-col justify-center p-8 pl-6 relative">
            
            {/* --- LOGIC HIỂN THỊ UI --- */}
            {isOptimisticSuccess ? (
                // GIAO DIỆN OPTIMISTIC (Hiện ngay khi bấm nút)
                <div className="flex flex-col items-center justify-center text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Đang thiết lập hồ sơ...</h2>
                    <p className="text-gray-400 text-sm">
                        Hệ thống đang gửi mã OTP đến 
                        <span className="text-blue-400 font-bold ml-1">email của bạn</span>.
                    </p>
                    <p className="text-gray-500 text-xs mt-4">Vui lòng không tắt trình duyệt.</p>
                </div>
            ) : (
                // FORM ĐĂNG KÝ CŨ (Chỉ hiện khi chưa bấm hoặc bị lỗi)
                <form onSubmit={handleRegister} className="w-full">
                    <h1 className="text-[22px] text-white font-bold text-start mb-2">
                        Đăng ký tài khoản
                    </h1>
                    
                    <p className="mb-6 text-[11px] text-gray-400 text-start">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400 hover:underline font-semibold">
                        Login Now
                        </Link>
                    </p>

                    {/* Các ô input giữ nguyên như cũ */}
                    <div className="mb-3 w-full">
                        <label className="text-gray-400 text-[11px] ml-1">Full Name</label>
                        <input name="name" placeholder="Nguyen Van A" className={inputClass} required />
                    </div>

                    <div className="mb-3 w-full">
                        <label className="text-gray-400 text-[11px] ml-1">Email Address</label>
                        <input name="email" type="email" placeholder="example@email.com" className={inputClass} required />
                    </div>

                    <div className="flex gap-4 mb-3">
                        <div className="w-1/2">
                            <label className="text-gray-400 text-[11px] ml-1">Gender (Optional)</label>
                            <select name="gender" className={inputClass} defaultValue="">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label className="text-gray-400 text-[11px] ml-1">Date of Birth (Optional)</label>
                            <input name="dob" type="date" className={`${inputClass} [color-scheme:dark]`} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="text-gray-400 text-[11px] ml-1">Password</label>
                        <input name="password" type="password" placeholder="••••••••" className={inputClass} required minLength={6} />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 text-[11px] ml-1">Confirm Password</label>
                        <input name="confirm_password" type="password" placeholder="••••••••" className={inputClass} required />
                    </div>

                    {error && <p className="text-red-500 text-[12px] mb-3 text-start bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 transition-colors font-medium">
                        Đăng ký
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}