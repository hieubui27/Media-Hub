

// Helper to get headers with Token and Ngrok bypass
const getAuthHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok calls
    };

    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user') || localStorage.getItem('admin_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.accessToken) {
                    headers['Authorization'] = `Bearer ${parsedUser.accessToken}`;
                }
            } catch (error) {
                console.error("Error parsing token", error);
            }
        }
    }
    return headers;
};

// --- Interfaces ---

export interface AdminMediaItem {
    id: number;
    title: string;
    urlImage?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdBy: string;
    createdAt: string;
    typeName?: string; // Needed for edit
    description?: string;
}

export interface AdminReviewItem {
    id: number;
    content: string;
    rating: number;
    mediaTitle: string;
    user: string;
    createdAt: string;
}

export interface AdminUserItem {
    id: number;
    email: string;
    displayName: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}

// --- API Methods ---

// 1. GET Medias (Admin)
export const adminGetMedias = async (page: number, limit: number, status?: string) => {
    const params = new URLSearchParams({
        page: (page - 1).toString(), // Convert 1-based (UI) to 0-based (API)
        limit: limit.toString(),
    });
    if (status) {
        params.append('status', status);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/medias?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to fetch medias');
    return await res.json();
};

// 2. TOGGLE Media Status (Admin)
export const adminToggleMediaStatus = async (id: number | string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/medias/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to update media status');
    return await res.json();
};

// 3. DELETE Media (Admin)
export const adminDeleteMedia = async (id: number | string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/medias/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to delete media');
    return true;
};

// 4. UPDATE Media (Admin - Must include typeName)
export const adminUpdateMedia = async (id: number | string, data: { title: string; description: string; typeName: string }) => {
    if (!data.typeName) {
        throw new Error("Admin update requires 'typeName' field");
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/medias/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }
    
    if (!res.ok) throw new Error('Failed to update media');
    return await res.json();
};

// 5. GET Reviews (Admin)
export const adminGetReviews = async (page: number, limit: number) => {
     const params = new URLSearchParams({
        page: (page - 1).toString(),
        limit: limit.toString(),
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/reviews?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
}

// 6. DELETE Review (Admin)
export const adminDeleteReview = async (id: number | string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to delete review');
    return true; 
};

// 7. GET Users
export const adminGetUsers = async (page: number, limit: number, status?: string) => {
    const params = new URLSearchParams({
        page: (page - 1).toString(),
        limit: limit.toString(),
    });
     if (status) {
        params.append('status', status);
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/users?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
};

// 8. TOGGLE User Status
export const adminToggleUserStatus = async (id: number | string) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('unauthorized-access'));
        throw new Error('Unauthorized');
    }

    if (!res.ok) throw new Error('Failed to update user status');
    return await res.json();
}