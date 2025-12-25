"use client"
import React, { useRef } from 'react';
import { Carousel } from 'antd';
import { PlayCircleFilled, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';

const movies = [
  {
    id: 1,
    title: "SISU",
    subtitle: "GIÀ GÂN BÁO THÙ",
    imdb: "7.1",
    year: "2022",
    duration: "1h 31m",
    quality: "2K",
    genres: ["Hành động", "Chiến tranh", "Gây cấn"],
    description: "Tưởng chừng đã giải nghệ sau khi mất tất cả, một cựu lính đặc nhiệm vô tình tìm thấy vàng. Tuy nhiên, một toán lính Phát xít đã phát hiện và âm mưu cướp lấy...",
    bgImage: "https://media-cache.cinematerial.com/p/500x/rf7gbnic/sisu-key-art.jpg?v=1677977135",
  },
  {
    id: 2,
    title: "John Wick: Chapter 4",
    subtitle: "SÁT THỦ JOHN WICK 4",
    imdb: "7.7",
    year: "2023",
    duration: "2h 49m",
    quality: "4K",
    genres: ["Hành động", "Tội phạm", "Gây cấn"],
    description: "John Wick khám phá ra con đường để đánh bại High Table. Nhưng trước khi có thể kiếm được sự tự do, anh phải đối đầu với một kẻ thù mới với những liên minh hùng mạnh trên toàn cầu.",
    bgImage: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
  },
  {
    id: 3,
    title: "Oppenheimer",
    subtitle: "OPPENHEIMER",
    imdb: "8.4",
    year: "2023",
    duration: "3h 00m",
    quality: "4K",
    genres: ["Tiểu sử", "Chính kịch", "Lịch sử"],
    description: "Bộ phim kể về cuộc đời của nhà vật lý lý thuyết J. Robert Oppenheimer, người đứng đầu Dự án Manhattan sản xuất vũ khí hạt nhân đầu tiên trong Thế chiến thứ II.",
    bgImage: "https://image.tmdb.org/t/p/original/eaynD4xAZutZ4ZTnT2LNPJeU8rv.jpg",
  },
  {
    id: 4,
    title: "Avatar: The Way of Water",
    subtitle: "AVATAR: DÒNG CHẢY CỦA NƯỚC",
    imdb: "7.6",
    year: "2022",
    duration: "3h 12m",
    quality: "4K",
    genres: ["Khoa học viễn tưởng", "Hành động", "Phiêu lưu"],
    description: "Jake Sully sống cùng gia đình mới thành lập của mình trên hành tinh Pandora. Khi một mối đe dọa quen thuộc quay trở lại, Jake phải hợp tác với Neytiri và quân đội Na'vi để bảo vệ hành tinh.",
    bgImage: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  },
  {
    id: 5,
    title: "Dune: Part Two",
    subtitle: "HÀNH TINH CÁT: PHẦN HAI",
    imdb: "8.6",
    year: "2024",
    duration: "2h 46m",
    quality: "4K",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Hành động"],
    description: "Paul Atreides hợp nhất với Chani và người Fremen trên con đường trả thù những kẻ đã hủy hoại gia đình mình. Anh phải lựa chọn giữa tình yêu và số phận của vũ trụ.",
    bgImage: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
  },
];

function CarouselTop() {
  const carouselRef = useRef(null);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      <Carousel autoplay effect="fade" ref={carouselRef} dots={false} speed={800}>
        {movies.map((movie) => (
          <div key={movie.id} className="relative h-[650px] w-full group outline-none">
            
            {/* LỚP 1: NỀN BLUR CỰC MẠNH (Background Fade) */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center blur-[80px] scale-125 opacity-60"
                style={{ backgroundImage: `url(${movie.bgImage})` }}
              ></div>
              
              {/* LỚP PHỦ "KHUNG" ĐỂ BLUR VỀ MÀU NỀN (Vignette Effect) */}
              {/* Lớp này tạo bóng đổ từ 4 cạnh vào trong để mất viền sắc cạnh */}
              <div className="absolute inset-0 z-10 
                shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] 
                bg-gradient-to-b from-black/60 via-transparent to-black 
                bg-gradient-to-r from-black/80 via-transparent to-black/80">
              </div>
            </div>

            {/* LỚP 2: NỘI DUNG CHÍNH (Content & Main Image) */}
            <div className="relative z-20 h-full max-w-7xl mx-auto flex items-center px-8 md:px-12">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                
                {/* Text Content */}
                <div className="md:col-span-7 lg:col-span-8 text-white space-y-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-2xl">
                      {movie.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-yellow-500 uppercase tracking-[0.2em] mb-4">
                      {movie.subtitle}
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-6 items-center text-sm">
                      <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">IMDb {movie.imdb}</span>
                      <span className="border border-white/40 px-2 py-0.5 rounded bg-white/10 backdrop-blur-md">{movie.quality}</span>
                      <span className="text-gray-300 font-semibold">{movie.year}</span>
                      <span className="text-gray-300">{movie.duration}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-gray-300">{movie.genres.join(" • ")}</span>
                    </div>

                    <p className="text-gray-300 text-base md:text-lg max-w-2xl line-clamp-3 mb-8 leading-relaxed">
                      {movie.description}
                    </p>

                    <div className="flex gap-4 items-center">
                      <button className="flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3.5 rounded-full font-black transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95">
                        <PlayCircleFilled className="text-2xl" /> XEM PHIM
                      </button>
                      <button className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all text-white">
                        <HeartOutlined className="text-xl" />
                      </button>
                      <button className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all text-white">
                        <InfoCircleOutlined className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Poster Image (Optional - Giống hình bạn gửi) */}
                <div className="hidden md:block md:col-span-5 lg:col-span-4">
                  <div className="relative group/poster rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                     <img 
                        src={movie.bgImage} 
                        alt={movie.title} 
                        className="w-full h-[450px] object-cover scale-105 group-hover/poster:scale-100 transition-transform duration-700" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Thumbnail Nav (Bên dưới góc phải) */}
            <div className="absolute bottom-8 right-12 z-30 flex gap-3">
              {movies.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => carouselRef.current?.goTo(idx)}
                  className={`w-20 h-12 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl ${
                    idx === movie.id - 1 ? 'border-yellow-500 scale-110' : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={m.bgImage} alt="thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselTop;