"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/UserContext";
import { createRating } from "@/src/services/mediaService";

interface StarRatingProps {
  mediaId: string | number;
  currentRating?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  mediaId, 
  currentRating = 0,
  onRatingChange 
}: StarRatingProps) {
  const router = useRouter();
  const { user } = useUser();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rating, setRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = async (starValue: number) => {
    if (!user) {
      // Chưa đăng nhập, chuyển hướng đến trang login
      router.push("/auth/login");
      return;
    }

    // Kiểm tra accessToken
    if (!user.accessToken) {
      console.error("No access token available");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Gọi API để lưu rating
      const result = await createRating(mediaId, starValue, user.accessToken);
      
      if (result.success) {
        setRating(starValue);
        if (onRatingChange) {
          onRatingChange(starValue);
        }
        console.log("Rating saved successfully:", starValue);
      } else {
        console.error("Failed to save rating:", result.message);
        alert(result.message || "Không thể lưu đánh giá. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-zinc-400 mr-2">Đánh giá:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            disabled={isSubmitting}
            className={`text-2xl transition-all hover:scale-125 focus:outline-none ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            aria-label={`Đánh giá ${star} sao`}
          >
            <span
              className={
                star <= (hoveredStar || rating)
                  ? "text-yellow-500"
                  : "text-zinc-600"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-yellow-500 font-bold ml-2">
          {rating}/5
        </span>
      )}
      {isSubmitting && (
        <span className="text-xs text-zinc-500 ml-2">Đang lưu...</span>
      )}
    </div>
  );
}

