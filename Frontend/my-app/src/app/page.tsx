"use client"; // 1. Bắt buộc để dùng useRouter và onClick

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // 2. Sửa cú pháp khai báo hàm
  const handleClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <h1 
        className="text-[100px] font-bold cursor-pointer hover:opacity-80 transition-opacity text-center leading-tight" 
        onClick={handleClick}
      >
          DANG NHAP VAO NGAY CHO BOOOOO
      </h1>
    </div>
  );
}