// src/components/Media/Content.tsx
"use client";

import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";
import Image from "next/image";
import TrackingButton from "./TrackingButton";
import StarRating from "./StarRating";


export default function Content({ data }: { data: MediaItemDetail }) {
  return (
    <div className="w-[30%] bg-gradient-to-b from-[#2d3436] to-transparent text-white p-6 rounded-[40px] shadow-2xl border border-white/5">
      <div className="relative w-full aspect-[2/3] mb-6 overflow-hidden rounded-3xl shadow-lg">
        <Image
          src={data.urlItem || "/images.png"}
          alt={data.title}
          fill
          className="object-cover"
          priority
          unoptimized // Load ảnh này trước để tối ưu LCP
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-tight leading-tight">
          {data.title}
        </h1>
        
        <div className="flex flex-wrap gap-2">
          {data.genres.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/10 text-[10px] font-bold rounded-md border border-white/10 uppercase">
              {tag}
            </span>
          ))}
        </div>

        {/* Nút Tracking và Rating - chỉ hiển thị khi đăng nhập */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <TrackingButton mediaId={data.MediaItemId} />
          <StarRating mediaId={data.MediaItemId} />
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-zinc-400 mb-2">Giới thiệu:</h3>
          <p className="text-zinc-300 text-[13px] leading-relaxed line-clamp-6">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}