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
      // Not logged in, redirect to login page
      router.push("/auth/login");
      return;
    }

    // Check accessToken
    if (!user.accessToken) {
      console.error("No access token available");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call API to save rating
      const result = await createRating(mediaId, starValue, user.accessToken);
      
      if (result.success) {
        setRating(starValue);
        if (onRatingChange) {
          onRatingChange(starValue);
        }
        console.log("Rating saved successfully:", starValue);
      } else {
        console.error("Failed to save rating:", result.message);
        alert(result.message || "Unable to save rating. Please try again.");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("An error occurred while saving rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-zinc-400 mr-2">Rate:</span>
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
            aria-label={`Rate ${star} stars`}
          >
            <span
              className={
                star <= (hoveredStar || rating)
                  ? "text-violet-500"
                  : "text-zinc-600"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-violet-500 font-bold ml-2">
          {rating}/5
        </span>
      )}
      {isSubmitting && (
        <span className="text-xs text-zinc-500 ml-2">Saving...</span>
      )}
    </div>
  );
}
