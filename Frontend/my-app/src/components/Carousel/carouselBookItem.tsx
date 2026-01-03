"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APIMediaItem } from '@/src/interfaces/APIMediaItem';

interface BookCardProps {
  media: APIMediaItem;
}

const BookCard: React.FC<BookCardProps> = ({ media }) => {
  // 1. Kiểm tra an toàn dữ liệu
  if (!media) return <div className="aspect-[3/4] bg-neutral-900 animate-pulse rounded-md" />;

  // 2. Xác định loại nội dung dựa trên typeName của API
  const isBook = media.typeName === 'Book';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "YOUR_NGROK_URL_HERE";
  const PLACEHOLDER_IMAGE = "https://placehold.co/400x600/0a0a0a/ffffff?text=No+Image";

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    return `${BASE_URL}${url}`;
  };
  const authorName = media.author || "Khuyết danh";
  
  // Hiển thị số trang nếu có
  const quantityLabel = isBook && media.pageCount && media.pageCount > 0 
    ? `${media.pageCount} Trang` 
    : "";

  // 4. Đường dẫn chi tiết sử dụng MediaItemId theo cấu trúc thư mục của bạn
  const detailUrl = `/main/media/detail/${media.MediaItemId}`;
  
  // Placeholder nếu urlItem bị null từ API

  return (
    <div className="group flex flex-col gap-3">
      {/* Container bìa sách - Tỉ lệ 3/4 đứng */}
      <Link 
        href={detailUrl} 
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-900 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-violet-500/30 border border-white/5"
      >
        {/* Hiệu ứng gáy sách tạo độ sâu */}
        <div className="absolute left-0 top-0 z-10 h-full w-2 bg-gradient-to-r from-black/60 to-transparent opacity-80" />
        
        <Image
          src={getImageUrl(media.urlItem)}
          alt={media.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badge hiển thị số trang */}
        {quantityLabel && (
          <div className="absolute bottom-2 right-2 z-10 bg-violet-600/90 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-tighter shadow-lg">
            {quantityLabel}
          </div>
        )}

        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Thông tin sách */}
      <div className="flex flex-col gap-0.5 px-1">
        <h4 className="line-clamp-1 text-[14px] font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">
          <Link href={detailUrl} title={media.title}>
            {media.title}
          </Link>
        </h4>
        <p className="line-clamp-1 text-[11px] text-neutral-500 font-medium italic">
          {authorName}
        </p>
        
        {/* Hiển thị Content Rating thay cho rating nếu API không trả về điểm số */}
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-violet-400 text-[10px] font-bold border border-violet-400/30 px-1 rounded">
            {media.contentRating || 'G'}
          </span>
          <span className="text-neutral-500 text-[10px]">•</span>
          <span className="text-neutral-500 text-[10px]">{media.country}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;