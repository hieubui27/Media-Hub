"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/src/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  uploadMedia,
  updateMedia,
  deleteMedia,
  getUserMediaUploads,
  MediaUploadRequest,
  MediaUploadItem,
} from "@/src/services/uploadService";

// 1. Cấu hình danh mục Genres theo từng loại Media
const GENRES_MAP: Record<string, string[]> = {
  "Movie": ["Hành động", "Phiêu lưu", "Hoạt hình", "Hài kịch", "Hình sự", "Tài liệu", "Chính kịch", "Gia đình", "Viễn tưởng", "Kinh dị", "Ca nhạc", "Bí ẩn", "Lãng mạn", "Giật gân", "Chiến tranh"],
  "TV Series": ["Hành động & Phiêu lưu", "Hoạt hình", "Hài", "Tội phạm", "Tài liệu", "Chính kịch", "Gia đình", "Trẻ em", "Bí ẩn", "Tin tức", "Reality", "Khoa học viễn tưởng", "Soap", "Talk"],
  "Book": ["Tiểu thuyết", "Kỹ năng sống", "Kinh doanh", "Lịch sử", "Khoa học", "Thiếu nhi", "Trinh thám", "Kinh dị", "Tiểu sử", "Văn học"],
  "Video Game": ["RPG", "FPS", "Chiến thuật", "Thể thao", "Phiêu lưu", "Mô phỏng", "Đối kháng", "Kinh dị sinh tồn", "Thế giới mở"],
  "Music": ["Pop", "Rock", "Jazz", "Classical", "Hip-hop", "EDM", "R&B", "Country", "Indie"]
};

const MEDIA_TYPES = Object.keys(GENRES_MAP);

