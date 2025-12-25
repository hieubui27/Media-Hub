export interface MediaItem {
  id: string;
  title: string;
  aliasTitle: string; // Sách: Tác giả | Phim: Tên gốc
  thumbnail: string;
  episodeCount: number; // Sách: Số chương | Phim: Số tập
  slug: string;
  type: 'movie' | 'book'; // Phân loại
}