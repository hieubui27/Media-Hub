"use client";

import React, { useEffect, useState } from "react";
import { Button, Popconfirm, message, Typography, Tag, Spin } from "antd";
import { DeleteOutlined, ClearOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getHistory, removeFromHistory } from "@/src/services/history"; 
import { HistoryItem, HistoryResponse } from "@/src/interfaces/history";
import Image from "next/image";
import Link from "next/link";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const { Text } = Typography;

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // ... rest of state ...

  // ... effects and functions ...

  // Wrap the entire return with ProtectedRoute
  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-[#141414]">
        {/* ... existing JSX content ... */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold text-white">Lịch sử xem đây</h1>
          {history.length > 0 && (
            <Button type="primary" danger icon={<ClearOutlined />}>
              Xóa tất cả
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center mt-20"><Spin size="large" /></div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <ClockCircleOutlined className="text-4xl mb-4" />
            <p>Chưa có lịch sử xem nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {history.map((item) => (
              <div key={item.mediaItemId} className="group relative bg-[#1f1f1f] rounded-lg overflow-hidden border border-[#333]">
                <div className="relative aspect-video">
                  <Image 
                    src={item.urlItem || "/images.png"} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Popconfirm title="Xóa?" onConfirm={() => handleRemove(item.mediaItemId)}>
                      <Button size="small" danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </div>
                <div className="p-3">
                  <Link href={`/main/media/detail/${item.mediaItemId}`}>
                    <Text strong className="!text-white block truncate hover:text-violet-400">
                      {item.title}
                    </Text>
                  </Link>
                  <div className="flex justify-between items-center mt-2">
                    <Tag color="purple" className="capitalize">
                      {item.typeName || "Media"}
                    </Tag>
                    <Text className="!text-gray-500 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : ""}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}