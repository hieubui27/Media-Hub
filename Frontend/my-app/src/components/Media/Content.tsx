// src/components/Media/Content.tsx
"use client";

import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";
import Image from "next/image";
import TrackingButton from "./TrackingButton";
import StarRating from "./StarRating";

/**
 * 1. ĐỊNH NGHĨA NGOÀI RENDER (SỬA LỖI TRONG ẢNH)
 */
const DetailRow = ({ label, value }: { label: string; value: any }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between items-start text-[13px] py-1 border-b border-white/5 last:border-0 w-full">
      <span className="text-zinc-400 font-medium shrink-0 mr-4">{label}:</span>
      <span className="text-zinc-100 text-right">{value}</span>
    </div>
  );
};

export default function Content({ data }: { data: any }) {
  // Lấy loại media để hiển thị các trường đặc thù
  const mediaType = data.typeName || data.type;

  // Hàm helper để render dữ liệu theo từng loại nội dung
  const renderFullDetails = () => {
    switch (mediaType) {
      case "Movie":
      case "movie":
        return (
          <>
            <DetailRow label="Đạo diễn" value={data.director} />
            <DetailRow label="Thời lượng" value={data.runTimeMinutes ? `${data.runTimeMinutes} phút` : data.duration} />
            <DetailRow label="Diễn viên" value={data.cast} />
            <DetailRow label="Nhà sản xuất" value={data.producers} />
          </>
        );
      case "TV Series":
      case "series":
        return (
          <>
            <DetailRow label="Người sáng tạo" value={data.creator} />
            <DetailRow label="Số mùa" value={data.totalSeasons || data.seasonCount} />
            <DetailRow label="Số tập" value={data.totalEpisodes || data.episodeCount} />
            <DetailRow label="Hãng sản xuất" value={data.productionCompany} />
            <DetailRow label="Trạng thái" value={data.status} />
          </>
        );
      case "Book":
      case "book":
        return (
          <>
            <DetailRow label="Tác giả" value={data.author} />
            <DetailRow label="Phiên bản" value={data.edition} />
            <DetailRow label="Số trang" value={data.pageCount} />
            <DetailRow label="Nhà xuất bản" value={data.publisher} />
          </>
        );
      case "Video Game":
      case "game":
        return (
          <>
            <DetailRow label="Nhà phát triển" value={data.developer} />
            <DetailRow label="Nhà phát hành" value={data.publisher} />
            <DetailRow label="Nền tảng" value={data.platform || (data.platforms && data.platforms.join(", "))} />
            <DetailRow label="Cấu hình tối thiểu" value={data.minRequirement} />
          </>
        );
      case "Music":
        return (
          <>
            <DetailRow label="Nghệ sĩ" value={data.artist} />
            <DetailRow label="Album" value={data.album} />
            <DetailRow label="Nhạc sĩ" value={data.composer} />
            <DetailRow label="Thứ tự bài hát" value={data.trackNumber} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:w-[30%] bg-zinc-900/50 backdrop-blur-xl text-white p-6 rounded-[30px] lg:rounded-[40px] shadow-2xl border border-white/5 h-fit sticky top-24">
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] mb-6 overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg group">
        <Image
          src={data.urlItem || data.thumbnail || "/images.png"}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          unoptimized
        />
        <div className="absolute top-4 right-4 bg-violet-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
          {mediaType}
        </div>
      </div>

      <div className="space-y-6">
        {/* Title & Genres */}
        <div className="space-y-3">
          <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight">
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {data.genres?.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-white/5 text-[9px] font-bold rounded border border-white/10 uppercase text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <TrackingButton mediaId={data.MediaItemId} />
          <StarRating mediaId={data.MediaItemId} />
        </div>

        {/* Detailed Info */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em] mb-3">Thông tin chi tiết</h3>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-1">
            <DetailRow label="Quốc gia" value={data.country} />
            <DetailRow label="Ngôn ngữ" value={data.language} />
            <DetailRow label="Phân loại" value={data.contentRating} />
            <DetailRow label="Ngày phát hành" value={data.releaseDate && new Date(data.releaseDate).toLocaleDateString('vi-VN')} />
            
            {/* Render các trường riêng biệt theo type */}
            {renderFullDetails()}
          </div>
        </div>

        {/* Description Section */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em] mb-2">Mô tả</h3>
          <p className="text-zinc-400 text-[13px] leading-relaxed line-clamp-6 italic">
            {data.description || "Nội dung đang được cập nhật..."}
          </p>
        </div>
      </div>
    </div>
  );
}