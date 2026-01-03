"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, ArrowRight, Sparkles } from "lucide-react"; // Sử dụng icon từ thư viện bạn đã có

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/main/home');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden selection:bg-violet-500/30">
      
      {/* 1. HIỆU ỨNG NỀN (Ambient Background) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      
      {/* Lưới chấm nhỏ tạo texture */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-[0.03] z-0 pointer-events-none"></div>

      {/* 2. CONTAINER CHÍNH */}
      <div className="relative z-10 w-full max-w-[1100px] p-4 group">
        
        {/* Khung chứa ảnh & nội dung */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
          
          {/* A. Hình ảnh Poster nền */}
          <div className="relative w-full h-full">
            <Image
              src="/images/intro-poster.png" // Đảm bảo đúng tên file trong public/images
              alt="Media Hub Poster"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {/* Lớp phủ Gradient để làm nổi bật chữ bên phải */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/90"></div>
          </div>

          {/* B. Nội dung & Nút bấm (Căn phải) */}
          <div className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col justify-center items-end pr-8 md:pr-16 text-right">
            
            {/* Badge trang trí */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium text-violet-300 mb-4 animate-[fadeIn_1s_ease-out]">
              <Sparkles size={14} />
              <span>Next-Gen Tracking</span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Hub</span>
            </h1>
            
            <p className="text-zinc-400 text-sm md:text-base font-medium max-w-md mb-8 leading-relaxed opacity-0 animate-[slideInRight_0.8s_ease-out_0.2s_forwards]">
              Khám phá, theo dõi và quản lý thế giới giải trí của bạn. 
              <br/>Phim ảnh • Sách • Game • Âm nhạc.
            </p>

            {/* C. Nút Tracking Now */}
            <button
              onClick={handleClick}
              className="group/btn relative flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] opacity-0 animate-[scaleIn_0.5s_ease-out_0.4s_forwards]"
            >
              <span className="relative z-10">TRACKING NOW</span>
              <div className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-violet-600 transition-colors">
                 <Play size={18} fill="currentColor" />
              </div>
            </button>
            
          </div>
        </div>

        {/* Bóng phản chiếu dưới poster */}
        <div className="absolute -bottom-10 inset-x-10 h-20 bg-violet-500/20 blur-3xl rounded-[100%] z-[-1]"></div>
      </div>

      {/* Global Animation Styles (nếu chưa có trong tailwind.config) */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}