import { ReviewData } from "../interfaces/Review";

interface ApiResponse {
    content: MediaItem[];
    totalElements: number;
    // ... các trường khác từ API của bạn
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Fetch danh sách media dựa trên loại (movie, book, game...)
 */
export const getMediaByType = async (type: string): Promise<MediaItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/media/type/${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Cache dữ liệu trong 60 giây (ISR)
            next: { revalidate: 60 } 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch media type: ${type}`);
        }

        const data: ApiResponse = await response.json();
        return data.content || [];
    } catch (error) {
        console.error("Error in getMediaByType:", error);
        return [];
    }
};

// src/services/mediaService.ts
export async function getReviewsByMediaId(id: string): Promise<ReviewData[]> {
  const res = await fetch(`/api/remote/medias/${id}/reviews`, { cache: 'no-store',
    headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Header quan trọng để bỏ qua trang div của ngrok
          },
   });
  return res.json();
}

// Hàm lấy rating (giả định endpoint của bạn)
interface RatingItem {
  ratingValue: number;
  userId: number;
  userName: string;
  // các trường khác nếu cần
}

export async function getMediaRating(id: string): Promise<number> {
  const res = await fetch(`/api/remote/medias/${id}/ratings`, { 
    cache: 'no-store',
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  
  const data: RatingItem[] = await res.json(); // Ép kiểu mảng
  
  if (Array.isArray(data) && data.length > 0) {
    // Tính tổng giá trị rating
    const sum = data.reduce((acc: number, item: RatingItem) => acc + (item.ratingValue || 0), 0);
    
    // Tính trung bình cộng: $\text{Average} = \frac{\sum \text{ratingValue}}{n}$
    const average = sum / data.length;
    return Number(average.toFixed(1)); 
  }
  
  return 0;
}

// Hàm tạo/cập nhật rating với bearer token
export async function createRating(
  mediaId: string | number, 
  ratingValue: number, 
  accessToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/remote/medias/${mediaId}/ratings`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        ratingValue: ratingValue
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create rating: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating rating:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create rating" 
    };
  }
}

// src/services/mediaService.ts
// src/services/mediaService.ts
import { MediaItem, MediaResponse } from "../interfaces/APIResponse";

const API_TYPE_MAP: Record<string, string> = {
  "movie": "Movie",
  "tv series": "TV Series",
  "series": "TV Series",
  "video game": "Video Game",
  "game": "Video Game",
  "book": "Book",
  "music": "Music"
};

export async function searchMediaItems(
  keyword: string = "",
  typeSlug: string = "all",
  genre: string = "All",
  country: string = "All",
  page: number = 1
): Promise<MediaResponse | null> {
  try {
    const params = new URLSearchParams();

    // 1. Xử lý Pagination
    params.set("page", (page).toString());

    // 2. Xử lý Từ khóa tìm kiếm
    if (keyword) {
        params.set("title", keyword);
    }

    // 3. Xử lý Type (Loại)
    const apiType = API_TYPE_MAP[typeSlug.toLowerCase()] || typeSlug;
    if (apiType && apiType.toLowerCase() !== "all") {
        params.set("typeName", apiType);
    }

    // 4. Xử lý Genre & Country
    if (genre && genre !== "All") params.set("genre", genre);
    if (country && country !== "All") params.set("country", country);

    // Endpoint gọi API
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/medias?${params.toString()}`;
    console.log("Fetching Search & Filter URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Search API Error:", error);
    return null;
  }
}


export async function createReview(mediaId: string, content: string, token: string) {
  const res = await fetch(`/api/remote/medias/${mediaId}/reviews`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function updateReview(mediaId: string, reviewId: number, content: string, token: string) {
  const res = await fetch(`/api/remote/medias/${mediaId}/reviews/${reviewId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function deleteReview(mediaId: string, reviewId: number, token: string) {
  const res = await fetch(`/api/remote/medias/${mediaId}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  return res.ok;
}


