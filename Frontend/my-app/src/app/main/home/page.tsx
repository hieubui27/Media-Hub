"use client";
import React, { useEffect, useState } from 'react';
import MovieRow from "@/src/components/Carousel/carouselCategory";
import CarouselTop from "@/src/components/Carousel/carouselTop";
import { APIMediaItem } from "@/src/interfaces/APIMediaItem";
import { Spin } from 'antd';
import { mediaService } from '@/src/services/getTopFilm';
// Đảm bảo đường dẫn service chính xác theo cấu trúc dự án của bạn


function HomePage() {
  // 1. State quản lý dữ liệu cho từng hàng TV Series và Books
  const [koreanSeries, setKoreanSeries] = useState<APIMediaItem[]>([]);
  const [usukSeries, setUsukSeries] = useState<APIMediaItem[]>([]);
  const [chineseSeries, setChineseSeries] = useState<APIMediaItem[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<APIMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 2. Sử dụng hàm getTVSeriesByCountryFE để lọc chính xác phim bộ theo nước
        // Sử dụng Promise.all để gọi đồng thời giúp tối ưu hiệu năng
        const [kr, usuk, cn, books] = await Promise.all([
          mediaService.getTVSeriesByCountryFE('Korea'),
          mediaService.getTVSeriesByCountryFE('USA'),
          mediaService.getTVSeriesByCountryFE('China'),
          mediaService.getMediaByTypeNameFE('Book') 
        ]);

        setKoreanSeries(kr);
        setUsukSeries(usuk);
        setChineseSeries(cn);
        setTrendingBooks(books);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-800">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen pb-10">
      {/* Hero Section: Carousel tự fetch 5 phim mới nhất */}
      <CarouselTop />

      {/* 3. Container cho các hàng Phim Bộ (TV Series) */}
      <div className="carousel bg-gray-900 w-full max-w-[1400px] mx-auto rounded-xl mt-8 py-6 shadow-2xl">
        <MovieRow 
          title="Phim bộ Hàn Quốc mới" 
          viewAllLink="/danh-muc/tv-series-korea" 
          data={koreanSeries} 
        />
        
        <MovieRow 
          title="Phim bộ US-UK đặc sắc" 
          viewAllLink="/danh-muc/tv-series-us-uk" 
          data={usukSeries} 
        />

        <MovieRow 
          title="Phim bộ Trung Quốc mới" 
          viewAllLink="/danh-muc/tv-series-china" 
          data={chineseSeries} 
        />
      </div>

      {/* 4. Container cho hàng Sách (Books) */}
      <div className="max-w-[1400px] mx-auto mt-10">
        <MovieRow 
          title="Trending books" 
          viewAllLink="/danh-muc/book" 
          data={trendingBooks} 
        />
      </div>
    </div>
  );
}

export default HomePage;