// src/components/MyUploads.tsx
"use client";

import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, ConfigProvider, theme, Space, Tag, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getMyUploads, deleteMediaItem } from "@/src/services/media";
import { UpdateMediaModal } from "./common/UpdateMediaModal";
// SỬA QUAN TRỌNG: Thêm dấu { } khi import vì chúng ta dùng Named Export


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";

export default function MyUploads() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await getMyUploads(page, pageSize);
      setData(res.content || []);
      setPagination(prev => ({ ...prev, total: res.totalElements, current: page }));
    } catch (error) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const columns = [
    {
      title: "Poster",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (path: string) => (
        <Avatar shape="square" size={64} src={path ? (path.startsWith('http') ? path : `${BASE_URL}${path}`) : "/images.png"} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* Nút sửa để mở Modal */}
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-violet-400" 
            onClick={() => {
                setEditingId(record.mediaItemId);
                setIsModalOpen(true);
            }} 
          />
          <Popconfirm title="Xóa?" onConfirm={() => deleteMediaItem(record.mediaItemId).then(() => fetchData(pagination.current, pagination.pageSize))}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="mt-12 bg-[#1f1f1f] rounded-2xl p-6">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="mediaItemId"
          pagination={pagination}
          loading={loading}
          onChange={(p: any) => fetchData(p.current, p.pageSize)}
        />

        {/* Render Modal - Đảm bảo component này không phải là undefined/object */}
        <UpdateMediaModal
          mediaId={editingId}
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchData(pagination.current, pagination.pageSize)}
        />
      </div>
    </ConfigProvider>
  );
}