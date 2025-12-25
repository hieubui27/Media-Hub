import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MediaItem } from '@/src/interfaces/movie'; // Import interface chuẩn

interface BookCardProps {
  book: MediaItem; // Thay any bằng MediaItem
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="group flex flex-col gap-3">
      {/* Container bìa sách - Tỉ lệ 3/4 chuyên cho Sách */}
      <Link 
        href={`/book/${book.slug}`} 
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-900 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-purple-500/30"
      >
        {/* Hiệu ứng gáy sách: Tạo độ sâu cho bìa */}
        <div className="absolute left-0 top-0 z-10 h-full w-1.5 bg-gradient-to-r from-black/50 to-transparent" />
        
        {/* Sử dụng Next.js Image để tối ưu performance */}
        <Image
          src={book.thumbnail}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-cover"
          loading="lazy"
        />
        
        {/* Badge số chương - Tùy biến riêng cho Sách */}
        <div className="absolute bottom-2 right-2 z-10 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-tighter">
          {book.episodeCount} Chương
        </div>
      </Link>

      {/* Thông tin sách */}
      <div className="flex flex-col gap-0.5 px-1">
        <h4 className="line-clamp-1 text-[14px] font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">
          <Link href={`/book/${book.slug}`}>
            {book.title}
          </Link>
        </h4>
        <p className="line-clamp-1 text-[11px] text-neutral-500 font-medium italic">
          {book.aliasTitle} {/* Đối với sách, đây thường là tên tác giả */}
        </p>
      </div>
    </div>
  );
};

export default BookCard;