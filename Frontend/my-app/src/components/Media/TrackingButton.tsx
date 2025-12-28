"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";
import { PlayCircleFilled } from "@ant-design/icons";
import { createTracking, TrackingStatus } from "@/src/services/trackingService";

interface TrackingButtonProps {
  mediaId: string | number;
}

export default function TrackingButton({ mediaId }: TrackingButtonProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);

  const handleTracking = async () => {
    if (!user) {
      // Chưa đăng nhập, chuyển hướng đến trang login
      router.push("/auth/login");
      return;
    }

    if (!user.accessToken) {
      console.error("No access token available");
      router.push("/auth/login");
      return;
    }

    setIsCreating(true);
    try {
      // Đảm bảo mediaId là number
      const mediaItemId = Number(mediaId);
      console.log("Creating tracking for mediaId:", mediaItemId);
      
      // Tạo tracking mới với status mặc định là WATCHING
      const result = await createTracking(
        mediaItemId,
        {
          status: "WATCHING" as TrackingStatus,
          comment: "",
        },
        user.accessToken
      );

      if (result.success) {
        console.log("Tracking created successfully:", result.data);
        // Chuyển đến trang tracking để xem và chỉnh sửa
        router.push("/main/dashboard/tracking");
      } else {
        alert(result.message || "Không thể tạo tracking. Có thể bạn đã tracking media này rồi.");
      }
    } catch (error) {
      console.error("Error creating tracking:", error);
      alert("Có lỗi xảy ra khi tạo tracking");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleTracking}
      disabled={isCreating}
      className={`flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-black transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 ${
        isCreating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <PlayCircleFilled className="text-xl" />
      {isCreating ? "Đang tạo..." : "Tracking"}
    </button>
  );
}

