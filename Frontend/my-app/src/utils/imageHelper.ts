// Helper function to handle image URL (Avatar/Media)
export const getImageUrl = (thumbnail: string | undefined | null): string => {
    // 1. If thumbnail is empty, return /placeholder-poster.png
    if (!thumbnail || thumbnail.trim() === "") {
        return "/placeholder-poster.png";
    }

    // 2. If thumbnail starts with 'http', return it as is
    if (thumbnail.startsWith("http")) {
        return thumbnail;
    }

    // 3. If thumbnail contains 'uploads', add environment variable prefix
    if (thumbnail.includes("uploads")) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";
        // Optimize slash handling to avoid double slash errors
        // Remove trailing slash from baseUrl and leading slash from thumbnail (if any) before joining
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
        const cleanPath = thumbnail.replace(/^\/+/, "");
        
        return `${cleanBaseUrl}${cleanPath}`;
    }

    // Default fallback
    return thumbnail;
};