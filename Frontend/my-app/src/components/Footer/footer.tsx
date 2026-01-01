"use client"
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-6">
            <div className="text-2xl font-black tracking-tighter text-violet-500">
              MEDIA HUB
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng chia sẻ và theo dõi thông tin giải trí hàng đầu. 
              Nơi cập nhật những bộ phim, cuốn sách và trò chơi mới nhất dành cho bạn.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-violet-600 transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-violet-600 transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-violet-600 transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-violet-600 transition-colors">
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <h4 className="text-lg font-bold mb-6">Khám phá</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/main/home" className="hover:text-violet-400 transition-colors">Trang chủ</Link></li>
              <li><Link href="/main/movie" className="hover:text-violet-400 transition-colors">Phim điện ảnh</Link></li>
              <li><Link href="/main/series" className="hover:text-violet-400 transition-colors">Phim bộ</Link></li>
              <li><Link href="/main/book" className="hover:text-violet-400 transition-colors">Sách & Truyện</Link></li>
              <li><Link href="/main/game" className="hover:text-violet-400 transition-colors">Trò chơi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Pháp lý */}
          <div>
            <h4 className="text-lg font-bold mb-6">Thông tin</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Trung tâm hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-lg font-bold mb-6">Liên hệ</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-violet-500 shrink-0" />
                <span>Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-violet-500 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-violet-500 shrink-0" />
                <span>contact@mediahub.vn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Thanh bản quyền */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} <span className="text-violet-500 font-bold">Media Hub</span>. Toàn bộ quyền được bảo lưu.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors">Vietnam</span>
            <span className="hover:text-white cursor-pointer transition-colors">English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;