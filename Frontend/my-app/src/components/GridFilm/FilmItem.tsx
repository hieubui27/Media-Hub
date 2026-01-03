"use client";
import Link from "next/link";
import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";

export default function MediaCard({ item }: { item: MediaItemDetail }) {
  // 1. Khai báo BASE_URL và ảnh Placeholder
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "YOUR_NGROK_URL_HERE";
  const PLACEHOLDER_IMAGE = "https://placehold.co/400x600/0a0a0a/ffffff?text=No+Image";

  // 2. Hàm xử lý link ảnh
  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return PLACEHOLDER_IMAGE;
    // Nếu link đã là http/https thì giữ nguyên
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    // Nếu là đường dẫn tương đối thì nối thêm BASE_URL
    return `${BASE_URL}${url}`;
  };

  // 3. Lấy link ảnh cuối cùng
  const imageSource = getImageUrl(item.urlItem);

  return (
    <Link 
      href={`/main/media/detail/${item.MediaItemId}`}
      className="group block bg-[#1a1a1a] rounded-2xl overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all duration-300 shadow-lg"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={imageSource} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Display Media type tag in corner (Optional) */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase">
          {item.type}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate group-hover:text-violet-500 transition-colors">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
          <span>{item.aliasTitle}</span>
          
          <span className="text-zinc-400 font-medium">
            {/* Logic to render specific information based on type */}
            {item.type === 'movie' && item.duration}
            {item.type === 'series' && `${item.episodeCount} eps`}
            {item.type === 'book' && `${item.pageCount} pages`}
            {item.type === 'game' && item.platforms?.[0]}
          </span>
        </div>

        {/* Rating (if available) */}
        {item.rating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-violet-500 text-xs">★</span>
            <span className="text-white text-xs font-bold">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}