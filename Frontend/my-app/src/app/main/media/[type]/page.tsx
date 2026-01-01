// src/app/main/media/[type]/page.tsx
import MediaFilter from "@/src/components/GridFilm/FilterFilm";
import MediaGrid from "@/src/components/GridFilm/MovieGrid";
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
  // 1. Giải nén đồng thời cả params và searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const type = resolvedParams.type;
  const currentPage = Number(resolvedSearchParams.page) || 0;
  const currentGenre = resolvedSearchParams.genre;
  const currentCountry = resolvedSearchParams.country;

  // 2. Gọi API lấy dữ liệu thực tế
  const data = await fetchMediaItems(
    type, 
    currentPage, 
    currentGenre, 
    currentCountry
  );

  if (!data) {
    return <div className="p-10 text-white">Lỗi tải dữ liệu...</div>;
  }

  return (
    <div className="p-10 bg-[#0a0a0a] min-h-screen pt-28">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white capitalize">
          {type === "all" ? "Tất cả" : type} <span className="text-violet-500">Hub</span>
        </h1>
        <p className="text-zinc-500 mt-2">
          Tìm thấy {data.totalElements} kết quả phù hợp.
        </p>
      </header>

      {/* Bộ lọc đã tích hợp sẵn logic "sáng" theo URL */}
      <MediaFilter currentType={type} />
      
      {/* Grid hiển thị dữ liệu từ API */}
      <MediaGrid items={data.content} />

      {/* 3. Thêm phân trang (Pagination) cơ bản */}
      <div className="mt-12 flex justify-center gap-4">
        {currentPage > 0 && (
          <a 
            href={`?page=${currentPage - 1}`}
            className="px-6 py-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-all"
          >
            Trang trước
          </a>
        )}
        {currentPage < data.totalPages - 1 && (
          <a 
            href={`?page=${currentPage + 1}`}
            className="px-6 py-2 bg-violet-500 text-black font-bold rounded-full hover:bg-violet-600 transition-all"
          >
            Trang tiếp theo
          </a>
        )}
      </div>
    </div>
  );
}