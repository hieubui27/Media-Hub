"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


function ResetPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // --- STEP 1: REQUEST OTP ---
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            const res = await fetch('/api/proxy/auth/password-reset/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to send OTP. Please check your email.");
            }

            setSuccessMsg(`OTP code has been sent to ${email}`);
            setStep(2); // Move to next step
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY OTP & RESET PASSWORD ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // 1. Validate confirm password
        if (newPassword !== confirmPassword) {
            setError("Confirm password does not match!");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/proxy/auth/password-reset/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    otp,
                    newPassword,
                    confirmPassword
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Invalid OTP or system error");
            }

            // Success -> Alert and redirect
            alert("Password reset successful! Please log in again.");
            router.push('/login');

        } catch (err) {
            // Using type assertion for Error
            setError((err as Error).message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-[400px] flex flex-col gap-6 text-white">

                <h2 className="text-2xl font-bold text-center">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>

                {/* Notifications */}
                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="text-green-400 text-sm text-center bg-green-500/10 p-2 rounded border border-green-500/20">
                        {successMsg}
                    </div>
                )}

                {/* --- FORM STEP 1: ENTER EMAIL --- */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">
                                Enter registered Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* --- FORM STEP 2: ENTER OTP & NEW PASSWORD --- */}
                {step === 1 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">

                        {/* Email readonly */}
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Email</label>
                            <input
                                type="text"
                                value={email}
                                disabled
                                className="bg-gray-700/50 border border-gray-600 text-gray-400 text-sm rounded-lg block w-full p-2 cursor-not-allowed"
                            />
                        </div>

                        {/* OTP Input */}
                        <div>
                            <label htmlFor="otp" className="text-sm font-medium text-gray-300 block mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="bg-gray-700 border border-gray-600 text-white text-center tracking-widest text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        {/* New Password Input */}
                        <div>
                            <label htmlFor="newpass" className="text-sm font-medium text-gray-300 block mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showNewPass ? "text" : "password"}
                                    id="newpass"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                                    required
                                />

                                {/* Icon toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showNewPass ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmpass" className="text-sm font-medium text-gray-300 block mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    id="confirmpass"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className={`
                                            bg-gray-700 text-white text-sm rounded-lg block w-full p-2.5 pr-10
                                            border
                                            ${confirmPassword && newPassword !== confirmPassword
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                        }
      `}
                                    required
                                />

                                {/* Icon toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showConfirmPass ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 transition-colors mt-2"
                        >
                            {loading ? "Processing..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(""); }}
                            className="text-sm text-gray-400 hover:text-white underline text-center mt-2"
                        >
                            Back to Email entry
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPasswordPage;