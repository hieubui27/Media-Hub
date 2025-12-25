import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MediaItem } from '@/src/interfaces/movie';

interface MovieCardProps {
  movie: MediaItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail Container */}
      <Link 
        href={`/phim/${movie.slug}`} 
        className="relative aspect-video overflow-hidden rounded-xl bg-neutral-900 border border-white/5"
      >
        {/* Badge - Số tập (Chỉ hiện nếu là phim bộ hoặc có tập) */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          <div className="flex items-center gap-1 bg-purple-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-lg">
            <span>TẬP</span>
            <strong>{movie.episodeCount}</strong>
          </div>
        </div>

        {/* Image - Sử dụng Next.js Image để tối ưu tốc độ tải */}
        <Image
          src={movie.thumbnail}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        
        {/* Overlay hover - Làm mờ nhẹ khi di chuột vào */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="line-clamp-1 text-sm font-bold text-white hover:text-purple-400 transition-colors">
          <Link href={`/phim/${movie.slug}`} title={movie.title}>
            {movie.title}
          </Link>
        </h4>
        <p className="line-clamp-1 text-xs text-neutral-500 font-medium italic">
          {movie.aliasTitle}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;