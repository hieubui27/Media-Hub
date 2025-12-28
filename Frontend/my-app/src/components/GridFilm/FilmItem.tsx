"use client";
import Link from "next/link";
import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";

export default function MediaCard({ item }: { item: MediaItemDetail }) {
  return (
    <Link 
      href={`/main/media/detail/${item.MediaItemId}`}
      className="group block bg-[#1a1a1a] rounded-2xl overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all duration-300 shadow-lg"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={item.thumbnail || "/placeholder-poster.png"} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Hiển thị tag loại Media ở góc (Tùy chọn) */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase">
          {item.type}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate group-hover:text-yellow-500 transition-colors">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
          <span>{item.aliasTitle}</span>
          
          <span className="text-zinc-400 font-medium">
            {/* Logic render thông tin đặc thù dựa trên type */}
            {item.type === 'movie' && item.duration}
            {item.type === 'series' && `${item.episodeCount} tập`}
            {item.type === 'book' && `${item.pageCount} trang`}
            {item.type === 'game' && item.platforms?.[0]}
          </span>
        </div>

        {/* Rating (nếu có) */}
        {item.rating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-white text-xs font-bold">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}