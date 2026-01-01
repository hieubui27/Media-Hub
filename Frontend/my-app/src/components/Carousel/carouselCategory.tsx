"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import MediaCard from './carouselCategoryItem'; 
import BookCard from './carouselBookItem';
import { APIMediaItem } from '@/src/interfaces/APIMediaItem'; // Đảm bảo import đúng interface mới

interface MovieRowProps {
  title: string;
  viewAllLink: string;
  data: APIMediaItem[]; 
}

const MovieRow: React.FC<MovieRowProps> = ({ title, viewAllLink, data }) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="py-4 w-full overflow-hidden mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 px-4 md:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-base md:text-xl lg:text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-white to-violet-500 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <Link 
          href={viewAllLink}
          className="text-xs md:text-sm font-bold text-neutral-400 hover:text-violet-400 transition-all flex items-center gap-1 uppercase tracking-widest whitespace-nowrap"
        >
          Xem toàn bộ <ChevronRight size={14} className="md:w-4 md:h-4" />
        </Link>
      </div>

      {/* Slider Wrapper */}
      <div className="relative px-4 md:px-8 group/row">
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={2.2}
          navigation={{
            prevEl,
            nextEl,
          }}
          breakpoints={{
            480: { slidesPerView: 2.5, spaceBetween: 14 },
            640: { slidesPerView: 3.2, spaceBetween: 16 },
            768: { slidesPerView: 4.2 },
            1024: { slidesPerView: 5.2 },
            1280: { slidesPerView: 6.2 },
            1536: { slidesPerView: 7.2 },
          }}
          className="!overflow-visible"
        >
          {data?.map((item) => (
            /* 1. Sửa key thành MediaItemId để khớp API mới */
            <SwiperSlide key={item.MediaItemId}>
              {/* 2. Kiểm tra typeName thay vì type */}
              {item.typeName === 'Book' ? (
                <BookCard media={item} />
              ) : (
                /* TV Series và Movie sẽ dùng chung MediaCard vì đã xử lý badge bên trong */
                <MediaCard media={item} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          ref={(node) => setPrevEl(node)}
          className="absolute -left-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-violet-600 border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          ref={(node) => setNextEl(node)}
          className="absolute -right-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-violet-600 border border-white/10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;