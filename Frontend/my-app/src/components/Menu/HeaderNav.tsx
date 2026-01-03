"use client";
import { Spin, Empty } from "antd";
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import { searchMedia, MediaItem } from "@/src/services/searchService";
import { useUser } from "@/src/contexts/UserContext";
import { Menu, X, Search, User, ChevronDown, LayoutDashboard, LogOut, Home, PlayCircle, Book, Gamepad2, Music } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";

const navItems = [
    { label: "Home", slug: "home", isGeneral: true, icon: <Home size={18} /> },
    { label: "Movies", slug: "movie", icon: <PlayCircle size={18} /> },
    { label: "TV Series", slug: "series", icon: <PlayCircle size={18} /> },
    { label: "Books", slug: "book", icon: <Book size={18} /> },
    { label: "Games", slug: "game", icon: <Gamepad2 size={18} /> },
    { label: "Music", slug: "music", icon: <Music size={18} /> }
];

function HeaderNav() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

    const { user, logout } = useUser();
    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Xử lý ảnh an toàn (Avatar & Thumbnail)
    const getSafeUrl = (path?: string) => {
        if (!path) return "/images/default-thumbnail.jpg";
        return path.startsWith("http") ? path : `${BASE_URL}${path}`;
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim()) {
                setLoading(true);
                setShowDropdown(true);
                try {
                    const data = await searchMedia(searchTerm);
                    setResults(data.content || []);
                } catch (error) {
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowDropdown(false);
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setShowUserMenu(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- COMPONENT CON: KẾT QUẢ TÌM KIẾM ---
    const SearchResultsList = ({ isMobile = false }) => (
        <div className={`bg-[#1f1f1f] border border-white/10 shadow-2xl overflow-y-auto z-[120] 
            ${isMobile ? 'w-full mt-4 rounded-xl max-h-[60vh]' : 'absolute top-12 left-0 w-full rounded-2xl max-h-[400px]'}`}>
            {loading ? (
                <div className="p-8 text-center"><Spin /></div>
            ) : results.length > 0 ? (
                <div className="py-2">
                    {results.map((item, index) => {
                        // FIX LỖI KEY: Ưu tiên mediaItemId (m thường) từ Postman
                        const finalId = item.MediaItemId;
                        const finalKey = finalId || `search-key-${index}`;

                        return (
                            <Link
                                key={finalKey}
                                href={`/main/media/detail/${finalId}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-violet-500/10 border-b border-white/5 last:border-none transition-colors group"
                                onClick={() => { setShowDropdown(false); setIsSearchOpen(false); setSearchTerm(""); }}
                            >
                                <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                        src={getSafeUrl(item.imagePath || item.urlItem)} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                        alt="" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[9px] font-black bg-violet-600 px-1.5 py-0.5 rounded text-white uppercase">
                                        {item.typeName || item.typeName || 'Media'}
                                    </span>
                                    <div className="font-bold text-gray-100 text-sm truncate group-hover:text-violet-400 transition-colors">{item.title}</div>
                                    <div className="text-zinc-500 text-xs truncate">{item.description}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="p-6 text-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-zinc-500">Không tìm thấy kết quả</span>} /></div>
            )}
        </div>
    );

    return (
        <>
            <nav className={`w-full h-16 xl:h-20 flex items-center justify-between px-4 xl:px-10 fixed top-0 z-[100] transition-all duration-300 ${isScrolled || isSearchOpen ? "bg-[#141414]/95 backdrop-blur-md shadow-xl" : "bg-transparent"}`}>
                
                {isSearchOpen ? (
                    /* --- MOBILE SEARCH ACTIVE --- */
                    <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="relative flex-1 flex items-center bg-white/10 rounded-full border border-white/10 px-4">
                            <Search size={18} className="text-zinc-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Tìm kiếm phim, sách, game..."
                                className="w-full bg-transparent h-10 px-3 outline-none text-sm text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} className="text-zinc-400 font-medium text-sm">Hủy</button>
                        {searchTerm && <div className="fixed top-16 left-0 w-full px-4 h-screen bg-black/60 backdrop-blur-sm"><SearchResultsList isMobile /></div>}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMenuOpen(true)} className="xl:hidden p-2 -ml-2 text-white"><Menu size={26} /></button>
                            {/* --- THAY ĐỔI Ở ĐÂY: Dùng Link cho Logo --- */}
                            <Link href="/main/home" className="logo font-black text-lg xl:text-2xl tracking-tighter text-violet-500 uppercase cursor-pointer hover:text-violet-400 transition-colors">
                                MEDIA HUB
                            </Link>
                        </div>

                        <div className="hidden xl:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link key={item.slug} href={item.isGeneral ? `/main/${item.slug}` : `/main/media/${item.slug}`} className="text-zinc-400 hover:text-white font-semibold text-sm transition-colors uppercase tracking-wider">
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 xl:gap-5">
                            <div className="hidden xl:block relative" ref={searchRef}>
                                <div className="relative w-64 2xl:w-80 group">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm nhanh..."
                                        className="w-full h-9 px-4 pr-10 rounded-full bg-white/5 border border-white/10 outline-none text-sm focus:bg-white/10 focus:border-violet-500/50 transition-all text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                    />
                                    <Search className="absolute right-3 top-2.5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={16} />
                                </div>
                                {showDropdown && searchTerm && <SearchResultsList />}
                            </div>

                            <button onClick={() => setIsSearchOpen(true)} className="xl:hidden p-2 text-white"><Search size={22} /></button>

                            <div className="hidden xl:block relative" ref={userMenuRef}>
                                {user ? (
                                    <div className="relative">
                                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 p-1 pr-3 rounded-full transition-all">
                                            <img src={getSafeUrl(user.avatar)} className="w-7 h-7 rounded-full object-cover border border-white/10" alt="" />
                                            <span className="text-sm font-bold text-gray-200">{user.displayName}</span>
                                            <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-3 w-52 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
                                                <Link href="/main/dashboard/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"><User size={16} /> Thông tin cá nhân</Link>
                                                <Link href="/main/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"><LayoutDashboard size={16} /> Quản lý nội dung</Link>
                                                <button onClick={() => logout()} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors border-t border-white/5 mt-1"><LogOut size={16} /> Đăng xuất</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/auth/login" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-1.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-violet-500/20">Đăng nhập</Link>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* --- SIDEBAR MOBILE --- */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] xl:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)} />
            <aside className={`fixed top-0 left-0 w-[300px] h-full bg-[#0f0f0f] z-[201] xl:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-5 flex items-center justify-between border-b border-white/5">
                    {/* --- THAY ĐỔI Ở ĐÂY: Dùng Link cho Logo Mobile --- */}
                    <Link href="/main/home" onClick={() => setIsMenuOpen(false)} className="logo font-black text-xl text-violet-500">MEDIA HUB</Link>
                    <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500"><X size={26} /></button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    {user ? (
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={getSafeUrl(user.avatar)} className="w-12 h-12 rounded-full border-2 border-violet-500/30" alt="" />
                                <div className="min-w-0">
                                    <p className="text-white font-bold truncate">{user.displayName}</p>
                                    <p className="text-zinc-500 text-xs truncate">@{user.displayName}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/main/dashboard/account" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 py-2 rounded-lg text-xs font-bold text-white"><User size={14} /> Hồ sơ</Link>
                                <Link href="/main/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 py-2 rounded-lg text-xs font-bold text-white"><LayoutDashboard size={14} /> Dashboard</Link>
                            </div>
                            <button onClick={() => logout()} className="w-full mt-2 flex items-center justify-center gap-2 text-red-400 py-2 text-xs font-bold border border-red-400/10 rounded-lg"><LogOut size={14} /> Đăng xuất</button>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full bg-violet-600 text-white py-3 rounded-xl font-bold mb-8 shadow-lg shadow-violet-500/20">Đăng nhập ngay</Link>
                    )}

                    <div className="space-y-1">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-4">Khám phá</p>
                        {navItems.map((item) => (
                            <Link 
                                key={item.slug} 
                                href={item.isGeneral ? `/main/${item.slug}` : `/main/media/${item.slug}`} 
                                className="flex items-center gap-4 text-zinc-300 hover:text-white hover:bg-violet-500/10 px-4 py-3 rounded-xl transition-all font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="text-violet-500">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default HeaderNav;