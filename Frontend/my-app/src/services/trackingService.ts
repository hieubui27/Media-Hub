// Service cho Tracking API

export type TrackingStatus = "PLAN_TO_WATCH" | "WATCHING"| "COMPLETED";

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
export interface TrackingResponse {
  content: TrackingItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface UpdateTrackingRequest {
  status: TrackingStatus;
  comment?: string;
  rating?: number;
}

// Cập nhật hàm getUserTracking để nhận tham số phân trang
export async function getUserTracking(
  accessToken: string, 
  type?: string,
  page: number = 0
): Promise<TrackingResponse | null> {
  try {
    // Xây dựng URL với các tham số query
    const params = new URLSearchParams();
    if (type && type !== "all") {
      params.append("type", type);
    }
    params.append("page", page.toString());
    

    const url = `/api/remote/users/me/tracking?${params.toString()}`;
    

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`Failed to fetch tracking: ${res.statusText}`);
    console.log("Fetching Tracking URL:", url);
    const data = await res.json();
    return data as TrackingResponse;
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return null;
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

