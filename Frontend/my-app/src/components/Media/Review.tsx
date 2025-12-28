"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/src/contexts/UserContext"; // Lấy thông tin user đăng nhập
import { 
  getReviewsByMediaId, 
  getMediaRating, 
  createReview, 
  updateReview, 
  deleteReview 
} from "@/src/services/mediaService";
import { ReviewData } from "@/src/interfaces/Review";
import { Send, Edit2, Trash2, X } from "lucide-react";
import Link from "next/link";

export default function Review({ mediaId }: { mediaId: string }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State cho form
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [revData, ratData] = await Promise.all([
        getReviewsByMediaId(mediaId),
        getMediaRating(mediaId)
      ]);
      setReviews(revData);
      setRating(ratData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [mediaId]);

  const handleSubmit = async () => {
    if (!user?.accessToken || !content.trim()) return;
    
    if (editingId) {
      await updateReview(mediaId, editingId, content, user.accessToken);
    } else {
      await createReview(mediaId, content, user.accessToken);
    }
    
    setContent("");
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (user?.accessToken && confirm("Xóa review này?")) {
      await deleteReview(mediaId, id, user.accessToken);
      loadData();
    }
  };

  if (loading) return <div className="w-[70%] animate-pulse bg-white/5 rounded-[40px] h-[400px]" />;

  return (
    <div className="w-[70%] bg-gradient-to-b from-[#2d3436] to-transparent text-white p-8 rounded-[40px] shadow-2xl">
      <div className="border-b border-white/10 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold uppercase mb-4 tracking-tighter">Cộng đồng Reviews</h2>
          <div className="flex items-center gap-4">
            <span className="text-6xl font-black text-purple-400">{rating.toFixed(1)}</span>
            <div className="text-2xl text-purple-500">{"★".repeat(Math.floor(rating))}</div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      {user ? (
        <div className="mb-10 bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-purple-500" alt="" />
            <span className="font-bold text-sm">{editingId ? "Đang chỉnh sửa review..." : "Viết cảm nhận của bạn"}</span>
            {editingId && <button onClick={() => {setEditingId(null); setContent("");}}><X size={16}/></button>}
          </div>
          <div className="relative">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pr-14 outline-none focus:border-purple-500 transition-all resize-none h-24 text-sm"
              placeholder="Phim này thế nào nhỉ?..."
            />
            <button 
              onClick={handleSubmit}
              className="absolute right-3 bottom-3 p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-10 text-center py-6 bg-white/5 rounded-3xl border border-dashed border-white/20">
          Vui lòng <Link href="/auth/login" className="text-purple-400 font-bold underline">đăng nhập</Link> để viết review
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => {
          // Kiểm tra xem đây có phải review của user hiện tại không (Dựa trên image_e3ecf9.png)
          const isOwnReview = user?.id === rev.userId;
          console.log(rev.userId);
          console.log(user?.id);
          return (
            <div key={rev.reviewId} className="bg-white/5 p-5 rounded-[30px] flex gap-4 border border-white/5 group transition-all hover:bg-white/10">
              <img 
                src={rev.userAvatar || `https://ui-avatars.com/api/?name=${rev.userName}`} 
                className="w-12 h-12 rounded-full object-cover" 
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-yellow-500 block">{rev.userName}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {isOwnReview && (
  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button onClick={() => {setEditingId(rev.reviewId); setContent(rev.content);}}>
      <Edit2 size={16} />
    </button>
    <button onClick={() => handleDelete(rev.reviewId)}>
      <Trash2 size={16} />
    </button>
  </div>
)}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{rev.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}