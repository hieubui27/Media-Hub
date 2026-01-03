// src/services/adminService.ts

const API_BASE_URL = "/api/proxy"; 

/**
 * Lấy Header chứa Token xác thực từ localStorage
 * Đảm bảo đồng bộ với UserContext
 */
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  if (typeof window !== "undefined") {
    // Sử dụng localStorage để khớp với UserContext
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.accessToken) {
        headers["Authorization"] = `Bearer ${parsedUser.accessToken}`;
      }
    }
  }
  return headers;
};

// --- Interfaces ---

export interface PaginationParams {
  page: number;
  limit: number;
  [key: string]: any;
}

export interface ApiResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; 
  size: number;
}

export interface MediaItem {
  id: number;
  title: string;
  typeName: string;
  status: "ACTIVE" | "INACTIVE";
  urlImage?: string;
  createdAt?: string;
  description?: string;
  createdBy?: string;
}

export interface RatingItem {
  id: number;
  mediaTitle: string;
  userName: string;
  rating: number; 
  createdAt: string;
}

export interface ReviewItem {
  id: number;
  mediaTitle: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TrackingItem {
  id: number;
  mediaTitle: string;
  mediaType: string;
  userName: string;
  status: "WATCHING" | "WATCHED" | "PLAN_TO_WATCH";
  rating?: number;
  comment?: string;
  createdAt: string;
}

export interface UserItem {
  id: number;
  username: string; 
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  avatar?: string;
  createdAt: string;
}

export interface HistoryItem {
  id: number;
  userName: string;
  mediaTitle: string;
  viewedAt: string;
}

// --- API Calls ---

// 1. QUẢN LÝ MEDIA
export const getAdminMedias = async (params: PaginationParams) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...params,
  });
  const res = await fetch(`${API_BASE_URL}/admin/medias?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const deleteMedia = async (id: number) => {
  return fetch(`${API_BASE_URL}/medias/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const updateMedia = async (id: number, data: any) => {
  return fetch(`${API_BASE_URL}/medias/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

// 2. QUẢN LÝ RATING
export const getAdminRatings = async (params: PaginationParams) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });
  const res = await fetch(`${API_BASE_URL}/admin/ratings?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const deleteRating = async (id: number) => {
  return fetch(`${API_BASE_URL}/ratings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

// 3. QUẢN LÝ REVIEW
export const getAdminReviews = async (params: PaginationParams) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...params,
  });
  const res = await fetch(`${API_BASE_URL}/admin/reviews?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const deleteReview = async (id: number) => {
  return fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

// 4. QUẢN LÝ TRACKING
export const getAdminTracking = async (params: PaginationParams) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...params,
  });
  const res = await fetch(`${API_BASE_URL}/admin/tracking?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const deleteTracking = async (id: number) => {
  return fetch(`${API_BASE_URL}/tracking/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

// 5. QUẢN LÝ USER (TRẠNG THÁI & QUYỀN HẠN)
export const getAdminUsers = async (params: PaginationParams) => {
  const res = await fetch(`/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return res.json();
};

// Khóa hoặc mở khóa tài khoản
export const toggleUserStatus = async (id: number) => {
  return fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

// Nâng quyền hoặc hạ quyền (Promote/Demote)
export const promoteUser = async (id: number) => {
  return fetch(`/admin/users/${id}/promote`, {
    method: "PUT", // Hoặc "PUT" tùy theo Backend của bạn
    headers: getAuthHeaders(),
  });
};

// Hạ quyền xuống USER
export const demoteUser = async (id: number) => {
  return fetch(`/admin/users/${id}/demote`, {
    method: "PUT", // Hoặc "PUT" tùy theo Backend của bạn
    headers: getAuthHeaders(),
  });
};

// 6. LỊCH SỬ HỆ THỐNG
export const getAdminHistory = async (params: PaginationParams) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });
  const res = await fetch(`${API_BASE_URL}/admin/history?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

// 7. QUẢN LÝ HÌNH ẢNH
export const resetUserAvatar = async (userId: number) => {
  return fetch(`${API_BASE_URL}/admin/users/${userId}/avatar`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const updateMediaImage = async (mediaId: number, imageUrl: string) => {
  return fetch(`${API_BASE_URL}/medias/${mediaId}/image`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ urlImage: imageUrl }),
  });
};