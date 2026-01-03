"use client";

import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, ConfigProvider, theme, Space, Tag, Avatar, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getMyUploads, deleteMediaItem } from "@/src/services/media";
import { UploadHistoryItem } from "@/src/interfaces/uploadHistory";
import Link from "next/link";
import dayjs from "dayjs";

// Khai báo Base URL trực tiếp
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app";

export default function MyUploads() {
  const [data, setData] = useState<UploadHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      // SỬA: Không trừ 1 vì Backend dùng 1-based indexing như bạn đã nêu
      const res = await getMyUploads(page, pageSize);
      
      setData(res.content || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: res.totalElements,
      });
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMediaItem(id);
      message.success("Xóa thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "imagePath", // SỬA: Theo ảnh API trả về 'imagePath'
      key: "imagePath",
      width: 100,
      render: (path: string) => {
        const posterUrl = path 
          ? (path.startsWith('http') ? path : `${BASE_URL}${path}`) 
          : "/images.png";
        return (
          <Avatar 
            shape="square" 
            size={64} 
            src={posterUrl} 
            className="border border-white/10 object-cover"
          />
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <Link 
          href={`/main/media/detail/${record.mediaItemId}`} // SỬA: mediaItemId (chữ m thường)
          className="text-white hover:text-violet-400 font-bold"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Loại",
      dataIndex: "mediaType", // SỬA: API trả về 'mediaType', không phải 'typeName'
      key: "mediaType",
      render: (type: string) => (
        <Tag color="violet" className="font-bold uppercase">{type}</Tag>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-400 text-sm">
          {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/main/media/detail/${record.mediaItemId}`}>
            <Button type="text" icon={<EyeOutlined />} className="text-gray-400" />
          </Link>
          <Popconfirm
            title="Xóa bài đăng?"
            onConfirm={() => handleDelete(record.mediaItemId)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="mt-12 bg-[#1f1f1f] rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Lịch sử đăng bài</h2>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="mediaItemId" // SỬA: mediaItemId (chữ m thường)
          pagination={{
            ...pagination,
            position: ["bottomCenter"],
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    </ConfigProvider>
  );
}