"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APIMediaItem } from '@/src/interfaces/APIMediaItem';

interface MediaCardProps {
  media: APIMediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  // 1. Kiểm tra an toàn dữ liệu đầu vào để tránh crash trang
  if (!media) return <div className="aspect-[3/4] md:aspect-video bg-neutral-900 animate-pulse rounded-xl" />;

  // 2. Logic hiển thị Badge đặc thù cho TV Series và các loại khác
  const renderBadge = () => {
    switch (media.typeName) {
      case 'TV Series':
        return (
          <div className="flex flex-col gap-1">
            <div className="bg-purple-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-lg">
              {media.totalEpisodes || 0} TẬP
            </div>
            {/* Hiển thị số mùa nếu có */}
            {media.totalSeasons && media.totalSeasons > 1 && (
              <div className="bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-medium text-gray-200">
                {media.totalSeasons} MÙA
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // 3. Xác định subtitle linh hoạt dựa trên loại nội dung
  const getSubtitle = () => {
    if (media.typeName === 'TV Series') return media.creator || media.productionCompany;
    return '';
  };

  // 4. Đường dẫn chi tiết sử dụng MediaItemId
  const detailUrl = `/main/media/detail/${media.MediaItemId}`;
  
  // Ảnh placeholder nếu urlItem trả về null từ API
  const imageSource = media.urlItem || "https://placehold.co/400x600/0a0a0a/ffffff?text=No+Image";

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail Container */}
      <Link 
        href={detailUrl} 
        className="relative aspect-[3/4] md:aspect-video overflow-hidden rounded-xl bg-neutral-900 border border-white/5"
      >
        {/* Badge góc trái: Số tập/Thời lượng */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {renderBadge()}
        </div>

        {/* Badge góc phải: Content Rating (PG, M, E...) */}
        <div className="absolute right-2 top-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 border border-yellow-400/20">
          {media.contentRating || 'NR'}
        </div>

        <Image
          src={imageSource}
          alt={media.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        
        {/* Overlay Hover hiệu ứng Play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
             </div>
        </div>
      </Link>

      {/* Thông tin văn bản */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
          <Link href={detailUrl} title={media.title}>
            {media.title}
          </Link>
        </h4>
        <p className="line-clamp-1 text-xs text-neutral-500 font-medium italic">
          {getSubtitle()}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;