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
  
  // 1. Get page from URL. Default to 1 if not present or <= 0.
  const pageFromUrl = Number(resolvedSearchParams.page) || 1;
  const currentPage = pageFromUrl < 1 ? 1 : pageFromUrl;

  const currentGenre = resolvedSearchParams.genre;
  const currentCountry = resolvedSearchParams.country;

  // 2. Call API: Pass page number directly (1, 2, 3...)
  const data = await fetchMediaItems(
    type, 
    currentPage, 
    currentGenre, 
    currentCountry
  );

  if (!data) {
    return <div className="p-20 text-center text-zinc-500">Loading or no data...</div>;
  }

  // Note: If API returns data.number as current page (1-based), use it directly.
  // If API still returns 0-based in response body (even if input is 1-based),
  // you might need to use `data.number + 1` in the currentPage prop below.
  // Here I assume API returns standard 1-based as you requested.

  return (
    <div className="p-4 md:p-10 bg-[#0a0a0a] min-h-screen pt-24 md:pt-28">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
          {type === "all" ? "Discover" : type} <span className="text-violet-500">Hub</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Page {data.number + 1} / {data.totalPages} • Total {data.totalElements} results
        </p>
      </header>

      <MediaFilter currentType={type} />
      
      <MediaGrid items={data.content} />

      {/* Pagination */}
      <Pagination 
        currentPage={data.number + 1}  // Assume API returns current page number (1, 2...)
        totalPages={data.totalPages} 
      />
    </div>
  );
}