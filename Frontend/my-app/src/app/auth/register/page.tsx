"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isOptimisticSuccess, setIsOptimisticSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        password: (form.elements.namedItem('password') as HTMLInputElement).value,
        confirmPassword: (form.elements.namedItem('confirm_password') as HTMLInputElement).value,
        gender: (form.elements.namedItem('gender') as HTMLSelectElement).value || null,
        userDob: (form.elements.namedItem('dob') as HTMLInputElement).value || null,
    };
    
    if (formData.password !== formData.confirmPassword) {
      setError("Confirm password does not match!");
      return;
    }

    setIsOptimisticSuccess(true); 

    try {
      const res = await fetch('/api/proxy/register/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === true) {
        console.log("Registration successful:", data);
        router.push('/auth/verified'); 
      } else {
        throw new Error(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Error:", error);
      setIsOptimisticSuccess(false);
      
      // Fixed: Type checking for error
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Connection to server failed");
      }
    }
  };

  const inputClass = "w-full pl-4 pr-4 p-2 mt-1 bg-gray-700 text-white text-[13px] rounded transition-colors duration-[50000s] focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
      <div className="bg-gray-800 rounded-xl shadow-lg w-[1200px] h-auto flex overflow-hidden relative min-h-[600px]">

        <div className="hidden md:block bg-[url(/images/Gemini_Generated_Image_n59kzzn59kzzn59k.png)] w-1/2 bg-cover bg-center bg-no-repeat"></div>
        <div className="w-1/2 flex flex-col justify-center p-8 pl-6 relative">
            {isOptimisticSuccess ? (
                <div className="flex flex-col items-center justify-center text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Setting up your profile...</h2>
                    <p className="text-gray-400 text-sm">
                        The system is sending an OTP code to 
                        <span className="text-blue-400 font-bold ml-1">your email</span>.
                    </p>
                    <p className="text-gray-500 text-xs mt-4">Please do not close the browser.</p>
                </div>
            ) : (
                <form onSubmit={handleRegister} className="w-full">
                    <h1 className="text-[22px] text-white font-bold text-start mb-2">
                        Create an Account
                    </h1>
                    
                    <p className="mb-6 text-[11px] text-gray-400 text-start">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 hover:underline font-semibold">
                        Login Now
                        </Link>
                    </p>

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

                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`
                            w-full pl-4 pr-10 p-2 rounded 
                            h-10
                            bg-gray-700 
                            text-white text-[13px]
                            border border-gray-600
                            hover:border-gray-500
                            focus:outline-none focus:ring-1 focus:ring-blue-500
                            transition-colors duration-[50000s]
                          `}
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-gray-400 text-[11px] ml-1">Confirm Password</label>

                      <div className="relative">
                        <input
                          name="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className={`
                            w-full pl-4 pr-10 p-2 rounded 
                            h-10
                            bg-gray-700 
                            text-white text-[13px]
                            border border-gray-600
                            hover:border-gray-500
                            focus:outline-none focus:ring-1 focus:ring-blue-500
                            transition-colors duration-[50000s]
                          `}
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <AiFillEyeInvisible size={18} />
                          ) : (
                            <AiFillEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-[12px] mb-3 text-start bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 transition-colors font-medium">
                        Register
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}