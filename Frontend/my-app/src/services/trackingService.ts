// Service cho Tracking API

export type TrackingStatus = "PLANNING" | "WATCHING" | "PAUSED" | "COMPLETED" | "DROPPED";

export interface MediaInfo {
  MediaItemId: number;
  title: string;
  genres: string[];
  description?: string;
  typeName?: string;
  urlItem?: string | null;
  thumbnail?: string;
  contentRating?: string;
  country?: string;
  releaseDate?: string;
  // Các field khác tùy loại media (director, creator, author, etc.)
  [key: string]: unknown;
}

export interface TrackingItem {
  logId: number;
  media: MediaInfo;
  status: TrackingStatus;
  comment?: string;
  rating?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTrackingRequest {
  status: TrackingStatus;
  comment?: string;
  rating?: number;
}

// Lấy danh sách tracking của user
export async function getUserTracking(accessToken: string): Promise<TrackingItem[]> {
  try {
    console.log("Fetching tracking with accessToken:", accessToken ? "Token present" : "No token");
    
    const res = await fetch(`/api/remote/users/me/tracking`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: 'no-store'
    });

    console.log("Tracking API response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Tracking API error response:", errorText);
      throw new Error(`Failed to fetch tracking: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Tracking API response data:", data);
    
    // Xử lý response - API trả về object có property content
    if (data.content && Array.isArray(data.content)) {
      return data.content as TrackingItem[];
    } else if (Array.isArray(data)) {
      return data as TrackingItem[];
    } else if (data.data && Array.isArray(data.data)) {
      return data.data as TrackingItem[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return [];
  }
}

// Tạo tracking mới
export async function createTracking(
  mediaItemId: number,
  data: UpdateTrackingRequest,
  accessToken: string
): Promise<{ success: boolean; message?: string; data?: TrackingItem }> {
  try {
    const res = await fetch(`/api/remote/users/me/tracking`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        mediaItemId,
        ...data
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create tracking: ${res.statusText}`);
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating tracking:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create tracking"
    };
  }
}

// Cập nhật tracking
export async function updateTracking(
  logId: number,
  data: UpdateTrackingRequest,
  accessToken: string
): Promise<{ success: boolean; message?: string; data?: TrackingItem }> {
  try {
    const res = await fetch(`/api/remote/users/me/tracking/${logId}`, {
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
      throw new Error(errorData.message || `Failed to update tracking: ${res.statusText}`);
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating tracking:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update tracking"
    };
  }
}

// Xóa tracking
export async function deleteTracking(
  logId: number,
  accessToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/remote/users/me/tracking/${logId}`, {
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
      throw new Error(errorData.message || `Failed to delete tracking: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting tracking:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete tracking"
    };
  }
}

