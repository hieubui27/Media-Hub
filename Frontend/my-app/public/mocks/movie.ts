import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";

// --- DANH MỤC PHIM HÀN QUỐC ---
export const KOREAN_MOVIES: MediaItemDetail[] = [
  {
    id: 1,
    type: 'series',
    title: "Những Bản Nhạc Tình",
    aliasTitle: "Love: Track",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/b39d2f3dde46d68eef366aec0dfd825f.jpg",
    slug: "nhung-ban-nhac-tinh",
    genres: ["Lãng mạn", "Âm nhạc"],
    rating: 8.5,
    episodeCount: 6,
    seasonCount: 1,
    status: 'Hoàn thành'
  },
  {
    id: 2,
    type: 'series',
    title: "Chắc Chứ, Người Anh Em?!",
    aliasTitle: "Are You Sure?!",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/6367c8bac2fcd746c32f60700df2cc41.jpg",
    slug: "chac-chu-nguoi-anh-em",
    genres: ["Show thực tế", "Du lịch"],
    rating: 9.0,
    episodeCount: 8,
    seasonCount: 1,
    status: 'Hoàn thành'
  },
  {
    id: 3,
    type: 'series',
    title: "Nụ Hôn Bùng Nổ",
    aliasTitle: "Dynamite Kiss",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/2fecfde6dd3dfba9466a85fd350f9eb2.jpg",
    slug: "nu-hon-bung-no",
    genres: ["Tình cảm", "Hài hước"],
    rating: 7.8,
    episodeCount: 13,
    seasonCount: 1,
    status: 'Đang chiếu'
  },
  {
    id: 4,
    type: 'series',
    title: "Thử Thách Thần Tượng",
    aliasTitle: "Running Man",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/b9b43745c5286ce94419405ebbcd4f48.jpg",
    slug: "thu-thach-than-tuong",
    genres: ["Giải trí", "Hành động"],
    rating: 9.5,
    episodeCount: 782,
    seasonCount: 1,
    status: 'Đang chiếu'
  }
];

// --- DANH MỤC PHIM TRUNG QUỐC ---
export const CHINESE_MOVIES: MediaItemDetail[] = [
  {
    id: 5,
    type: 'series',
    title: "Thời Vàng Son",
    aliasTitle: "Our Golden Days",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/766cdd70298d1151b7d98ece4c710c03.jpg",
    slug: "thoi-vang-son",
    genres: ["Chính kịch", "Lãng mạn"],
    rating: 8.2,
    episodeCount: 40,
    seasonCount: 1,
    status: 'Hoàn thành'
  },
  {
    id: 6,
    type: 'series',
    title: "Mật Ngọt Chết Ruồi",
    aliasTitle: "A Graceful Liar",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/32ef6bdfd81da2d2b65c807edc04db30.jpg",
    slug: "mat-ngot-chet-ruoi",
    genres: ["Cổ trang", "Ngôn tình"],
    rating: 7.9,
    episodeCount: 59,
    seasonCount: 1,
    status: 'Hoàn thành'
  }
];

// --- DANH MỤC PHIM CHÂU ÂU ---
export const EUROPEAN_MOVIES: MediaItemDetail[] = [
  {
    id: 7,
    type: 'series',
    title: "Chợ Đen Thời Tận Thế",
    aliasTitle: "Concrete Market",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/fda0843f7f291e052a3a4002e90dc697.jpg",
    slug: "cho-den-thoi-tan-the",
    genres: ["Hành động", "Viễn tưởng"],
    rating: 8.0,
    episodeCount: 3,
    seasonCount: 1,
    status: 'Hoàn thành'
  },
  {
    id: 8,
    type: 'series',
    title: "Giác Quan Thứ Sáu",
    aliasTitle: "Sixth Sense: City Tour",
    thumbnail: "https://static.nutscdn.com/vimg/400-0/15f4d5177f1cea381c8b563994b72b7c.jpg",
    slug: "giac-quan-thu-sau",
    genres: ["Kinh dị", "Bí ẩn"],
    rating: 8.7,
    episodeCount: 8,
    seasonCount: 3,
    status: 'Hoàn thành'
  }
];

// --- DANH MỤC SÁCH ---
export const TRENDING_BOOKS: MediaItemDetail[] = [
  {
    id: 9,
    type: 'book',
    title: "Nhà Giả Kim",
    aliasTitle: "The Alchemist",
    thumbnail: "https://covers.openlibrary.org/b/id/14589254-L.jpg",
    slug: "nha-gia-kim",
    genres: ["Triết lý", "Văn học"],
    rating: 9.8,
    author: "Paulo Coelho",
    pageCount: 174,
    publisher: "NXB Văn Học"
  },
  {
    id: 10,
    type: 'book',
    title: "Bố Già",
    aliasTitle: "The Godfather",
    thumbnail: "https://covers.openlibrary.org/b/id/14565738-L.jpg",
    slug: "bo-gia",
    genres: ["Tội phạm", "Kịch tính"],
    rating: 9.9,
    author: "Mario Puzo",
    pageCount: 448,
    publisher: "NXB Trẻ"
  },
  {
    id: 11,
    type: 'book',
    title: "Sherlock Holmes",
    aliasTitle: "The Adventures of Sherlock Holmes",
    thumbnail: "https://covers.openlibrary.org/b/id/10427803-L.jpg",
    slug: "sherlock-holmes",
    genres: ["Trinh thám", "Bí ẩn"],
    rating: 9.6,
    author: "Arthur Conan Doyle",
    pageCount: 300,
    publisher: "George Newnes"
  }
];
