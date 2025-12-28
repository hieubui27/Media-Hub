"use client";
import { useState, useEffect } from "react";
import { getReviewsByMediaId, getMediaRating } from "@/src/services/mediaService";
import { ReviewData } from "@/src/interfaces/Review";

export default function Review({ mediaId }: { mediaId: string }) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviewData() {
      try {
        const [revData, ratData] = await Promise.all([
          getReviewsByMediaId(mediaId),
          getMediaRating(mediaId)
        ]);
        setReviews(revData);
        setRating(ratData);
      } finally {
        setLoading(false);
      }
    }
    loadReviewData();
  }, [mediaId]);
  if (loading) return <div className="w-[70%] animate-pulse bg-white/5 rounded-[40px] h-[400px]" />;

  return (
    <div className="w-[70%] bg-gradient-to-b from-[#2d3436] to-transparent text-white p-8 rounded-[40px] shadow-2xl">
      {/* Hiển thị Rating & Review List dựa trên JSON bạn đã cung cấp */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h2 className="text-3xl font-bold uppercase mb-4">Reviews</h2>
        <div className="flex items-center gap-4">
          <span className="text-6xl font-black text-yellow-400">{rating.toFixed(1)}</span>
          <div className="text-2xl text-yellow-500">{"★".repeat(Math.floor(rating))}</div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.reviewId} className="bg-white/5 p-4 rounded-2xl flex gap-4 border border-white/5">
            <img 
              src={rev.userAvatar || `https://ui-avatars.com/api/?name=${rev.userName}`} 
              className="w-10 h-10 rounded-full" 
            />
            <div>
              <div className="flex justify-between w-full gap-40">
                <span className="font-bold text-yellow-500">{rev.userName}</span>
                <span className="text-[10px] text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-zinc-300 text-sm mt-1">{rev.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}