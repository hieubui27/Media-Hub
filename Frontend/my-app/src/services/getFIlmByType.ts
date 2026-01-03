// src/services/getFIlmByType.ts
import { MediaResponse } from "../interfaces/APIResponse";

const SLUG_TO_API_TYPE: Record<string, string> = {
  "series": "TV Series",
  "game": "Video Game",
  "movie": "Movie",
  "book": "Book",
  "music": "Music"
};

export async function fetchMediaItems(
  typeSlug: string, 
  page: number = 1, // SỬA: Mặc định là trang 1
  genre?: string, 
  country?: string
): Promise<MediaResponse | null> {
  try {
    const apiType = SLUG_TO_API_TYPE[typeSlug] || typeSlug;
    
    const params = new URLSearchParams();
    params.set("page", (page).toString()); // Gửi 0 cho trang 1, 1 cho trang 2...


    if (apiType !== "all") {
        params.set("typeName", apiType);
    }
    if (genre && genre !== "Tất cả") params.set("genre", genre);
    if (country && country !== "Tất cả") params.set("country", country);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/medias?${params.toString()}`;
    
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}