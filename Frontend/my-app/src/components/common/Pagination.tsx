"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface PaginationProps {
  currentPage: number; // 1-based: 1, 2, 3...
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();

  // Hàm tạo link: giữ nguyên params cũ (query, filter...), chỉ thay đổi page
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Số lượng nút ở giữa muốn hiển thị
    
    // Đảm bảo current page nằm trong giới hạn hợp lệ để tính toán
    const current = Math.max(1, Math.min(currentPage, totalPages));

    // Tính toán dải start - end
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Điều chỉnh nếu dải hiển thị bị ngắn (ở đoạn cuối)
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 1. Thêm Trang đầu & Dấu ...
    if (startPage > 1) {
      pages.push(
        <PaginationLink key={1} href={createPageURL(1)} active={false}>1</PaginationLink>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="px-2 text-zinc-500 font-bold select-none">...</span>);
      }
    }

    // 2. Thêm Các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationLink 
          key={i} 
          href={createPageURL(i)} 
          active={i === current}
        >
          {i}
        </PaginationLink>
      );
    }

    // 3. Thêm Trang cuối & Dấu ...
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="px-2 text-zinc-500 font-bold select-none">...</span>);
      }
      pages.push(
        <PaginationLink 
          key={totalPages} 
          href={createPageURL(totalPages)} 
          active={false}
        >
          {totalPages}
        </PaginationLink>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8 select-none">
      {/* Nút Previous */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage <= 1 
            ? "text-zinc-600 cursor-not-allowed pointer-events-none bg-zinc-900" 
            : "text-white bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        <LeftOutlined />
      </Link>

      {/* Dãy số trang */}
      <div className="flex items-center gap-1 mx-2">
        {renderPageNumbers()}
      </div>

      {/* Nút Next */}
      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage >= totalPages
            ? "text-zinc-600 cursor-not-allowed pointer-events-none bg-zinc-900" 
            : "text-white bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        <RightOutlined />
      </Link>
    </div>
  );
};

// Component con để hiển thị từng ô số cho gọn code
const PaginationLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
  <Link
    href={href}
    className={`
      min-w-[40px] h-10 px-3 flex items-center justify-center rounded-full text-sm font-bold transition-all
      ${active 
        ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] scale-110" 
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}
    `}
  >
    {children}
  </Link>
);

export default Pagination;