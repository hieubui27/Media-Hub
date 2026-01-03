// src/app/main/media/[type]/page.tsx
import MediaFilter from "@/src/components/GridFilm/FilterFilm";
import MediaGrid from "@/src/components/GridFilm/MovieGrid";
import Pagination from "@/src/components/common/Pagination"; 
import { fetchMediaItems } from "@/src/services/getFIlmByType";

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ 
    page?: string; 
    genre?: string; 
    country?: string 
  }>;
}

export default async function TypeMediaPage({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const type = resolvedParams.type;
  
  // 1. Lấy page từ URL. Nếu không có hoặc <= 0 thì mặc định là 1.
  const pageFromUrl = Number(resolvedSearchParams.page) || 1;
  const currentPage = pageFromUrl < 1 ? 1 : pageFromUrl;

  const currentGenre = resolvedSearchParams.genre;
  const currentCountry = resolvedSearchParams.country;

  // 2. Gọi API: Truyền trực tiếp số trang (1, 2, 3...)
  const data = await fetchMediaItems(
    type, 
    currentPage, 
    currentGenre, 
    currentCountry
  );

  if (!data) {
    return <div className="p-20 text-center text-zinc-500">Đang tải hoặc không có dữ liệu...</div>;
  }

  // Lưu ý: Nếu API trả về data.number đúng là trang hiện tại (1-based) thì dùng luôn.
  // Nếu API vẫn trả về 0-based trong response body (dù input là 1-based), 
  // bạn có thể cần dùng `data.number + 1` ở prop currentPage dưới đây.
  // Ở đây tôi giả định API trả về chuẩn 1-based như bạn yêu cầu.

  return (
    <div className="p-4 md:p-10 bg-[#0a0a0a] min-h-screen pt-24 md:pt-28">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
          {type === "all" ? "Khám Phá" : type} <span className="text-violet-500">Hub</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Trang {data.number + 1} / {data.totalPages} • Tổng {data.totalElements} kết quả
        </p>
      </header>

      <MediaFilter currentType={type} />
      
      <MediaGrid items={data.content} />

      {/* Phân trang */}
      <Pagination 
        currentPage={data.number + 1}  // Giả định API trả về số trang hiện tại (1, 2...)
        totalPages={data.totalPages} 
      />
    </div>
  );
}