// src/app/main/media/detail/[id]/page.tsx

import Content from "@/src/components/Media/Content";
import Review from "@/src/components/Media/Review";
import { getFilmDetail } from "@/src/services/getFilmDetail";
import HistoryRecorder from "@/src/components/Media/HistoryRecorder";

interface PageProps {
  params: Promise<{ id: string }>;
}

// src/app/main/media/detail/[id]/page.tsx
export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  const film = await getFilmDetail(id);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-20 relative overflow-hidden">
      <HistoryRecorder mediaId={id} />
      {/* Background Blur sử dụng trường thumbnail mới */}
      <div
        className="absolute top-0 left-0 w-full h-[300px] lg:h-[500px] bg-cover bg-center blur-[30px] opacity-30"
        style={{ backgroundImage: `url(${film.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-[1200px] mx-auto px-4 lg:px-6 pt-24 lg:pt-32 relative z-10">
        <Content data={film} />
        <Review mediaId={id.toString()} />
      </div>
    </div>
  );
}