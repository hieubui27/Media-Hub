// src/services/getFilmDetail.ts
import { MediaItemDetail } from "../interfaces/mediaItemDetail";

export async function getFilmDetail(filmId: string): Promise<MediaItemDetail> {
  // 1. Kiểm tra môi trường: window undefined nghĩa là đang chạy trên Server
  const isServer = typeof window === 'undefined';
  
  // 2. Nếu là Server: Dùng URL tuyệt đối từ biến môi trường.
  //    Nếu là Client: Để trống (dùng URL tương đối) để trình duyệt gọi qua Proxy /api nhằm tránh CORS.
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_API_URL : ""; 

  const response = await fetch(`${baseUrl}/api/medias/${filmId}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      // Header quan trọng để tránh trang cảnh báo của ngrok làm hỏng kết quả JSON
      "ngrok-skip-browser-warning": "true",
    },
    cache: 'no-store', // Đảm bảo dữ liệu luôn mới nhất
  });

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết phim.");
  }

  return response.json();
}