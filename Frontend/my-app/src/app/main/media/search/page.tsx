import MediaFilter from "@/src/components/GridFilm/FilterFilm";
import MediaGrid from "@/src/components/GridFilm/MovieGrid";
import { fetchMediaItems } from "@/src/services/mediaService";

interface SearchProps {
  searchParams: Promise<{
    type?: string;
    genre?: string;
    country?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const { type, genre, country, page } = await searchParams;
  const currentPage = Number(page) || 0;

  console.log("SearchPage - Params:", { type, genre, country, page: currentPage });

  // Gọi API lấy dữ liệu thực tế
  const data = await fetchMediaItems(
    type || "all", 
    currentPage, 
    genre, 
    country
  );

  console.log("SearchPage - Data received:", data);
  console.log("SearchPage - Content length:", data?.content?.length);

  return (
    <div className="p-10 bg-[#0a0a0a] min-h-screen pt-28">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Kết quả <span className="text-yellow-500">Tìm kiếm</span>
          </h1>
          <p className="text-zinc-500 mt-2">
            Tìm thấy {data?.totalElements || 0} nội dung phù hợp.
          </p>
        </header>

        {/* Nút Phân loại sẽ sáng dựa trên param 'type' từ URL */}
        <MediaFilter 
          currentType={type || "all"} 
          currentGenre={genre}
          currentCountry={country}
        />

        {data && data.content.length > 0 ? (
          <>
            <MediaGrid items={data.content} />
            
            {/* Phân trang giữ nguyên các tham số lọc hiện tại */}
            <div className="mt-16 flex justify-center items-center gap-4">
               {/* Pagination logic here... */}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[40px] border border-white/5">
            <p className="text-zinc-500">Không tìm thấy kết quả nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
}

