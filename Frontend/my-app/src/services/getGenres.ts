import { MediaResponse } from "../interfaces/APIResponse";

// services/mediaService.ts
export async function fetchFilterOptions() {
  try {
    const response = await fetch(`/api/medias/latest`, {
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Header quan trọng để bỏ qua trang div của ngrok
          },
        next: { revalidate: 3600 }
      });
    const data: MediaResponse = await response.json();
    const content = data.content || [];

    return {
      // flatMap thường trả về mảng string[] nên genres ít khi bị lỗi này
      genres: Array.from(new Set(content.flatMap(item => item.genres))).sort(),

      // Lọc bỏ các giá trị undefined/null bằng .filter(Boolean)
      countries: Array.from(
        new Set(content.map(item => item.country).filter((c): c is string => !!c))
      ).sort(),

      types: Array.from(
        new Set(content.map(item => item.typeName).filter((t): t is string => !!t))
      ).sort(),
    };
  } catch (error) {
    console.error("Lỗi khi lấy tùy chọn lọc:", error);
    return { genres: [], countries: [], types: [] };
  }
}