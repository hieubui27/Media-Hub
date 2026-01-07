// src/components/Media/Content.tsx
"use client";

import { useState, useEffect } from "react";
import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";
import Image from "next/image";
import TrackingButton from "./TrackingButton";
import StarRating from "./StarRating";

/**
 * Component hiển thị từng dòng thông tin chi tiết.
 * Được định nghĩa bên ngoài để tránh lỗi "Cannot create components during render".
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
  // Trạng thái để kiểm tra component đã mount trên client chưa (tránh lỗi Hydration #418)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mediaType = data.typeName || data.type;

  /**
   * Render các trường thông tin đặc thù dựa trên loại Media.
   */
  const renderFullDetails = () => {
    switch (mediaType?.toLowerCase()) {
      case "movie":
        return (
          <>
            <DetailRow label="Director" value={data.director} />
            <DetailRow label="Runtime" value={data.runTimeMinutes ? `${data.runTimeMinutes} mins` : data.duration} />
            <DetailRow label="Cast" value={data.cast} />
            <DetailRow label="Producers" value={data.producers} />
          </>
        );
      case "tv series":
      case "series":
        return (
          <>
            <DetailRow label="Creator" value={data.creator} />
            <DetailRow label="Seasons" value={data.totalSeasons || data.seasonCount} />
            <DetailRow label="Episodes" value={data.totalEpisodes || data.episodeCount} />
            <DetailRow label="Production" value={data.productionCompany} />
            <DetailRow label="Status" value={data.status} />
          </>
        );
      case "book":
        return (
          <>
            <DetailRow label="Author" value={data.author} />
            <DetailRow label="Edition" value={data.edition} />
            <DetailRow label="Pages" value={data.pageCount} />
            <DetailRow label="Publisher" value={data.publisher} />
          </>
        );
      case "manga":
        return (
          <>
            <DetailRow label="Author" value={data.author} />
            <DetailRow label="Chapters" value={data.chapterCount} />
            <DetailRow label="Color" value={data.isColor ? "Yes" : "No"} />
          </>
        );
      case "video game":
      case "game":
        return (
          <>
            <DetailRow label="Developer" value={data.developer} />
            <DetailRow label="Publisher" value={data.publisher} />
            <DetailRow label="Platforms" value={data.platform || (data.platforms && data.platforms.join(", "))} />
            <DetailRow label="Min Requirements" value={data.minRequirement} />
          </>
        );
      case "music":
        return (
          <>
            <DetailRow label="Artist" value={data.artist} />
            <DetailRow label="Album" value={data.album} />
            <DetailRow label="Composer" value={data.composer} />
            <DetailRow label="Track Number" value={data.trackNumber} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:w-[30%] bg-zinc-900/50 backdrop-blur-xl text-white p-6 rounded-[30px] lg:rounded-[40px] shadow-2xl border border-white/5 h-fit sticky top-24">
      {/* Poster Image */}
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
        {/* Title & Tags */}
        <div className="space-y-3">
          <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight">
            {data.title}
          </h1>
          {data.aliasTitle && (
            <p className="text-zinc-400 text-sm italic">{data.aliasTitle}</p>
          )}
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

        {/* Detailed Information Section */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em] mb-3">Detailed Information</h3>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-1">
            <DetailRow label="Country" value={data.country} />
            <DetailRow label="Language" value={data.language} />
            <DetailRow label="Content Rating" value={data.contentRating} />
            
            {/* Chỉ render ngày tháng sau khi mount để tránh lỗi 418 */}
            {mounted && data.releaseDate && (
              <DetailRow 
                label="Release Date" 
                value={new Date(data.releaseDate).toLocaleDateString('en-US')} 
              />
            )}
            
            {/* Render các trường riêng biệt dựa trên loại Media */}
            {renderFullDetails()}
          </div>
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em] mb-2">Description</h3>
          <p className="text-zinc-400 text-[13px] leading-relaxed line-clamp-6 italic">
            {data.description || "No description available..."}
          </p>
        </div>
      </div>
    </div>
  );
}