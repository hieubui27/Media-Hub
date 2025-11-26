"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/src/contexts/UserContext";
import { login as loginApi, getUserInfo } from "@/src/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('username') as HTMLInputElement).value; // Safer way to get value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const data = await loginApi(email, password);
      
      // Assuming structure based on your snippet
      // It's good practice to check if data.data exists
      const accessToken = data.data?.accessToken;
      
      if (!accessToken) {
         throw new Error("Invalid response from server");
      }

      console.log("Access Token:", accessToken);
      console.log("Login Response Data:", data.data);

      login({
        email: data.data.user.email,
        displayName: data.data.user.name || "User",
        avatar: data.data.user.avatar || "/images/avatar.png",
        gender: data.data.user.userGender || "other",
      }); // You might need to pass accessToken here if your context requires it

      if(data.success){
        router.push('/dashboard/account');
      }
    } catch (error) {
      // Fixed: Avoid using 'any'
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Connection to server failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 rounded-xl shadow-lg w-[600px] h-[400px] flex overflow-hidden" 
      >
        {/* Left Image Section */}
        <div className="bg-[url(/images/Gemini_Generated_Image_n59kzzn59kzzn59k.png)] h-full w-60 bg-cover bg-center mr-5 shrink-0"></div>

        {/* Content Section */}
        <div className="content_login p-8 pl-4 flex-1 flex flex-col justify-center">
          
          <h1 className="text-[22px] text-white font-bold text-start mb-4">
            Login
          </h1>
          
          <p className="mb-4 text-[11px] text-gray-400 text-start">
            Don&apos;t have an account?{" "}
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
              className="w-full pl-4 pr-4 p-2 mt-1 bg-gray-700 text-white text-[13px] rounded transition-colors duration-[50000s]" // duration helps prevent autofill bg change
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
            Forgot password?{" "}
            <Link 
              href="/reset-password" 
              className="text-gray-400 hover:text-blue-400 hover:underline font-semibold transition-colors"
            >
              Reset now
            </Link>
          </p>

          {error && <p className="text-red-500 text-[12px] mb-3 text-start">{error}</p>}
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4 transition-colors cursor-pointer">
            Login
          </button>
          
        </div>
      </form>
    </div>
  );
}