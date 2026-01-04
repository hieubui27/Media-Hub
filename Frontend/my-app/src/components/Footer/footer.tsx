"use client"
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="text-2xl font-black tracking-tighter text-violet-500">
              MEDIA HUB
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading entertainment information sharing and tracking platform.
              Update the latest movies, books and games for you.
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

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Discover</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/main/home" className="hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link href="/main/media/movie" className="hover:text-violet-400 transition-colors">Movies</Link></li>
              <li><Link href="/main/media/series" className="hover:text-violet-400 transition-colors">TV Series</Link></li>
              <li><Link href="/main/media/book" className="hover:text-violet-400 transition-colors">Books</Link></li>
              <li><Link href="/main/media/game" className="hover:text-violet-400 transition-colors">Games</Link></li>
            </ul>
          </div>
          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-violet-500 shrink-0" />
                <span>Hanoi, Vietnam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-violet-500 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-violet-500 shrink-0" />
                <span>abcdef@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} <span className="text-violet-500 font-bold">Media Hub</span>. All rights reserved.
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