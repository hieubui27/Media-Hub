"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Thêm useSearchParams
import { fetchFilterOptions } from "@/src/services/getGenres";

const MEDIA_MAP: Record<string, { slug: string; label: string }> = {
  "movie": { slug: "movie", label: "Movies" },
  "tv series": { slug: "series", label: "TV Series" },
  "video game": { slug: "game", label: "Video Game" },
  "book": { slug: "book", label: "Books" },
  "music": { slug: "music", label: "Music" },
  "all": { slug: "all", label: "All" }
};

interface FilterOptions {
  genres: string[];
  countries: string[];
  types: string[];
}

export default function MediaFilter({ 
  currentType, 
  currentGenre, 
  currentCountry 
}: { 
  currentType: string;
  currentGenre?: string;
  currentCountry?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook để lấy params hiện tại

  const [options, setOptions] = useState<FilterOptions>({
    genres: [],
    countries: [],
    types: []
  });

  const [filters, setFilters] = useState({
    type: currentType || "all",
    genre: currentGenre || "All",
    country: currentCountry || "All",
  });

  // Sync state when props change
  useEffect(() => {
    setFilters({
      type: currentType || "all",
      genre: currentGenre || "All",
      country: currentCountry || "All",
    });
  }, [currentType, currentGenre, currentCountry]);

  useEffect(() => {
    const loadOptions = async () => {
      const data = await fetchFilterOptions();
      setOptions(data);
    };
    loadOptions();
  }, []);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    // 1. GIỮ LẠI TỪ KHÓA TÌM KIẾM (QUAN TRỌNG)
    const currentQuery = searchParams.get("query");
    if (currentQuery) {
      params.set("query", currentQuery);
    }

    // 2. Thêm các filter mới
    const lowerType = filters.type.toLowerCase();
    const typeSlug = MEDIA_MAP[lowerType]?.slug || lowerType;

    if (typeSlug !== "all") params.set("type", typeSlug);
    if (filters.genre !== "All") params.set("genre", filters.genre);
    if (filters.country !== "All") params.set("country", filters.country);
    
    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    setIsOpen(false);
    router.push(`/main/media/search?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-zinc-400 hover:text-white font-bold text-sm mb-4 transition-colors">
        <span className={`mr-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        Bộ lọc nâng cao
      </button>

      {isOpen && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-6">
            <FilterRow 
              label="Danh mục" 
              options={["All", ...options.types]}
              currentValue={filters.type} 
              onChange={(val: string) => setFilters({...filters, type: val})}
              isTypeMapping={true} 
            />
            
            <FilterRow 
              label="Quốc gia" 
              options={["All", ...options.countries]}
              currentValue={filters.country}
              onChange={(val: string) => setFilters({...filters, country: val})}
            />

            <FilterRow 
              label="Thể loại" 
              options={["All", ...options.genres]}
              currentValue={filters.genre}
              onChange={(val: string) => setFilters({...filters, genre: val})}
            />
          </div>

          <div className="flex mt-8 pt-6 border-t border-white/5 space-x-4">
            <button onClick={handleApplyFilter} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-all shadow-lg hover:shadow-violet-900/20">
              Áp dụng
            </button>
            <button onClick={() => setIsOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component giữ nguyên logic UI
interface FilterRowProps {
  label: string;
  options: string[];
  currentValue: string;
  onChange: (val: string) => void;
  isTypeMapping?: boolean;
}

function FilterRow({ label, options, currentValue, onChange, isTypeMapping = false }: FilterRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
      <div className="w-24 text-zinc-500 text-xs font-bold pt-1.5 uppercase tracking-wider shrink-0">{label}:</div>
      <div className="flex flex-wrap gap-2 flex-1">
        {options.map((opt: string) => {
          const lowerOpt = opt.toLowerCase();
          const config = MEDIA_MAP[lowerOpt] || { slug: lowerOpt, label: opt };
          const isActive = currentValue?.toLowerCase() === lowerOpt || currentValue?.toLowerCase() === config.slug;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(isTypeMapping ? config.slug : opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive 
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/20" 
                  : "text-zinc-400 bg-zinc-800/50 hover:text-white hover:bg-zinc-700 border border-transparent"
              }`}
            >
              {isTypeMapping ? config.label : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}