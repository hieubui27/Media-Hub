// 1. Khai báo các loại Media hỗ trợ
export type MediaType = 'movie' | 'series' | 'book' | 'manga' | 'game';

// 2. Interface gốc (Chứa các thuộc tính mà tất cả Media đều có)
export interface BaseMedia {
  MediaItemId: number;
  title: string;
  aliasTitle: string; // Tên gốc hoặc Tên tác giả tùy loại
  thumbnail: string;
  slug: string;
  genres: string[];   // Thể loại: ["Hành động", "Kịch tính"]
  rating: number;     // Điểm đánh giá: 8.5
  description?: string;
  releaseDate?: string;
  country?: string;
  typeName?: string;
  urlItem?:string; // "TV Series", "Movie", "Book", etc.
}

// 3. Interface cụ thể cho Phim lẻ (Movie)
export interface MovieDetail extends BaseMedia {
  type: 'movie';
  duration: string;   // Ví dụ: "120 phút"
  director: string;   // Đạo diễn
}

// 4. Interface cụ thể cho Phim bộ (Series)
export interface SeriesDetail extends BaseMedia {
  type: 'series';
  episodeCount: number; // Tổng số tập
  seasonCount: number;  // Số mùa
  status: 'Đang chiếu' | 'Hoàn thành';
}

// 5. Interface cụ thể cho Sách chữ (Book)
export interface BookDetail extends BaseMedia {
  type: 'book';
  author: string;     // Tác giả
  pageCount: number;  // Số trang
  publisher: string;  // Nhà xuất bản
}

// 6. Interface cụ thể cho Truyện tranh (Manga)
export interface MangaDetail extends BaseMedia {
  type: 'manga';
  author: string;     // Họa sĩ/Tác giả
  chapterCount: number; // Số chương
  isColor: boolean;   // Truyện màu hay không
}

// 7. Interface cụ thể cho Trò chơi (Game)
export interface GameDetail extends BaseMedia {
  type: 'game';
  developer: string;  // Nhà phát triển (vd: Nintendo, Sony)
  platforms: string[]; // Nền tảng: ["PC", "PS5", "Xbox"]
}

// 8. Union Type (Dùng để khai báo mảng dữ liệu hỗn hợp trong Grid)
export type MediaItemDetail = 
  | MovieDetail 
  | SeriesDetail 
  | BookDetail 
  | MangaDetail 
  | GameDetail;