// src/services/mediaService.ts
import { MediaResponse } from "../interfaces/APIResponse";

// Bản map ngược để gửi giá trị đúng lên API (ví dụ: series -> TV Series)
const SLUG_TO_API_TYPE: Record<string, string> = {
  "series": "TV Series",
  "game": "Video Game",
  "movie": "Movie",
  "book": "Book",
  "music": "Music"
};

export async function fetchMediaItems(
  typeSlug: string, 
  page: number = 0, 
  genre?: string, 
  country?: string
): Promise<MediaResponse | null> {
  try {
    const apiType = SLUG_TO_API_TYPE[typeSlug] || typeSlug;
    const params = new URLSearchParams({
      page: page.toString(),
      size: "20", // Số lượng item mỗi trang
      typeName: apiType === "all" ? "" : apiType,
    });

    if (genre && genre !== "Tất cả") params.set("genre", genre);
    if (country && country !== "Tất cả") params.set("country", country);

    // Thay đổi URL theo endpoint thực tế của bạn
    const response = await fetch(`https://8dcbf8a962a3.ngrok-free.app/api/medias?typeName=${apiType}`, {
      cache: "no-store", // Đảm bảo luôn lấy dữ liệu mới nhất
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}