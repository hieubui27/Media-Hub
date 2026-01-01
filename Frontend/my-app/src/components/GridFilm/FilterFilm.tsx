"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const [options, setOptions] = useState<FilterOptions>({
    genres: [],
    countries: [],
    types: []
  });

  // Initialize state filters directly from props
  const [filters, setFilters] = useState({
    type: currentType,
    genre: currentGenre || "All",
    country: currentCountry || "All",
    year: "All",
  });

  // Solution for ESLint: Sync state when props change without using useEffect directly
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
      genre: currentGenre || "All",
      country: currentCountry || "All",
      year: "All"
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
    if (filters.genre !== "All") params.set("genre", filters.genre);
    if (filters.country !== "All") params.set("country", filters.country);
    
    setIsOpen(false);
    router.push(`/main/media/search?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-zinc-400 hover:text-white font-bold text-sm mb-4">
        <span className={`mr-2 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        Advanced Filters
      </button>

      {isOpen && (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 shadow-2xl">
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
            <button onClick={handleApplyFilter} className="bg-violet-500 hover:bg-violet-600 text-black font-bold py-2 px-6 rounded-full text-sm">
              Apply Filters →
            </button>
            <button onClick={() => setIsOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-full text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Define Interface to eliminate TypeScript "Implicit Any" errors
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
                  ? "bg-violet-500/10 text-violet-500 border border-violet-500/20 shadow-sm" 
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
