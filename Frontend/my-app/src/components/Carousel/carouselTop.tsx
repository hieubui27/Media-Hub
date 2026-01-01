"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Carousel, Spin } from 'antd';
import { PlayCircleFilled, HeartOutlined, InfoCircleOutlined, HeartFilled } from '@ant-design/icons';
import { CarouselRef } from 'antd/es/carousel';
import Link from 'next/link';
import { APIMediaItem } from '@/src/interfaces/APIMediaItem';
import { mediaService } from '@/src/services/getTopFilm';

// Import service và interface


function CarouselTop() {
  const carouselRef = useRef<CarouselRef>(null);
  const [movies, setMovies] = useState<APIMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  const PLACEHOLDER_IMAGE = "https://placehold.co/1920x1080/0a0a0a/ffffff?text=No+Poster";

  useEffect(() => {
    const loadLatestMovies = async () => {
      setLoading(true);
      // GỌI SERVICE: Lấy 5 phim mới nhất đã được sort từ FE
      const res = await mediaService.getLatestMediaFE();
      setMovies(res);
      setLoading(false);
    };

    loadLatestMovies();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="h-[400px] md:h-[650px] flex items-center justify-center bg-black">
      <Spin size="large" tip="Đang cập nhật phim mới nhất..." />
    </div>
  );

  if (movies.length === 0) return null;

  return (
    <div className="relative w-full bg-black overflow-hidden">
      <Carousel autoplay effect="fade" ref={carouselRef} dots={false} speed={800}>
        {movies.map((movie) => {
          const isFavorited = favorites.includes(movie.MediaItemId);
          const year = new Date(movie.releaseDate).getFullYear();
          const image = movie.urlItem || PLACEHOLDER_IMAGE;

          return (
            <div key={movie.MediaItemId} className="relative h-[500px] md:h-[650px] w-full group outline-none">
              {/* LỚP 1: NỀN BLUR */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-[80px] scale-125 opacity-60"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="absolute inset-0 z-10 
                  shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] 
                  bg-gradient-to-b from-black/60 via-transparent to-black 
                  bg-gradient-to-r from-black/80 via-transparent to-black/80">
                </div>
              </div>

              {/* LỚP 2: NỘI DUNG CHÍNH */}
              <div className="relative z-20 h-full max-w-7xl mx-auto flex items-center px-4 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                  
                  {/* Text Content */}
                  <div className="md:col-span-7 lg:col-span-8 text-white space-y-4 md:space-y-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      <h1 className="text-3xl md:text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-2xl line-clamp-2">
                        {movie.title}
                      </h1>
                      <div className="flex items-center gap-3 md:gap-4">
                        <h2 className="text-lg md:text-2xl font-bold text-violet-500 uppercase tracking-[0.2em]">
                          {movie.typeName}
                        </h2>
                        <span className="bg-violet-600 text-white text-[10px] md:text-xs px-2 py-1 rounded-sm font-black animate-pulse">NEW RELEASE</span>
                      </div>

                      {/* Info tags */}
                      <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6 items-center text-xs md:text-sm">
                        <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase">
                          {movie.contentRating || 'PG'}
                        </span>
                        <span className="border border-white/40 px-2 py-0.5 rounded bg-white/10 backdrop-blur-md">4K QUALITY</span>
                        <span className="text-gray-300 font-semibold">{year}</span>
                        <span className="text-white/20 hidden md:inline">|</span>
                        <span className="text-gray-300 hidden md:inline">{movie.genres?.join(" • ")}</span>
                      </div>

                      <p className="text-gray-300 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-3 mb-6 md:mb-8 leading-relaxed">
                        {movie.description}
                      </p>

                      <div className="flex gap-3 md:gap-4 items-center">
                        <Link href={`/main/media/detail/${movie.MediaItemId}`}>
                          <button className="flex items-center gap-2 md:gap-3 bg-violet-500 hover:bg-violet-400 text-black px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-black transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 text-sm md:text-base">
                            <PlayCircleFilled className="text-xl md:text-2xl" /> Tracking
                          </button>
                        </Link>


                        <Link href={`/main/media/detail/${movie.MediaItemId}`}>
                          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all text-white">
                            <InfoCircleOutlined className="text-lg md:text-xl" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Poster Image */}
                  <div className="hidden md:block md:col-span-5 lg:col-span-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                       <img 
                          src={image} 
                          alt={movie.title} 
                          className="w-full h-[350px] lg:h-[450px] object-cover" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Thumbnail Nav sử dụng urlItem */}
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 z-30 flex gap-2 md:gap-3 max-w-[40%] md:max-w-none overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {movies.map((m, idx) => (
                  <div
                    key={m.MediaItemId}
                    onClick={() => carouselRef.current?.goTo(idx)}
                    className={`shrink-0 w-14 h-9 md:w-20 md:h-12 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl ${
                      m.MediaItemId === movie.MediaItemId ? 'border-violet-500 scale-110' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={m.urlItem || PLACEHOLDER_IMAGE} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default CarouselTop;