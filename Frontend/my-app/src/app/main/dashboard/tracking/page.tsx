"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/src/contexts/UserContext";
import { useRouter } from "next/navigation";
import { 
  getUserTracking, 
  createTracking, 
  updateTracking, 
  deleteTracking,
  TrackingItem,
  TrackingStatus 
} from "@/src/services/trackingService";
import Link from "next/link";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const STATUS_OPTIONS: { value: TrackingStatus; label: string; color: string }[] = [
  { value: "PLAN_TO_WATCH", label: "Plan to Watch", color: "bg-violet-400" },
  { value: "WATCHING", label: "Watching", color: "bg-violet-600" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-600" },
];

export default function TrackingPage() {
  const { user } = useUser(); // isLoading handled by ProtectedRoute
  const router = useRouter();
  const [trackingList, setTrackingList] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    status: TrackingStatus;
    comment: string;
    rating: number;
  }>({
    status: "WATCHING",
    comment: "",
    rating: 0,
  });

  // Load tracking only when user is available (guaranteed by ProtectedRoute)
  useEffect(() => {
    if (user) {
      loadTracking();
    }
  }, [user]);

  const loadTracking = async () => {
    if (!user?.accessToken) return;
    
    setLoading(true);
    try {
      const data = await getUserTracking(user.accessToken);
      console.log("Loaded tracking list:", data);
      setTrackingList(data);
    } catch (error) {
      console.error("Error loading tracking:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... handleEdit, handleSave, handleDelete ...
  const handleEdit = (item: TrackingItem) => {
    setEditingId(item.logId);
    setFormData({
      status: item.status,
      comment: item.comment || "",
      rating: item.rating || 0,
    });
  };

  const handleSave = async (logId: number) => {
    if (!user?.accessToken) return;

    try {
      const result = await updateTracking(logId, formData, user.accessToken);
      if (result.success) {
        await loadTracking();
        setEditingId(null);
        setFormData({ status: "WATCHING", comment: "", rating: 0 });
      } else {
        alert(result.message || "Unable to update tracking");
      }
    } catch (error) {
      console.error("Error saving tracking:", error);
      alert("An error occurred while saving tracking");
    }
  };

  const handleDelete = async (logId: number) => {
    if (!user?.accessToken) return;
    if (!confirm("Are you sure you want to delete this tracking?")) return;

    try {
      const result = await deleteTracking(logId, user.accessToken);
      if (result.success) {
        await loadTracking();
      } else {
        alert(result.message || "Unable to delete tracking");
      }
    } catch (error) {
      console.error("Error deleting tracking:", error);
      alert("An error occurred while deleting tracking");
    }
  };


  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-white">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-8 uppercase tracking-tight">
            Tracking Space
          </h1>

          {trackingList.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[40px] border border-white/5">
              <p className="text-zinc-500 text-lg">No tracking yet</p>
              <p className="text-zinc-600 text-sm mt-2">Start tracking from media detail page</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {trackingList.map((item) => {
                const statusConfig = STATUS_OPTIONS.find(s => s.value === item.status);
                const isEditing = editingId === item.logId;
                const media = item.media;
                const posterUrl = media?.urlItem || media?.thumbnail || "/images.png";

                return (
                  <div
                    key={item.logId}
                    className="relative overflow-hidden rounded-[40px] border border-white/5 shadow-2xl"
                  >
                    {/* Background Poster với blur */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${posterUrl})` }}
                    >
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link
                            href={`/main/media/detail/${media.MediaItemId}`}
                            className="block mb-2"
                          >
                            <h2 className="text-2xl font-black text-white hover:text-violet-500 transition-colors mb-2">
                              {media.title || `Media ID: ${media.MediaItemId}`}
                            </h2>
                          </Link>
                          
                          {/* Genres */}
                          {media.genres && media.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {media.genres.map((genre: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Status Badge */}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${statusConfig?.color || "bg-gray-500"}`}
                          >
                            {statusConfig?.label || item.status}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!isEditing ? (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-black font-bold rounded-full text-sm transition-all shadow-lg"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.logId)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm transition-all shadow-lg"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                              <button
                                onClick={() => {
                                  handleSave(item.logId);
                                }}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-sm transition-all shadow-lg"
                              >
                                Save
                              </button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4 mt-6 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                          {/* Status Dropdown */}
                          <div>
                            <label className="block text-sm font-bold text-white mb-2">
                              Status
                            </label>
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value as TrackingStatus })
                              }
                              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option 
                                  key={opt.value} 
                                  value={opt.value}
                                  className="bg-[#0a0a0a] text-white"
                                >
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Comment */}
                          <div>
                            <label className="block text-sm font-bold text-white mb-2">
                              Comment
                            </label>
                            <textarea
                              value={formData.comment}
                              onChange={(e) =>
                                setFormData({ ...formData, comment: e.target.value })
                              }
                              placeholder="Enter your comment..."
                              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500 min-h-[100px]"
                            />
                          </div>

                          {/* Rating */}
                          <div>
                            <label className="block text-sm font-bold text-white mb-2">
                              Rating (0-5)
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                value={formData.rating}
                                onChange={(e) =>
                                  setFormData({ ...formData, rating: parseFloat(e.target.value) })
                                }
                                className="flex-1"
                              />
                              {formData.rating > 0 ? (
                                <span className="text-2xl font-bold text-violet-500 min-w-[60px] text-center">
                                  {formData.rating.toFixed(1)}/5
                                </span>
                              ) : (
                                <span className="text-sm text-zinc-400 min-w-[60px] text-center">
                                  Not rated
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, rating: star })}
                                  className="text-2xl transition-all hover:scale-125"
                                >
                                  <span
                                    className={
                                      star <= formData.rating
                                        ? "text-violet-500"
                                        : "text-zinc-400"
                                    }
                                  >
                                    ★
                                  </span>
                                </button>
                              ))}
                              {/* Button to remove rating (set to 0) */}
                              {formData.rating > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, rating: 0 })}
                                  className="text-sm text-zinc-400 hover:text-white ml-2 px-2 py-1 rounded border border-zinc-600 hover:border-zinc-400 transition-colors"
                                  title="Remove rating"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 mt-6 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                          {item.comment && item.comment.trim() !== "" && (
                            <div>
                              <p className="text-sm font-bold text-zinc-300 mb-1">Comment:</p>
                              <p className="text-white">{item.comment}</p>
                            </div>
                          )}
                          {item.rating && item.rating > 0 && (
                            <div>
                              <p className="text-sm font-bold text-zinc-300 mb-1">Rating:</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xl text-violet-500">
                                  {"★".repeat(Math.floor(item.rating))}
                                </span>
                                <span className="text-white font-bold">{item.rating.toFixed(1)}/5</span>
                              </div>
                            </div>
                          )}
                          {(!item.comment || item.comment.trim() === "") && (!item.rating || item.rating === 0) && (
                            <p className="text-zinc-400 text-sm italic">No comment or rating yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
