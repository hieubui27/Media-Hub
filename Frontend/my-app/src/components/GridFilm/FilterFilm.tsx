"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchFilterOptions } from "@/src/services/getGenres";

const MEDIA_MAP: Record<string, { slug: string; label: string }> = {
  "movie": { slug: "movie", label: "Phim lẻ" },
  "tv series": { slug: "series", label: "Phim bộ" },
  "video game": { slug: "game", label: "Video Game" },
  "book": { slug: "book", label: "Sách/Truyện" },
  "music": { slug: "music", label: "Âm nhạc" },
  "tất cả": { slug: "all", label: "Tất cả" }
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

  const [options, setOptions] = useState<FilterOptions>({
    genres: [],
    countries: [],
    types: []
  });

  // State filters khởi tạo trực tiếp từ props
  const [filters, setFilters] = useState({
    type: currentType,
    genre: currentGenre || "Tất cả",
    country: currentCountry || "Tất cả",
    year: "Tất cả",
  });

  // Giải pháp cho lỗi ESLint: Đồng bộ state khi props thay đổi mà không dùng useEffect trực tiếp
  // (Pattern: Adjusting state when props change)
  const [prevProps, setPrevProps] = useState({ currentType, currentGenre, currentCountry });

  if (
    currentType !== prevProps.currentType || 
    currentGenre !== prevProps.currentGenre || 
    currentCountry !== prevProps.currentCountry
  ) {
    setPrevProps({ currentType, currentGenre, currentCountry });
    setFilters({
      type: currentType,
      genre: currentGenre || "Tất cả",
      country: currentCountry || "Tất cả",
      year: "Tất cả"
    });
  }

  useEffect(() => {
    const loadOptions = async () => {
      const data = await fetchFilterOptions();
      setOptions(data);
    };
    loadOptions();
  }, []);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    const lowerType = filters.type.toLowerCase();
    const typeSlug = MEDIA_MAP[lowerType]?.slug || lowerType;

    if (typeSlug !== "all") params.set("type", typeSlug);
    if (filters.genre !== "Tất cả") params.set("genre", filters.genre);
    if (filters.country !== "Tất cả") params.set("country", filters.country);
    
    setIsOpen(false);
    router.push(`/main/media/search?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-zinc-400 hover:text-white font-bold text-sm mb-4">
        <span className={`mr-2 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        Bộ lọc nâng cao
      </button>

      {isOpen && (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 shadow-2xl">
          <div className="space-y-6">
            <FilterRow 
              label="Phân loại" 
              options={["Tất cả", ...options.types]} 
              currentValue={filters.type} 
              onChange={(val: string) => setFilters({...filters, type: val})}
              isTypeMapping={true} 
            />
            
            <FilterRow 
              label="Quốc gia" 
              options={["Tất cả", ...options.countries]} 
              currentValue={filters.country}
              onChange={(val: string) => setFilters({...filters, country: val})}
            />

            <FilterRow 
              label="Thể loại" 
              options={["Tất cả", ...options.genres]} 
              currentValue={filters.genre}
              onChange={(val: string) => setFilters({...filters, genre: val})}
            />
          </div>

          <div className="flex mt-8 pt-6 border-t border-white/5 space-x-4">
            <button onClick={handleApplyFilter} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full text-sm">
              Lọc kết quả →
            </button>
            <button onClick={() => setIsOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-full text-sm">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Định nghĩa Interface để hết lỗi TypeScript "Implicit Any"
interface FilterRowProps {
  label: string;
  options: string[];
  currentValue: string;
  onChange: (val: string) => void;
  isTypeMapping?: boolean;
}

function FilterRow({ label, options, currentValue, onChange, isTypeMapping = false }: FilterRowProps) {
  return (
    <div className="flex items-start">
      <div className="w-24 text-zinc-500 text-xs font-bold pt-1.5 uppercase tracking-wider">{label}:</div>
      <div className="flex flex-wrap gap-2 flex-1">
        {options.map((opt: string) => {
          const lowerOpt = opt.toLowerCase();
          const config = MEDIA_MAP[lowerOpt] || { slug: lowerOpt, label: opt };

          const isActive = 
            currentValue?.toLowerCase() === lowerOpt || 
            currentValue?.toLowerCase() === config.slug;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(isTypeMapping ? config.slug : opt)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isActive 
                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-sm" 
                  : "text-zinc-400 hover:text-white border border-transparent hover:bg-white/5"
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