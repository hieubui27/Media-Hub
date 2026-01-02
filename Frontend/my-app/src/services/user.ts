import { getImageUrl } from "../utils/imageHelper";

export interface UserProfile {
    id: number;
    email: string;
    displayName: string;
    avatar: string;
    gender?: string;
    dob?: string;
    role?: string;
    // Thêm các trường khác nếu API trả về
}

export const getProfile = async (token: string): Promise<UserProfile> => {
    // Sử dụng biến môi trường cho linh hoạt
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://8dcbf8a962a3.ngrok-free.app';
    
    const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true', // Quan trọng khi dùng ngrok
            'Content-Type': 'application/json'
        },
    });

    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('unauthorized-access'));
        }
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const data = await res.json();
    console.log("Fetched user profile:", data);
    return data;
};
