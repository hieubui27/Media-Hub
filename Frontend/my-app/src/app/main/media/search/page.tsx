import MediaFilter from "@/src/components/GridFilm/FilterFilm";
import MediaGrid from "@/src/components/GridFilm/MovieGrid";
import Pagination from "@/src/components/common/Pagination"; 
import { searchMediaItems } from "@/src/services/mediaService";

interface SearchProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    genre?: string;
    country?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const { query, type, genre, country, page } = await searchParams;

  // 1. Xử lý Page từ URL làm nguồn dữ liệu chính (Source of Truth)
  const pageFromUrl = Number(page) || 1;
  const currentPage = pageFromUrl < 1 ? 1 : pageFromUrl;
  
  const keyword = query || "";

  // 2. Gọi API
  // Lưu ý: Nếu API của bạn dùng 0-based index (trang đầu là 0), hãy truyền (currentPage - 1)
  const data = await searchMediaItems(
    keyword,
    type || "all",
    genre,
    country,
    currentPage
  );

  return (
    <div className="p-4 md:p-10 bg-[#0a0a0a] min-h-screen pt-24 md:pt-28">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {keyword ? (
              <>Kết quả tìm kiếm: <span className="text-violet-500">"{keyword}"</span></>
            ) : (
               <>Khám phá <span className="text-violet-500">Nội dung</span></>
            )}
          </h1>
          <p className="text-zinc-500 text-sm">
            {/* SỬA: Dùng currentPage thay vì data.number */}
            {data ? `Trang ${currentPage} / ${data.totalPages} • Tìm thấy ${data.totalElements} kết quả.` : "Đang tải..."}
          </p>
        </header>

        <MediaFilter 
          currentType={type || "all"} 
          currentGenre={genre}
          currentCountry={country}
        />

        {data && data.content.length > 0 ? (
          <>
            <MediaGrid items={data.content} />
            
            {/* SỬA: Truyền currentPage vào Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={data.totalPages} 
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed mt-8">
            <p className="text-xl text-white font-medium mb-2">Không tìm thấy kết quả nào</p>
            <p className="text-zinc-500 text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
}