"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Dùng Lucide cho icon đẹp hơn



// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { MediaItem } from '@/src/interfaces/movie';
import MovieCard from './carouselCategoryItem';
import BookCard from './carouselBookItem';

interface MovieRowProps {
  title: string;
  viewAllLink: string;
  movies: MediaItem[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, viewAllLink, movies }) => {
const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="py-4 w-300 overflow-hidden mx-auto ">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 px-4 md:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-black uppercase tracking-tight bg-gradient-to-r from-white via-white to-purple-500 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <Link 
          href={viewAllLink}
          className="text-sm font-bold text-neutral-400 hover:text-purple-400 transition-all flex items-center gap-1 uppercase tracking-widest"
        >
          Xem toàn bộ <ChevronRight size={16} />
        </Link>
      </div>

      {/* Slider Wrapper */}
      <div className="relative px-4 md:px-8 group/row">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          navigation={{
            prevEl,
            nextEl,
          }}
          // Không cần onBeforeInit khi dùng state navigation
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="!overflow-visible"
        >
          {movies.map((item: MediaItem) => (
            <SwiperSlide key={item.id}>
              {item.type === 'book' ? (
                <BookCard book={item} />
              ) : (
                <MovieCard movie={item} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
         ref={(node) => setPrevEl(node)}
          className="absolute -left-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-purple-600 border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
            ref={(node) => setNextEl(node)}
          className="absolute -right-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-purple-600 border border-white/10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;