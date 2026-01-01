// services/history.ts
import { HistoryItem, HistoryResponse } from "../interfaces/history";

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  
  const userStr = localStorage.getItem("user");
  const token = userStr ? JSON.parse(userStr).accessToken : "";
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
};

// Lấy lịch sử xem 
export const getHistory = async (): Promise<HistoryResponse> => {
  const response = await fetch(`/api/history/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error("Failed to fetch history");
  
  const result = await response.json(); // Đọc JSON 1 lần duy nhất
  console.log("Fetch history response:", result);
  return result; 
};
// Thêm vào lịch sử khi xem chi tiết 
export const addToHistory = async (mediaId: string) => {
  // Sử dụng path tương đối sau khi đã cấu hình rewrite ở next.config.js
  const response = await fetch(`/api/history/${mediaId}/view`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to add to history");
  return response.json();
};

// Xóa 1 item hoặc xóa tất cả 
export const removeFromHistory = async (id: number) => {
  const response = await fetch(`/api/history/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to remove from history");
  return response.json();
};