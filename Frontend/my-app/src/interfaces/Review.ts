// src/interfaces/Review.ts
export interface ReviewData {
  reviewId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  userAvatar: string | null;
}

