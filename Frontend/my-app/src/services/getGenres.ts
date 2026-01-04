import { MediaResponse } from "../interfaces/APIResponse";

// services/mediaService.ts
export async function fetchFilterOptions() {
  try {
    const response = await fetch(`/api/medias/latest`, {
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Important header to skip ngrok's warning page
          },
        next: { revalidate: 3600 }
      });
    const data: MediaResponse = await response.json();
    const content = data.content || [];

    return {
      // flatMap usually returns string[], so genres rarely have this issue
      genres: Array.from(new Set(content.flatMap(item => item.genres))).sort(),

      // Filter out undefined/null values using .filter(Boolean)
      countries: Array.from(
        new Set(content.map(item => item.country).filter((c): c is string => !!c))
      ).sort(),

      types: Array.from(
        new Set(content.map(item => item.typeName).filter((t): t is string => !!t))
      ).sort(),
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return { genres: [], countries: [], types: [] };
  }
}
