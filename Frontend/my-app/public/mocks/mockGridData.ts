import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";

export const MOCK_GRID_DATA: MediaItemDetail[] = [
  // --- MOVIES (Phim Lẻ) ---
  {
    id: "m-1", type: 'movie', title: "Deadpool & Wolverine", aliasTitle: "Deadpool 3",
    thumbnail: "https://image.tmdb.org/t/p/w500/8cdWjvZQUvS6UclmSTPv9STmOez.jpg",
    slug: "deadpool-wolverine", genres: ["Hành động", "Hài"], rating: 8.2, duration: "127 phút", director: "Shawn Levy"
  },
  {
    id: "m-2", type: 'movie', title: "Joker: Folie à Deux", aliasTitle: "Joker 2",
    thumbnail: "https://image.tmdb.org/t/p/w500/aciP8Km8S3GvYnGh7u7pWoYvX98.jpg",
    slug: "joker-2", genres: ["Tâm lý", "Âm nhạc"], rating: 7.5, duration: "138 phút", director: "Todd Phillips"
  },
  {
    id: "m-3", type: 'movie', title: "Kẻ Trộm Mặt Trăng 4", aliasTitle: "Despicable Me 4",
    thumbnail: "https://image.tmdb.org/t/p/w500/3w84hCFEuATvwi8Uvo0uLZ0oAbA.jpg",
    slug: "despicable-me-4", genres: ["Hoạt hình", "Gia đình"], rating: 7.8, duration: "94 phút", director: "Chris Renaud"
  },
  {
    id: "m-4", type: 'movie', title: "Vương Quốc Xe Hơi", aliasTitle: "Cars",
    thumbnail: "https://image.tmdb.org/t/p/w500/jpf97pUav697Yv7XmOXvV0p9S9z.jpg",
    slug: "cars", genres: ["Hoạt hình", "Hài"], rating: 7.3, duration: "117 phút", director: "John Lasseter"
  },

  // --- SERIES (Phim Bộ) ---
  {
    id: "s-1", type: 'series', title: "Arcane", aliasTitle: "Liên Minh Huyền Thoại",
    thumbnail: "https://image.tmdb.org/t/p/w500/fqld9271Qp7tU3C3sIDiQ6S0Afi.jpg",
    slug: "arcane", genres: ["Hành động", "Viễn tưởng"], rating: 9.0, seasonCount: 2, episodeCount: 18, status: 'Hoàn thành'
  },
  {
    id: "s-2", type: 'series', title: "Trò Chơi Vương Quyền", aliasTitle: "Game of Thrones",
    thumbnail: "https://image.tmdb.org/t/p/w500/7WsyChvRStvT0tO2EOvNi6XpUMs.jpg",
    slug: "game-of-thrones", genres: ["Kịch tính", "Phiêu lưu"], rating: 9.2, seasonCount: 8, episodeCount: 73, status: 'Hoàn thành'
  },
  {
    id: "s-3", type: 'series', title: "Cậu Bé Mất Tích", aliasTitle: "Stranger Things",
    thumbnail: "https://image.tmdb.org/t/p/w500/49WpIv9UuS672OQ6DUCX6p79p3y.jpg",
    slug: "stranger-things", genres: ["Kinh dị", "Bí ẩn"], rating: 8.7, seasonCount: 4, episodeCount: 34, status: 'Đang chiếu'
  },

  // --- BOOK (Sách) ---
  {
    id: "b-1", type: 'book', title: "Chúa Tể Những Chiếc Nhẫn", aliasTitle: "J.R.R. Tolkien",
    thumbnail: "https://picsum.photos/seed/lotr/400/600",
    slug: "lord-of-the-rings", genres: ["Fantasy", "Phiêu lưu"], rating: 9.9, author: "J.R.R. Tolkien", pageCount: 1178, publisher: "Allen & Unwin"
  },
  {
    id: "b-2", type: 'book', title: "Harry Potter và Hòn Đá Phù Thủy", aliasTitle: "J.K. Rowling",
    thumbnail: "https://picsum.photos/seed/harry/400/600",
    slug: "harry-potter-1", genres: ["Fantasy", "Thiếu nhi"], rating: 9.4, author: "J.K. Rowling", pageCount: 309, publisher: "Bloomsbury"
  },

  // --- MANGA (Truyện Tranh) ---
  {
    id: "ma-1", type: 'manga', title: "Naruto", aliasTitle: "Naruto Shippuden",
    thumbnail: "https://image.tmdb.org/t/p/w500/o97BhIuYmO6Yp9999o8B3uI9p9.jpg",
    slug: "naruto", genres: ["Shounen", "Hành động"], rating: 8.9, author: "Masashi Kishimoto", chapterCount: 700, isColor: false
  },
  {
    id: "ma-2", type: 'manga', title: "Chú Thuật Hồi Chiến", aliasTitle: "Jujutsu Kaisen",
    thumbnail: "https://image.tmdb.org/t/p/w500/g19S6Y9vS1S4pY2pS8Vv57m.jpg", // Link giả định
    slug: "jujutsu-kaisen", genres: ["Shounen", "Siêu nhiên"], rating: 8.7, author: "Gege Akutami", chapterCount: 260, isColor: false
  },

  // --- GAME (Trò Chơi) ---
  {
    id: "g-1", type: 'game', title: "Black Myth: Wukong", aliasTitle: "Hắc Thần Thoại: Ngộ Không",
    thumbnail: "https://image.tmdb.org/t/p/w500/7WsyChvRStvT0tO2EOvNi6XpUMs.jpg", // Thay bằng link ảnh game thật
    slug: "black-myth-wukong", genres: ["Hành động", "RPG"], rating: 9.5, developer: "Game Science", platforms: ["PC", "PS5"]
  },
  {
    id: "g-2", type: 'game', title: "Elden Ring: Shadow of the Erdtree", aliasTitle: "FromSoftware",
    thumbnail: "https://image.tmdb.org/t/p/w500/1YvS7N25Wf4U704xO0N3O2m3J4m.jpg",
    slug: "elden-ring-dlc", genres: ["RPG", "Soul-like"], rating: 9.8, developer: "FromSoftware", platforms: ["PC", "PS5", "Xbox"]
  }
];

// Tạo thêm data tự động bằng cách duplicate và sửa ID để test Grid lớn (40 items)
export const LARGE_MOCK_DATA: MediaItemDetail[] = [
    ...MOCK_GRID_DATA,
    ...MOCK_GRID_DATA.map(item => ({...item, id: item.id + "-copy1", title: item.title + " (Copy)"})),
    ...MOCK_GRID_DATA.map(item => ({...item, id: item.id + "-copy2", title: item.title + " (Re-release)"}))
];