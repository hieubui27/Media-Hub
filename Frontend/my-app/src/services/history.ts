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

export const getHistory = async (): Promise<HistoryResponse> => {
  const response = await fetch(`/api/history/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};

export const addToHistory = async (mediaId: string) => {
  const response = await fetch(`/api/history/${mediaId}/view`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to add to history");
  return response.json();
};

export const removeFromHistory = async (id: number) => {
  const response = await fetch(`/api/history/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to remove from history");
  return response.json();
};

// BỔ SUNG: API xóa toàn bộ lịch sử
export const clearHistory = async () => {
  const response = await fetch(`/api/history/all`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to clear history");
  return response.json();
};