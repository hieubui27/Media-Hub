export interface APIMediaItem {
  MediaItemId: number;
  title: string;
  description: string;
  genres: string[];
  typeName: "TV Series" | "Movie" | "Video Game" | "Music" | "Book"; // String literal types
  releaseDate: string;
  urlItem: string | null;
  country: string;
  // Các trường riêng cho TV Series
  totalEpisodes?: number;
  totalSeasons?: number;
  creator?: string;
  productionCompany?: string;
  contentRating?: string;
  author?: string;
  pageCount?: number;
  publisher?: string;
  developer?: string;
  platforms?: string[];
  // Fields for Music
  album?: string;
  artist?: string;
  composer?: string;
  language?: string;
  trackNumber?: number;
}