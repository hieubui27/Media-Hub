"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

function VerifiedPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Thêm state loading để UX tốt hơn

    const handleVerified = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        
        // 1. Lấy giá trị từ ô input có name là "otp"
        const otpInput = form.elements.namedItem('otp') as HTMLInputElement;
        const otpValue = otpInput.value;

        if (!otpValue) {
            setError("Vui lòng nhập mã OTP");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/proxy/register/confirm', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    otp: otpValue 
                }),
            });

            if (!res.ok) {
                throw new Error("Xác thực thất bại");
            }

            const data = await res.json();
            console.log("Verify thành công:", data);
            router.push('/home'); 

        } catch (error) {
            console.error("Lỗi:", error);
            setError("Mã OTP không chính xác hoặc lỗi hệ thống");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
            <form
                onSubmit={handleVerified}
                className="bg-gray-800 rounded-xl shadow-lg p-8 w-[400px] flex flex-col gap-6 text-white"
            >
                <h2 className="text-2xl font-bold text-center">Xác thực tài khoản</h2>
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                        Nhập mã OTP
                    </label>
                    <input 
                        type="text" 
                        name="otp" 
                        id="otp"
                        placeholder="123456"
                        maxLength={6}
                        className="bg-gray-700 border border-gray-600 text-white text-center text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 tracking-widest"
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Đang xác thực..." : "Xác nhận"}
                </button>
            </form>
        </div>
    );
}

export default VerifiedPage;