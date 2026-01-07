"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchFilterOptions } from "@/src/services/getGenres";

// 1. Đảm bảo đủ 5 loại Media chuẩn
const MEDIA_MAP: Record<string, { slug: string; label: string }> = {
  "movie": { slug: "movie", label: "Movies" },
  "tv series": { slug: "series", label: "TV Series" },
  "video game": { slug: "game", label: "Video Games" },
  "book": { slug: "book", label: "Books" },
  "music": { slug: "music", label: "Music" },
  "all": { slug: "all", label: "All" }
};

// 2. Danh sách quốc gia phổ biến hơn
const EXTRA_COUNTRIES = [
  "Vietnam", "USA", "Japan", "Korea", "China", "UK", "France", "Germany", 
  "India", "Thailand", "Spain", "Italy", "Canada", "Australia", "Hong Kong"
];

// 3. Danh sách thể loại tổng hợp từ tất cả các loại Media
const ALL_GENRES = Array.from(new Set([
  // Movies & TV
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", 
  "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western",
  "Reality", "Talk", "Soap",
  // Books
  "Fiction", "Non-fiction", "Biography", "Children's", "Young Adult", "Classic",
  // Video Games
  "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle", "Shooter", "Survival",
  // Music
  "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Soul", "Folk"
])).sort();

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
  const searchParams = useSearchParams();

  const [options, setOptions] = useState<FilterOptions>({
    genres: ALL_GENRES, // Sử dụng danh sách đầy đủ làm mặc định
    countries: EXTRA_COUNTRIES,
    types: ["Movie", "TV Series", "Book", "Video Game", "Music"]
  });

  const [filters, setFilters] = useState({
    type: currentType || "all",
    genre: currentGenre || "All",
    country: currentCountry || "All",
  });

  useEffect(() => {
    setFilters({
      type: currentType || "all",
      genre: currentGenre || "All",
      country: currentCountry || "All",
    });
  }, [currentType, currentGenre, currentCountry]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchFilterOptions();
        // Hợp nhất dữ liệu từ API với dữ liệu cứng để đảm bảo tính đầy đủ
        setOptions({
          types: ["Movie", "TV Series", "Book", "Video Game", "Music"], // Luôn giữ 5 loại này
          genres: Array.from(new Set([...ALL_GENRES, ...(data.genres || [])])).sort(),
          countries: Array.from(new Set([...EXTRA_COUNTRIES, ...(data.countries || [])])).sort()
        });
      } catch (err) {
        console.error("Failed to load options, using defaults");
      }
    };
    loadOptions();
  }, []);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    const currentQuery = searchParams.get("query");
    if (currentQuery) params.set("query", currentQuery);

    const lowerType = filters.type.toLowerCase();
    const typeSlug = MEDIA_MAP[lowerType]?.slug || lowerType;

    if (typeSlug !== "all") params.set("type", typeSlug);
    if (filters.genre !== "All") params.set("genre", filters.genre);
    if (filters.country !== "All") params.set("country", filters.country);
    
    params.set("page", "1");
    setIsOpen(false);
    router.push(`/main/media/search?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-zinc-400 hover:text-white font-bold text-sm mb-4 transition-colors">
        <span className={`mr-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        Advanced Filters
      </button>

      {isOpen && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-6">
            <FilterRow 
              label="Category" 
              options={["All", ...options.types]}
              currentValue={filters.type} 
              onChange={(val: string) => setFilters({...filters, type: val})}
              isTypeMapping={true} 
            />
            
            <FilterRow 
              label="Country" 
              options={["All", ...options.countries]}
              currentValue={filters.country}
              onChange={(val: string) => setFilters({...filters, country: val})}
            />

            <FilterRow 
              label="Genre" 
              options={["All", ...options.genres]}
              currentValue={filters.genre}
              onChange={(val: string) => setFilters({...filters, genre: val})}
            />
          </div>

          <div className="flex mt-8 pt-6 border-t border-white/5 space-x-4">
            <button onClick={handleApplyFilter} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-all shadow-lg hover:shadow-violet-900/20">
              Apply Filters
            </button>
            <button onClick={() => {
              setFilters({ type: "all", genre: "All", country: "All" });
              // Optional: redirect to clear search
            }} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-all">
              Reset
            </button>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white text-sm font-medium">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="w-24 text-zinc-500 text-[10px] font-bold pt-2 uppercase tracking-widest shrink-0">{label}:</div>
      <div className="flex flex-wrap gap-1.5 flex-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
        {options.map((opt: string) => {
          const lowerOpt = opt.toLowerCase();
          const config = MEDIA_MAP[lowerOpt] || { slug: lowerOpt, label: opt };
          
          // Logic để xác định nút nào đang active
          const isActive = isTypeMapping 
            ? (currentValue?.toLowerCase() === config.slug || currentValue === opt)
            : (currentValue === opt);

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(isTypeMapping ? config.slug : opt)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                isActive 
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/20" 
                  : "text-zinc-400 bg-zinc-800/40 hover:text-white hover:bg-zinc-700 border border-white/5"
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