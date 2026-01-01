"use client"
import { Spin, Empty } from "antd";
import Link from 'next/link';
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { searchMedia, MediaItem } from "@/src/services/searchService";
import { useUser } from "@/src/contexts/UserContext";
import { Menu, X, Search, Smartphone, User, ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react"; 

const navItems = [
    { label: "Home", slug: "home", isGeneral: true },
    { label: "Movies", slug: "movie" },
    { label: "TV Series", slug: "series" },
    { label: "Books", slug: "book" },
    { label: "Games", slug: "game" },
    { label: "Music", slug: "music" }
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

    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useUser();

    // Handle scroll to change header background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle search with Debounce
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

    // Close menu when clicking outside
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
        <>
            <nav className={`
                w-full h-20 flex items-center justify-between px-4 xl:px-10 fixed top-0 z-[100] text-white
                transition-all duration-300 ease-in-out
                ${isScrolled || isSearchOpen ? "bg-[#141414] shadow-lg" : "bg-transparent"}
            `}>
                {isSearchOpen ? (
                    /* --- FULL SCREEN SEARCH UI (MOBILE) --- */
                    <div className="flex items-center w-full gap-3 animate-in fade-in zoom-in duration-200" ref={searchRef}>
                        <div className="relative flex-1 flex items-center bg-white/10 rounded-lg border border-white/20 px-3">
                            <Search size={20} className="text-zinc-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search movies, actors..."
                                className="w-full bg-transparent h-10 px-3 outline-none text-sm text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} className="p-2 text-red-500 hover:bg-white/5 rounded-full">
                            <X size={24} />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Hamburger Button (Mobile) */}
                        <button onClick={() => setIsMenuOpen(true)} className="xl:hidden p-2">
                            <Menu size={28} />
                        </button>

                        <div className="logo font-black text-xl xl:text-2xl tracking-tighter text-violet-500 uppercase">
                            Media Hub
                        </div>

                        {/* --- SEARCH BAR ON DESKTOP --- */}
                        <div className="search-bar relative hidden xl:block" ref={searchRef}>
                            <div className="relative w-[300px] 2xl:w-[450px]">
                                <input
                                    type="text"
                                    placeholder="Search movies, books, games..."
                                    className="w-full h-10 px-4 pr-10 rounded-full outline-none text-sm transition-all border border-white/10"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        color: '#fff'
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => searchTerm.trim() && setShowDropdown(true)}
                                />
                                <Search className="absolute right-3 top-2.5 text-zinc-400" size={18} />
                            </div>

                            {/* Search results dropdown (Desktop) */}
                            {showDropdown && (
                                <div className="absolute top-12 left-0 w-full bg-[#1f1f1f] rounded-2xl shadow-2xl z-[110] border border-white/10 max-h-[450px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                    {loading ? (
                                        <div className="p-10 text-center"><Spin /></div>
                                    ) : (
                                        <div className="py-2">
                                            {results.length > 0 ? (
                                                results.map((item) => (
                                                    <Link
                                                        key={item.MediaItemId}
                                                        href={`/main/media/detail/${item.MediaItemId}`}
                                                        className="block px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-none transition-colors"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-black bg-violet-600 px-2 py-0.5 rounded text-white uppercase">{item.typeName}</span>
                                                        </div>
                                                        <div className="font-bold text-gray-100 text-sm">{item.title}</div>
                                                        <div className="text-zinc-500 text-xs truncate">{item.description}</div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No results found" /></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Nav Links Desktop */}
                        <div className="hidden xl:flex space-x-8 font-medium">
                            {navItems.map((item) => (
                                <Link key={item.slug} href={item.isGeneral ? `/main/${item.slug}` : `/main/media/${item.slug}`} className="hover:text-violet-400 transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSearchOpen(true)} className="xl:hidden p-2">
                                <Search size={24} />
                            </button>

                            {/* --- ACCOUNT SECTION --- */}
                            <div className="hidden xl:block relative" ref={userMenuRef}>
                                {user ? (
                                    <>
                                        <button 
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-3 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-full font-bold transition-all transform active:scale-95 shadow-lg"
                                        >
                                            <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-white/20" alt="" />
                                            <span>{user.displayName}</span>
                                            <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu User */}
                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-3 w-60 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="px-4 py-3 border-b border-white/5 mb-1">
                                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Welcome</p>
                                                    <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                                                </div>
                                                <Link href="/main/dashboard/account" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                                                    <User size={16} /> Personal Information
                                                </Link>
                                                <Link href="/main/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                                                    <LayoutDashboard size={16} /> Dashboard Management
                                                </Link>
                                                <button 
                                                    onClick={() => { logout(); setShowUserMenu(false); }}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                                                >
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-full font-bold transition-all shadow-lg block">
                                        Account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Sidebar Mobile */}
            <div className={`fixed inset-0 bg-black/60 z-[200] xl:hidden transition-opacity ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)} />
            <div className={`fixed top-0 left-0 w-[85%] max-w-[320px] h-full bg-[#1a233a] z-[201] xl:hidden flex flex-col transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <button onClick={() => setIsMenuOpen(false)} className="text-zinc-400"><X size={28} /></button>
                    <div className="logo font-black text-xl text-violet-500 uppercase">Media Hub</div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <Link href={user ? "/main/dashboard/account" : "/auth/login"} className="flex items-center justify-center gap-3 w-full bg-white text-[#1a233a] py-3 rounded-full font-bold">
                        <User size={18} /> {user ? user.displayName : "Member"}
                    </Link>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        {navItems.map((item) => (
                            <Link key={item.slug} href={item.isGeneral ? `/main/${item.slug}` : `/main/media/${item.slug}`} className="text-white font-bold text-sm" onClick={() => setIsMenuOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderNav;