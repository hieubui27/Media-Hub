"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/src/contexts/UserContext";
import { 
  getReviewsByMediaId, 
  getMediaRating, 
  createReview, 
  updateReview, 
  deleteReview as deleteUserReview // Alias cho service của User
} from "@/src/services/mediaService";
import { deleteReview as deleteAdminReview } from "@/src/services/adminService"; // Service của Admin
import { ReviewData } from "@/src/interfaces/Review";
import { Send, Edit2, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { message, Modal } from "antd";

export default function Review({ mediaId }: { mediaId: string }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load dữ liệu
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

  // Xử lý Gửi/Sửa Review (Chỉ User mới làm được)
  const handleSubmit = async () => {
    if (!user?.accessToken || !content.trim()) return;
    
    try {
      if (editingId) {
        await updateReview(mediaId, editingId, content, user.accessToken);
        message.success("Đã cập nhật bình luận");
      } else {
        await createReview(mediaId, content, user.accessToken);
        message.success("Đã đăng bình luận");
      }
      setContent("");
      setEditingId(null);
      loadData();
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi bình luận");
    }
  };

  // Xử lý Xóa Review (Phân quyền Admin/User)
  const handleDelete = (reviewId: number, isOwn: boolean) => {
    if (!user?.accessToken) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bình luận này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (user.role === "ADMIN" && !isOwn) {
            // Trường hợp Admin xóa bài người khác
            await deleteAdminReview(reviewId);
            message.success("Admin đã xóa bình luận vi phạm");
          } else {
            // Trường hợp User xóa bài mình (hoặc Admin xóa bài mình)
            await deleteUserReview(mediaId, reviewId, user.accessToken);
            message.success("Đã xóa bình luận");
          }
          loadData();
        } catch (error) {
          message.error("Xóa thất bại. Vui lòng thử lại.");
        }
      }
    });
  };

  if (loading) return <div className="w-full lg:w-[70%] animate-pulse bg-white/5 rounded-[30px] h-[300px]" />;

  return (
    <div className="w-full lg:w-[70%] bg-gradient-to-b from-[#2d3436] to-transparent text-white p-4 lg:p-8 rounded-[30px] lg:rounded-[40px] shadow-2xl h-fit">
      {/* Header Statistics */}
      <div className="border-b border-white/10 pb-4 lg:pb-6 mb-6 lg:mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold uppercase mb-2 lg:mb-4 tracking-tighter">Community Reviews</h2>
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="text-4xl lg:text-6xl font-black text-violet-400">{rating.toFixed(1)}</span>
            <div className="text-xl lg:text-2xl text-violet-500">{"★".repeat(Math.floor(rating))}</div>
            <span className="text-zinc-500 text-sm ml-2">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Input Form - Chỉ hiện khi đăng nhập */}
      {user ? (
        <div className="mb-10 bg-white/5 p-6 rounded-3xl border border-white/10">
           <div className="flex items-center gap-4 mb-4">
             <img src={user.avatar || `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`} className="w-10 h-10 rounded-full"/>
             <span className="font-bold">{user.displayName}</span>
             {editingId && <span className="text-yellow-500 text-sm ml-auto">(Đang chỉnh sửa)</span>}
           </div>
           <div className="relative">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pr-14 outline-none focus:border-violet-500 transition-all resize-none h-24 text-sm"
              placeholder={editingId ? "Cập nhật nội dung..." : "Bạn nghĩ gì về phim này?..."}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              {editingId && (
                <button onClick={() => {setEditingId(null); setContent("");}} className="p-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white text-xs">
                  Hủy
                </button>
              )}
              <button onClick={handleSubmit} className="p-3 bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-10 text-center py-6 bg-white/5 rounded-3xl border border-dashed border-white/20">
          Vui lòng <Link href="/auth/login" className="text-violet-400 font-bold underline">đăng nhập</Link> để viết đánh giá
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-zinc-500 text-center">Chưa có đánh giá nào.</p>}
        
        {reviews.map((rev) => {
          const isOwnReview = user?.id === rev.userId;
          const isAdmin = user?.role === "ADMIN";

          return (
            <div key={rev.reviewId} className="bg-white/5 p-5 rounded-[30px] flex gap-4 border border-white/5 group transition-all hover:bg-white/10">
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app"}${rev.userAvatar}` || `https://ui-avatars.com/api/?name=${rev.userName}`} 
                className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-violet-500/50 transition-all" 
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-violet-500 block">{rev.userName}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* EDIT: Chỉ User chủ sở hữu */}
                    {isOwnReview && (
                      <button 
                        onClick={() => {setEditingId(rev.reviewId); setContent(rev.content); window.scrollTo({top: 0, behavior: 'smooth'});}} 
                        className="p-2 hover:bg-blue-500/20 rounded-full"
                        title="Sửa"
                      >
                        <Edit2 size={16} className="text-blue-400" />
                      </button>
                    )}
                    
                    {/* DELETE: User chủ sở hữu HOẶC Admin */}
                    {(isOwnReview || isAdmin) && (
                      <button 
                        onClick={() => handleDelete(rev.reviewId, isOwnReview)} 
                        className="p-2 hover:bg-red-500/20 rounded-full"
                        title={isAdmin && !isOwnReview ? "Admin xóa" : "Xóa"}
                      >
                        {isAdmin && !isOwnReview ? (
                             <ShieldAlert size={16} className="text-red-500" /> 
                        ) : (
                             <Trash2 size={16} className="text-zinc-400 hover:text-red-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{rev.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}