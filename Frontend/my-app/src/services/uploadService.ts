// Service cho Upload Media API

export interface MediaUploadRequest {
  title: string;
  description?: string;
  language?: string;
  country?: string;
  contentRating?: string;
  releaseDate?: string;
  urlItem?: string;
  typeName: string;
  genres: string[];
  producers?: string;
  director?: string;
  cast?: string[];
  runTimeMinutes?: number;
  releaseYear?: number;
  // Các field khác tùy loại media
  creator?: string;
  productionCompany?: string;
  totalEpisodes?: number;
  totalSeasons?: number;
  author?: string;
  pageCount?: number;
  publisher?: string;
  developer?: string;
  platforms?: string[];
}

export interface MediaUploadItem {
  mediaId: number;
  title: string;
  description?: string;
  imagePath?: string;
  mediaType: string;
  createdDate: string;
}

export interface MediaUploadResponse {
  content: MediaUploadItem[];
  totalElements: number;
  totalPages: number;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
}

// Upload media mới
export async function uploadMedia(
  data: MediaUploadRequest,
  accessToken: string
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`/api/remote/medias`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload media: ${res.statusText}`);
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error uploading media:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload media"
    };
  }
}

// Cập nhật media
export async function updateMedia(
  mediaId: number,
  data: Partial<MediaUploadRequest>,
  accessToken: string
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`/api/remote/medias/${mediaId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update media: ${res.statusText}`);
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating media:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update media"
    };
  }
}

// Xóa media
export async function deleteMedia(
  mediaId: number,
  accessToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/remote/medias/${mediaId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete media: ${res.statusText}`);
    }

    const result = await res.json();
    // Kiểm tra nếu response có success field
    if (result.success === false) {
      return {
        success: false,
        message: result.message || "Không thể xóa media này"
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete media"
    };
  }
}

// Lấy lịch sử upload của user
export async function getUserMediaUploads(accessToken: string): Promise<MediaUploadItem[]> {
  try {
    const res = await fetch(`/api/remote/users/me/media-uploads`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch media uploads: ${res.statusText}`);
    }

    const data: MediaUploadResponse = await res.json();
    
    if (data.content && Array.isArray(data.content)) {
      return data.content;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching media uploads:", error);
    return [];
  }
}

