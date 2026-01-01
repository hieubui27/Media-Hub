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
import { MediaResponse, MediaItem } from "../interfaces/APIResponse"; 

const API_TYPE_MAP: Record<string, string> = {
  "movie": "Movie",
  "series": "TV Series",
  "game": "Video Game",
  "book": "Book",
  "music": "Music"
};

export async function fetchMediaItems(
  type: string, 
  page: number = 1, 
  genre?: string, 
  country?: string
): Promise<MediaResponse | null> {
  const params = new URLSearchParams({
  });

  if (type !== "all") params.set("typeName", API_TYPE_MAP[type.toLowerCase()] || type);
  if (genre && genre !== "Tất cả") params.set("genre", genre);
  if (country && country !== "Tất cả") params.set("country", country);

  try {
    const url = `https://c352006629c5.ngrok-free.app/api/medias?${params.toString()}`;
    console.log("Fetching media items from:", url);
    
    const res = await fetch(url, {
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      cache: 'no-store'
    });

    console.log("Response status:", res.status, res.statusText);

    if (!res.ok) {
      console.error("API response not OK:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    console.log("API response data:", data);
    console.log("Content type:", typeof data.content, "Is array:", Array.isArray(data.content));
    console.log("Content length:", data.content?.length);

    // Kiểm tra và xử lý trường hợp data hoặc data.content không tồn tại
    if (!data) {
      console.error("No data returned from API");
      return null;
    }
    
    // Đảm bảo content là một array
    if (!data.content || !Array.isArray(data.content)) {
      console.warn("Content is not an array, returning empty array");
      return {
        ...data,
        content: [],
        totalElements: data.totalElements || 0
      };
    }

    // Sửa lỗi URL ảnh không hợp lệ (như "url_movie_test_1")
    data.content = data.content.map((item: MediaItem) => ({
      ...item,
      urlItem: (item.urlItem && (item.urlItem.startsWith('http') || item.urlItem.startsWith('/'))) 
                ? item.urlItem 
                : "/images.png" // Ảnh dự phòng
    }));

    console.log("Returning data with", data.content.length, "items");
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
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