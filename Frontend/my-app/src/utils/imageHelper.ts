// Hàm helper để xử lý URL ảnh (Avatar/Media)
export const getImageUrl = (thumbnail: string | undefined | null): string => {
    // 1. Nếu thumbnail trống, trả về /placeholder-poster.png
    if (!thumbnail || thumbnail.trim() === "") {
        return "/placeholder-poster.png";
    }

    // 2. Nếu thumbnail bắt đầu bằng 'http', trả về chính nó
    if (thumbnail.startsWith("http")) {
        return thumbnail;
    }

    // 3. Nếu thumbnail chứa 'uploads', thêm prefix là biến môi trường
    if (thumbnail.includes("uploads")) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";
        // Tối ưu xử lý dấu gạch chéo để tránh lỗi double slash
        // Loại bỏ dấu / ở cuối baseUrl và dấu / ở đầu thumbnail (nếu có) trước khi nối
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
        const cleanPath = thumbnail.replace(/^\/+/, "");
        
        return `${cleanBaseUrl}${cleanPath}`;
    }

    // Fallback mặc định
    return thumbnail;
};