export default function UploadPage() {
  // Lấy thêm authLoading từ UserContext để xử lý reload trang
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  // State quản lý dữ liệu
  const [uploadList, setUploadList] = useState<MediaUploadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<MediaUploadRequest>({
    title: "",
    description: "",
    language: "",
    country: "",
    contentRating: "",
    releaseDate: "",
    urlItem: "",
    typeName: "Movie",
    genres: [],
  });

  // 2. Xử lý bảo vệ định danh (Authentication Protection)
  useEffect(() => {
    // Nếu đã check xong localStorage (authLoading = false) mà không thấy user
    if (!authLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      loadUploads();
    }
  }, [user, authLoading, router]);

  const loadUploads = async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    try {
      const data = await getUserMediaUploads(user.accessToken);
      setUploadList(data);
    } catch (error) {
      console.error("Error loading uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Logic chọn Genres dạng Tags
  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      const isSelected = prev.genres.includes(genre);
      return {
        ...prev,
        genres: isSelected
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.accessToken) return;

    if (formData.genres.length === 0) {
      alert("Vui lòng chọn ít nhất một thể loại!");
      return;
    }

    try {
      const result = editingId 
        ? await updateMedia(editingId, formData, user.accessToken)
        : await uploadMedia(formData, user.accessToken);

      if (result.success) {
        await loadUploads();
        resetForm();
        alert(editingId ? "Cập nhật thành công!" : "Upload thành công!");
      } else {
        alert(result.message || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Có lỗi xảy ra kết nối đến server");
    }
  };

  const handleEdit = (item: MediaUploadItem) => {
    setEditingId(item.mediaId);
    setFormData({
      title: item.title,
      description: item.description || "",
      typeName: item.mediaType,
      urlItem: item.imagePath || "",
      genres: [], // Lưu ý: API cần trả về danh sách genres hiện tại nếu muốn hiển thị lại lúc sửa
      language: "",
      country: "",
      contentRating: "",
      releaseDate: "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (mediaId: number) => {
    if (!user?.accessToken || !confirm("Bạn có chắc muốn xóa media này?")) return;
    try {
      const result = await deleteMedia(mediaId, user.accessToken);
      if (result.success) {
        setUploadList(prev => prev.filter(item => item.mediaId !== mediaId));
        alert("Xóa thành công!");
      }
    } catch (error) {
      alert("Lỗi khi xóa media");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      language: "",
      country: "",
      contentRating: "",
      releaseDate: "",
      urlItem: "",
      typeName: "Movie",
      genres: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Hiển thị trạng thái chờ khi đang check login từ localStorage
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-medium">Đang xác thực phiên đăng nhập...</p>
      </div>
    );
  }

  // Nếu không có user, không render nội dung (để useEffect redirect)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-10 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Media <span className="text-yellow-500">Hub</span>
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">Quản lý và upload nội dung đa phương tiện của bạn</p>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl ${
              showForm ? "bg-zinc-800 text-white" : "bg-yellow-500 text-black hover:scale-105"
            }`}
          >
            {showForm ? "Đóng Form" : "+ Upload nội dung"}
          </button>
        </div>

        {/* Form Upload/Edit */}
        {showForm && (
          <div className="bg-[#111] p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl mb-16 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
              <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
              {editingId ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Cột trái */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black uppercase text-zinc-500 mb-3 block">Tiêu đề tác phẩm *</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-yellow-500 outline-none transition-all"
                      placeholder="Nhập tên phim, sách hoặc trò chơi..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-zinc-500 mb-3 block">Loại hình *</label>
                    <select
                      value={formData.typeName}
                      onChange={(e) => setFormData({ ...formData, typeName: e.target.value, genres: [] })}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-yellow-500 outline-none cursor-pointer"
                    >
                      {MEDIA_TYPES.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-zinc-500 mb-3 block">Poster URL</label>
                    <input
                      type="text" value={formData.urlItem}
                      onChange={(e) => setFormData({ ...formData, urlItem: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-yellow-500 outline-none"
                      placeholder="https://link-anh-cua-ban.jpg"
                    />
                  </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black uppercase text-zinc-500 mb-3 block">Mô tả tóm tắt</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-yellow-500 outline-none min-h-[155px] resize-none"
                      placeholder="Viết một vài dòng giới thiệu..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Quốc gia</label>
                      <input
                        type="text" value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block">Ngày phát hành</label>
                      <input
                        type="date" value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Genre Selector */}
              <div className="pt-6 border-t border-white/5">
                <label className="text-xs font-black uppercase text-zinc-500 mb-5 block italic">
                  Chọn thể loại phù hợp cho <span className="text-yellow-500">{formData.typeName}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {GENRES_MAP[formData.typeName].map((genre) => {
                    const active = formData.genres.includes(genre);
                    return (
                      <button
                        key={genre} type="button" onClick={() => toggleGenre(genre)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                          active 
                          ? "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105" 
                          : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                        }`}
                      >
                        {active && <span className="mr-2">✓</span>}
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button type="submit" className="flex-1 bg-yellow-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-yellow-400 transition-all active:scale-95 shadow-xl">
                  {editingId ? "Cập nhật ngay" : "Bắt đầu Upload"}
                </button>
                <button type="button" onClick={resetForm} className="px-10 py-5 bg-zinc-900 text-zinc-400 font-bold rounded-2xl uppercase tracking-widest hover:bg-zinc-800 transition-all">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold whitespace-nowrap">Danh sách của bạn</h2>
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-500 animate-pulse">Đang tải danh sách dữ liệu...</div>
          ) : uploadList.length === 0 ? (
            <div className="py-32 bg-white/5 rounded-[40px] border border-dashed border-white/10 text-center">
              <p className="text-zinc-500 text-lg">Chưa có nội dung nào được đăng tải.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {uploadList.map((item) => (
                <div key={item.mediaId} className="group flex flex-col md:flex-row items-center gap-8 bg-[#111] p-6 rounded-[35px] border border-white/5 hover:border-yellow-500/30 transition-all">
                  <div className="w-32 h-44 bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    {item.imagePath ? (
                      <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-[10px] font-bold uppercase tracking-tighter bg-yellow-500 text-black px-2 py-1 rounded">View</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-3">
                      {item.mediaType}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-yellow-500 transition-colors mb-2">{item.title}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4 leading-relaxed">{item.description || "Chưa có nội dung mô tả cho tác phẩm này."}</p>
                    <div className="text-[10px] text-zinc-600 font-bold uppercase">Đã tải lên: {new Date(item.createdDate).toLocaleDateString("vi-VN")}</div>
                  </div>

                  <div className="flex md:flex-col gap-3 w-full md:w-auto">
                    <button onClick={() => handleEdit(item)} className="flex-1 px-8 py-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-xl font-bold text-sm transition-all border border-white/5">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(item.mediaId)} className="flex-1 px-8 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-bold text-sm transition-all border border-red-500/20">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}