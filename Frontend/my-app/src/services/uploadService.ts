export interface MediaUploadItem {
  mediaId: number;
  title: string;
  description?: string;
  imagePath?: string;
  mediaType: string;
  createdDate: string;
}

// Upload
export const uploadMediaFormData = async (fd: FormData, token: string) => {
  // Thay URL này bằng link Ngrok mới nhất của bạn
  const API_URL = "/api/medias/upload";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      // Header bắt buộc khi dùng Ngrok để tránh bị chặn bởi browser warning
      "ngrok-skip-browser-warning": "true",
    },
    body: fd, 
    // KHÔNG đặt Content-Type là multipart/form-data, trình duyệt sẽ tự động thêm boundary
  });
  console.log("Upload response status:", await response.json());
  return response.json();
};

// Update
export async function updateMediaFormData(
  mediaId: number,
  formData: FormData,
  accessToken: string
): Promise<{ success: boolean }> {
  const res = await fetch(`/api/remote/medias/${mediaId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: formData,
  });

  return { success: res.ok };
}

// Delete
export async function deleteMedia(mediaId: number, accessToken: string) {
  await fetch(`/api/remote/medias/${mediaId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// Get uploads
export async function getUserMediaUploads(
  accessToken: string
): Promise<MediaUploadItem[]> {
  const res = await fetch("/api/users/me/media-uploads", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return data.content || [];
}
