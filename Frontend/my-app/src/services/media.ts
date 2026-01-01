// src/services/media.ts
import { MyUploadsResponse } from "../interfaces/uploadHistory";

const API_BASE_URL = "/api";

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

export const getMyUploads = async (page = 0, limit = 10): Promise<MyUploadsResponse> => {
  const response = await fetch(`${API_BASE_URL}/medias/me?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my uploads");
  }
  return response.json();
};

export const deleteMediaItem = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/medias/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete media item");
  }
  return response.ok;
};
