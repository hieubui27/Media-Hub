// src/interfaces/uploadHistory.ts
export interface UploadHistoryItem {
  MediaItemId: number; // Chú ý viết hoa theo API của bạn
  title: string;
  typeName: string;
  createdAt: string;
  urlItem?: string;
  thumbnail?: string;
  description?: string;
}

export interface MyUploadsResponse {
  content: UploadHistoryItem[];
  totalElements: number;
  totalPages: number;
  number: number; // Current page index (0-based)
  size: number;
}
