"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

function VerifiedPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerified = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        
        const otpInput = form.elements.namedItem('otp') as HTMLInputElement;
        const otpValue = otpInput.value;

        if (!otpValue) {
            setError("Please enter OTP code");
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
                    "otp": otpValue 
                }),
            });

            const data = await res.json();
            console.log("Verify thành công:", data);
            if(data.success){
                router.push('/auth/login'); 
            }
        } catch (error) {
            console.error("Lỗi:", error);
            setError("Incorrect OTP code or system error");
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
                <h2 className="text-2xl font-bold text-center">Verify account</h2>
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                        Enter OTP code
                    </label>
                    <input 
                        type="text" 
                        name="otp" 
                        id="otp"
                        placeholder="123456"
                        maxLength={6}
                        className="bg-gray-700 border border-gray-600 text-white text-center text-xl rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 tracking-widest"
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
                    className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Verifying..." : "Confirm"}
                </button>
            </form>
        </div>
    );
}

export default VerifiedPage;