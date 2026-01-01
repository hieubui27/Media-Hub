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
      // Not logged in, redirect to login page
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
      // Ensure mediaId is number
      const mediaItemId = Number(mediaId);
      console.log("Creating tracking for mediaId:", mediaItemId);
      
      // Create new tracking with default status WATCHING
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
        // Navigate to tracking page to view and edit
        router.push("/main/dashboard/tracking");
      } else {
        alert(result.message || "Unable to create tracking. You may have already tracked this media.");
      }
    } catch (error) {
      console.error("Error creating tracking:", error);
      alert("An error occurred while creating tracking");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleTracking}
      disabled={isCreating}
      className={`flex items-center gap-3 bg-violet-500 hover:bg-violet-400 text-white px-6 py-3 rounded-full font-black transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 ${
        isCreating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <PlayCircleFilled className="text-xl" />
      {isCreating ? "Creating..." : "Tracking"}
    </button>
  );
}
