import { MediaItemDetail } from "@/src/interfaces/mediaItemDetail";
import MovieCard from "./FilmItem";


type MediaGridProps = {
  items: MediaItemDetail[]; 
};

export default function MediaGrid({ items }: MediaGridProps) {
  // Xử lý trạng thái trống
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-zinc-500 mt-20 py-10 border border-dashed border-zinc-800 rounded-2xl">
        <p className="text-lg">Không tìm thấy nội dung phù hợp</p>
        <p className="text-sm text-zinc-600">Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
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
        gap-6              /* Tăng gap lên một chút cho thoáng */
      "
    >
      {items.map((item) => (
        // Truyền props 'item' vào card, card sẽ tự lo việc hiển thị theo type
        <MovieCard key={item.MediaItemId} item={item} />
      ))}
    </div>
  );
}