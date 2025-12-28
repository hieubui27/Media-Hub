// src/services/mediaService.ts

import { APIMediaItem } from "../interfaces/APIMediaItem";

export interface MediaResponse {
  content: APIMediaItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
}

export const mediaService = {
  getLatestMediaFE: async (): Promise<APIMediaItem[]> => {
    try {
      const response = await fetch(
        `/api/medias/latest`,
        { 
          // THÊM HEADERS Ở ĐÂY
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Header quan trọng để bỏ qua trang div của ngrok
          },
          next: { revalidate: 3600 } 
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      // Lúc này dữ liệu trả về sẽ là JSON chuẩn, không còn là thẻ div nữa
      const data: MediaResponse = await response.json();
      const allItems = data.content;

      const res = allItems
        .filter(item => item.releaseDate)
        .sort((a, b) => {
          const dateA = new Date(a.releaseDate).getTime();
          const dateB = new Date(b.releaseDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      return res; 
    } catch (error) {
      console.error("Error sorting latest media on FE:", error);
      return [];
    }
  },
  getTVSeriesByCountryFE: async (country: string, limit: number = 50): Promise<APIMediaItem[]> => {
    try {
      const response = await fetch(`/api/medias/latest`, {
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Header quan trọng để bỏ qua trang div của ngrok
          },
        next: { revalidate: 3600 }
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data: MediaResponse = await response.json();
      
      // Lọc đồng thời 2 điều kiện: Phải là TV Series VÀ đúng Quốc gia
      return data.content.filter((item: APIMediaItem) => 
        item.typeName === "TV Series" && 
        item.country?.toLowerCase().includes(country.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching TV Series for ${country}:`, error);
      return [];
    }
  },
  getMediaByTypeNameFE: async (typeName: string): Promise<APIMediaItem[]> => {
    try {
      const response = await fetch(`/api/medias/latest`, {
         headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Header quan trọng để bỏ qua trang div của ngrok
          },
        next: { revalidate: 3600 }
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data: MediaResponse = await response.json();
      
      return data.content.filter(
        (item: APIMediaItem) => item.typeName === typeName
      );
    } catch (error) {
      console.error(`Error fetching media for type ${typeName}:`, error);
      return [];
    }
  }
};