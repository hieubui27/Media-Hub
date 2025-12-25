// Định nghĩa cấu trúc item trong mảng content
export interface MediaItem {
    MediaItemId: number;
    title: string;
    typeName: string;
    description: string;
    director: string;
    contentRating: string;
    genres: string[];
}

// Định nghĩa cấu trúc tổng thể của API trả về
export interface SearchResponse {
    content: MediaItem[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export async function searchMedia(search: string): Promise<SearchResponse> {
    const res = await fetch(`/api/remote/medias?title=${search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420', 
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch media');
    }
    
    return await res.json();
}