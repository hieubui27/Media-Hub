"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/src/contexts/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getUserTracking,
  updateTracking,
  deleteTracking,
  TrackingItem,
  TrackingStatus,
} from "@/src/services/trackingService";
import Link from "next/link";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import Pagination from "@/src/components/common/Pagination";

const STATUS_OPTIONS: {
  value: TrackingStatus;
  label: string;
  color: string;
}[] = [
  { value: "PLAN_TO_WATCH", label: "Plan to Watch", color: "bg-violet-400" },
  { value: "WATCHING", label: "Watching", color: "bg-violet-600" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-600" },
];

const MEDIA_TYPES = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "music", label: "Music" },
  { id: "book", label: "Books" },
  { id: "Video Game", label: "Games" },
  { id: "TV Series", label: "TV Series" },
];

export default function TrackingPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI page bắt đầu từ 1, API bắt đầu từ 0
  const currentPage = Number(searchParams.get("page")) || 1;

  const [trackingList, setTrackingList] = useState<TrackingItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    status: "WATCHING" as TrackingStatus,
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    if (user) loadTracking();
  }, [user, activeType, currentPage]);

  const loadTracking = async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    try {
      const response = await getUserTracking(
        user.accessToken,
        activeType,
        currentPage - 1
      );
      if (response) {
        setTrackingList(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Load tracking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (typeId: string) => {
    setActiveType(typeId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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
    const result = await updateTracking(logId, formData, user.accessToken);
    if (result.success) {
      setEditingId(null);
      loadTracking();
    }
  };

  const handleDelete = async (logId: number) => {
    if (!user?.accessToken || !confirm("Are you sure?")) return;
    const result = await deleteTracking(logId, user.accessToken);
    if (result.success) loadTracking();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              Tracking Space
            </h1>

            {/* TABS */}
            <div className="flex p-1 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 w-full lg:w-fit overflow-x-auto">
              {MEDIA_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTabChange(type.id)}
                  className={`px-6 lg:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeType === type.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center py-20 animate-pulse text-zinc-500">
              Loading list...
            </div>
          ) : trackingList.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[40px] border border-white/5 text-zinc-500">
              No items found in {activeType}
            </div>
          ) : (
            <>
              <div className="grid gap-8">
                {trackingList.map((item) => {
                  const statusConfig = STATUS_OPTIONS.find(
                    (s) => s.value === item.status
                  );
                  const isEditing = editingId === item.logId;
                  const poster =
                    item.media?.urlItem ||
                    item.media?.thumbnail ||
                    "/images.png";

                  return (
                    <div
                      key={item.logId}
                      className="relative overflow-hidden rounded-[40px] border border-white/5 shadow-2xl"
                    >
                      {/* BACKGROUND BLUR */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url(${poster})` }}
                      />

                      {/* CONTENT */}
                      <div className="relative z-10 p-8 grid grid-cols-1 lg:grid-cols-[160px_1fr_auto] gap-8 items-center">
                        {/* POSTER (DESKTOP ONLY) */}
                        <div className="hidden lg:block">
                          <img
                            src={poster}
                            alt={item.media.title}
                            className="w-[140px] h-[210px] object-cover rounded-2xl shadow-xl"
                          />
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                          <Link
                            href={`/main/media/detail/${item.media.MediaItemId}`}
                          >
                            <h2 className="text-2xl lg:text-3xl font-black text-white hover:text-violet-500 leading-tight mb-2">
                              {item.media.title}
                            </h2>
                          </Link>

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${statusConfig?.color}`}
                          >
                            {statusConfig?.label}
                          </span>

                          {isEditing ? (
                            <div className="mt-4 space-y-3">
                              <select
                                value={formData.status}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    status: e.target.value as TrackingStatus,
                                  })
                                }
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>

                              <textarea
                                value={formData.comment}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    comment: e.target.value,
                                  })
                                }
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                                rows={3}
                              />
                            </div>
                          ) : (
                            <div className="mt-4 space-y-1 text-zinc-400 italic">
                              {item.comment
                                ? `"${item.comment}"`
                                : "No comments"}
                              <p className="text-violet-400 font-bold not-italic">
                                ★ {item.rating || 0}/5
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex lg:flex-col items-center gap-3">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(item.logId)}
                              className="px-6 py-2 lg:px-8 lg:py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition"
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-6 py-2 lg:px-8 lg:py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.logId)}
                                className="px-6 py-2 lg:px-8 lg:py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
