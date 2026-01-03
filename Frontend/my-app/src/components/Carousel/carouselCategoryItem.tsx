"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APIMediaItem } from '@/src/interfaces/APIMediaItem';

interface MediaCardProps {
  media: APIMediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  // 1. KHAI BÁO BIẾN & HÀM XỬ LÝ ẢNH TRƯỚC
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "YOUR_NGROK_URL_HERE";
  const PLACEHOLDER_IMAGE = "https://placehold.co/400x600/0a0a0a/ffffff?text=No+Image";

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    return `${BASE_URL}${url}`;
  };

  // 2. Kiểm tra an toàn dữ liệu
  if (!media) return <div className="aspect-[3/4] md:aspect-video bg-neutral-900 animate-pulse rounded-xl" />;

  // 3. Sử dụng hàm để lấy link ảnh cuối cùng
  const imageSource = getImageUrl(media.urlItem);

  // 4. Logic hiển thị Badge
  const renderBadge = () => {
    switch (media.typeName) {
      case 'TV Series':
        return (
          <div className="flex flex-col gap-1">
            <div className="bg-violet-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-lg">
              {media.totalEpisodes || 0} TẬP
            </div>
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

  const getSubtitle = () => {
    if (media.typeName === 'TV Series') return media.creator || media.productionCompany;
    return '';
  };

  const detailUrl = `/main/media/detail/${media.MediaItemId}`;

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

        {/* Badge góc phải: Content Rating */}
        <div className="absolute right-2 top-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-violet-400 border border-violet-400/20">
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
             <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
             </div>
        </div>
      </Link>

      {/* Thông tin văn bản */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="line-clamp-1 text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
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