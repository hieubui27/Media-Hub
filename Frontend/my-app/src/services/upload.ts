const API_BASE_URL = "/api";

const getAuthHeaders = (isMultipart = false): HeadersInit => {
  if (typeof window === "undefined") return {};
  const userStr = localStorage.getItem("user");
  const token = userStr ? JSON.parse(userStr).accessToken : "";
  const headers: HeadersInit = {
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// --- MEDIA ITEM ---

// Bước 1: Tạo thông tin Media
export const createMediaItem = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/medias`, {
    method: "POST",
    headers: getAuthHeaders(), // JSON default
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create media item");
  }
  return response.json(); // Trả về object chứa ID (ví dụ: { id: 123, ... })
};

// Bước 2: Upload ảnh cho Media (Dùng ID từ bước 1)
export const uploadMediaImage = async (mediaId: string | number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/medias/${mediaId}/image`, {
    method: "POST",
    headers: getAuthHeaders(true), // isMultipart = true để không set Content-Type JSON
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload media image");
  return response.json();
};

export const deleteMediaImage = async (mediaId: string | number) => {
  const response = await fetch(`${API_BASE_URL}/medias/${mediaId}/image`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete media image");
  return response.ok;
};


// --- USER AVATAR ---

export const uploadUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload avatar");
  return response.json();
};

export const deleteUserAvatar = async () => {
  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete avatar");
  return response.ok;
};
