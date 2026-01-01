import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";
import MovieCard from "./FilmItem";


type MediaGridProps = {
  items: MediaItemDetail[]; 
};

export default function MediaGrid({ items }: MediaGridProps) {
  // Handle empty state
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-zinc-500 mt-20 py-10 border border-dashed border-zinc-800 rounded-2xl">
        <p className="text-lg">No content found</p>
        <p className="text-sm text-zinc-600">Please try again with different keywords or categories.</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2        /* Mobile */
        sm:grid-cols-3     /* Tablet */
        md:grid-cols-4     /* Small Laptop */
        lg:grid-cols-5     /* Desktop */
        xl:grid-cols-6     /* Large Screen */
        gap-6              /* Increased gap for better spacing */
      "
    >
      {items.map((item) => (
        // Pass 'item' props to card, card will handle display based on type
        <MovieCard key={item.MediaItemId} item={item} />
      ))}
    </div>
  );
}
