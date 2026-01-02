"use client";

import React, { useEffect, useState } from "react";
import { Button, Popconfirm, message, Typography, Tag, Spin } from "antd";
import { DeleteOutlined, ClearOutlined, ClockCircleOutlined } from "@ant-design/icons";
// Thêm clearHistory vào import
import { getHistory, removeFromHistory, clearHistory } from "@/src/services/history"; 
import { HistoryItem, HistoryResponse } from "@/src/interfaces/history";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/src/utils/imageHelper";

const { Text } = Typography;

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res: HistoryResponse = await getHistory();
      setHistory(res.content || []); 
    } catch (error) {
      message.error("Không thể tải lịch sử xem");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (mediaItemId: number) => {
    try {
      await removeFromHistory(mediaItemId);
      setHistory(prev => prev.filter(item => item.mediaItemId !== mediaItemId));
      message.success("Đã xóa khỏi lịch sử");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  // BỔ SUNG: Logic xóa toàn bộ lịch sử
  const handleClearAll = async () => {
    try {
      await clearHistory();
      setHistory([]);
      message.success("Đã dọn sạch lịch sử xem");
    } catch (error) {
      message.error("Không thể xóa toàn bộ lịch sử");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-6 min-h-screen bg-[#0a0a0a]"> {/* Đổi sang #0a0a0a cho tiệp màu nền trang */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Lịch sử xem đây</h1>
        {history.length > 0 && (
          // Bọc nút Xóa tất cả vào Popconfirm
          <Popconfirm
            title="Xóa toàn bộ lịch sử xem?"
            onConfirm={handleClearAll}
            okText="Xóa hết"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<ClearOutlined />}>
              Xóa tất cả
            </Button>
          </Popconfirm>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><Spin size="large" /></div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <ClockCircleOutlined className="text-5xl mb-4 opacity-20" />
          <p className="text-lg">Danh sách lịch sử trống.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {history.map((item) => (
            <div key={item.mediaItemId} className="group relative bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-violet-500/50 transition-all">
              <div className="relative aspect-[16/9]">
               <Image 
  src={`https://8dcbf8a962a3.ngrok-free.app${item.urlItem}`} 
  alt={item.title} 
  fill 
  className="object-cover group-hover:scale-105 transition-transform duration-300"
/>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Popconfirm title="Xóa mục này?" onConfirm={() => handleRemove(item.mediaItemId)}>
                    <Button size="small" danger shape="circle" icon={<DeleteOutlined />} className="shadow-lg" />
                  </Popconfirm>
                </div>
              </div>
              <div className="p-4">
                <Link href={`/main/media/detail/${item.mediaItemId}`}>
                  <Text strong className="!text-white block truncate text-base hover:text-violet-400 transition-colors">
                    {item.title}
                  </Text>
                </Link>
                <div className="flex justify-between items-center mt-3">
                  <Tag color="purple" className="!border-none bg-violet-500/20 !text-violet-400 font-medium">
                    {item.typeName || "Media"}
                  </Tag>
                  <Text className="!text-gray-500 text-[11px] flex items-center gap-1">
                    <ClockCircleOutlined />
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : ""}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}