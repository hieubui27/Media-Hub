"use client"
import { Spin, Empty } from "antd";
import Link from 'next/link';
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { searchMedia, MediaItem } from "@/src/services/searchService";
import { useUser } from "@/src/contexts/UserContext";

const navItems = [
    { label: "Home", slug: "home", isGeneral: true }, // Home thường có route riêng
    { label: "Movie", slug: "movie" },
    { label: "Series", slug: "series" },
    { label: "Book", slug: "book" },
    { label: "Game", slug: "game" },
    {label: "Music",slug:"music" }
];

function HeaderNav() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

    // 1. Thêm State để theo dõi trạng thái cuộn
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useUser();

    // 2. Xử lý sự kiện scroll
    useEffect(() => {
        const handleScroll = () => {
            // Nếu cuộn xuống quá 50px thì đổi trạng thái
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup listener khi component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Xử lý tìm kiếm với Debounce (Giữ nguyên)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim()) {
                setLoading(true);
                setShowDropdown(true);
                try {
                    const data = await searchMedia(searchTerm);
                    setResults(data.content || []);
                } catch (error) {
                    console.error("Search error:", error);
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

    // Đóng dropdown khi click ra ngoài (Giữ nguyên)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        // 3. Cập nhật className động dựa trên isScrolled
        <div className={`
            w-full h-20 flex items-center justify-between px-10 fixed top-0 z-[100] text-white
            transition-all duration-300 ease-in-out
            ${isScrolled
                ? "bg-[#141414]/95 shadow-lg backdrop-blur-md py-4" // Màu khi cuộn xuống
                : "bg-transparent py-6" // Màu khi ở trên cùng
            }
        `}>
            <div className="logo font-bold text-2xl tracking-tighter text-purple-500">MEDIA HUB</div>

            <div className="search-bar relative" ref={searchRef}>
                <div style={{ position: 'relative', width: 400 }}>
                    <input
                        type="text"
                        placeholder="Search movies, books, games..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm && setShowDropdown(true)}
                        style={{
                            width: '100%',
                            height: 40,
                            padding: '8px 35px 8px 12px',
                            borderRadius: '20px', // Đổi thành bo tròn cho hiện đại
                            outline: 'none',
                            fontSize: '14px',
                            backgroundColor: isScrolled ? 'rgba(255, 255, 255, .15)' : 'rgba(255, 255, 255, .08)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    />
                </div>

                {/* Dropdown kết quả (Sửa màu text dropdown để khớp với UI mới) */}
                {showDropdown && (
                    <div className="absolute top-[50px] left-0 w-full bg-[#1f1f1f] rounded-lg shadow-2xl z-[100] border border-white/10 max-h-[400px] overflow-y-auto backdrop-blur-xl">
                        {loading ? (
                            <div className="p-10 text-center"><Spin /></div>
                        ) : (
                            <div className="py-2">
                                {results.length > 0 ? (
                                    results.map((item) => (
                                        <Link
                                            key={item.MediaItemId}
                                            href={`/main/media/detail/${item.MediaItemId}`}
                                            className="block px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-none transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black bg-purple-600 px-2 py-0.5 rounded text-white uppercase">{item.typeName}</span>
                                            </div>
                                            <div className="font-semibold text-gray-100">{item.title}</div>
                                            <div className="text-gray-400 text-xs truncate">{item.description}</div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="nav-links flex space-x-8 font-medium">
                {navItems.map((item) => (
                    <Link
                        key={item.slug}
                        // Nếu là home thì về /main/home, còn lại về /main/media/[slug]
                        href={item.isGeneral ? `/main/${item.slug}` : `/main/media/${item.slug}`}
                        className="hover:text-purple-400 transition-colors capitalize"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* User Account Section */}
            {user ? (
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=8b5cf6&color=fff`}
                            alt={user.displayName}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                        />
                        <span className="hidden md:block">{user.displayName}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] rounded-lg shadow-2xl z-[100] border border-white/10 backdrop-blur-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-sm font-semibold text-white">{user.displayName}</p>
                                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                            </div>
                            <Link
                                href="/main/dashboard"
                                className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/main/dashboard/account"
                                className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                Tài khoản
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowUserMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="account bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg">
                    <Link href="/auth/login">Account</Link>
                </div>
            )}
        </div>
    );
}

export default HeaderNav;