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

  // 1. Handle Page from URL as Source of Truth
  const pageFromUrl = Number(page) || 1;
  const currentPage = pageFromUrl < 1 ? 1 : pageFromUrl;
  
  const keyword = query || "";

  // 2. Call API
  // Note: If your API uses 0-based index (first page is 0), pass (currentPage - 1)
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
              <>Search results: <span className="text-violet-500">"{keyword}"</span></>
            ) : (
               <>Discover <span className="text-violet-500">Content</span></>
            )}
          </h1>
          <p className="text-zinc-500 text-sm">
            {/* FIX: Use currentPage instead of data.number */}
            {data ? `Page ${currentPage} / ${data.totalPages} • Found ${data.totalElements} results.` : "Loading..."}
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
            
            {/* FIX: Pass currentPage into Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={data.totalPages} 
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed mt-8">
            <p className="text-xl text-white font-medium mb-2">No results found</p>
            <p className="text-zinc-500 text-sm">Try changing filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}