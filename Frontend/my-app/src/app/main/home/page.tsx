"use client";
import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

const CarouselTop = dynamic(
  () => import("@/src/components/Carousel/carouselTop"),
  { ssr: false }
);

const MovieRow = dynamic(
  () => import("@/src/components/Carousel/carouselCategory"),
  { ssr: false }
);
import { APIMediaItem } from "@/src/interfaces/APIMediaItem";
import { Spin } from 'antd';
import { mediaService } from '@/src/services/getTopFilm';
// Ensure the service path is correct according to your project structure


function HomePage() {
  // 1. State to manage data for each TV Series and Books row
  const [koreanSeries, setKoreanSeries] = useState<APIMediaItem[]>([]);
  const [usukSeries, setUsukSeries] = useState<APIMediaItem[]>([]);
  const [chineseSeries, setChineseSeries] = useState<APIMediaItem[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<APIMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 2. Use getTVSeriesByCountryFE function to filter TV series accurately by country
        // Use Promise.all to call concurrently for performance optimization
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
        console.error("Error loading home page data:", error);
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
      {/* Hero Section: Carousel automatically fetches 5 latest movies */}
      <CarouselTop />

      {/* 3. Container for TV Series rows */}
      <div className="carousel bg-gray-900 w-full max-w-[1400px] mx-auto rounded-xl mt-8 py-6 shadow-2xl">
        <MovieRow 
          title="New Korean TV Series" 
          viewAllLink="/main/media/search?type=series&country=Korea&page=1" 
          data={koreanSeries} 
        />
        
        <MovieRow 
          title="Featured US-UK TV Series" 
          viewAllLink="/main/media/search?type=series&country=USA&page=1" 
          data={usukSeries} 
        />

        <MovieRow 
          title="New Chinese TV Series" 
          viewAllLink="/main/media/search?type=series&country=China&page=1" 
          data={chineseSeries} 
        />
      </div>

      {/* 4. Container for Books row */}
      <div className="max-w-[1400px] mx-auto mt-10">
        <MovieRow 
          title="Trending books" 
          viewAllLink="/main/media/search?type=book&page=1" 
          data={trendingBooks} 
        />
      </div>
    </div>
  );
}

export default HomePage;