// src/services/mediaService.ts

import { MediaItemDetail } from "../interfaces/mediaItemDetail";



export async function getFilmDetail(filmId: string): Promise<MediaItemDetail> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medias/${filmId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store', // Đảm bảo dữ liệu luôn mới nhất
  });

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết phim.");
  }

  return response.json();
}