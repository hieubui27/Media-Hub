"use client";

import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, ConfigProvider, theme, Space, Tag, Avatar, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getMyUploads, deleteMediaItem } from "@/src/services/media";
import { UploadHistoryItem } from "@/src/interfaces/uploadHistory";
import Link from "next/link";
import dayjs from "dayjs";

// Direct Base URL declaration
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
      // FIX: Do not subtract 1 because Backend uses 1-based indexing as you stated
      const res = await getMyUploads(page, pageSize);
      
      setData(res.content || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: res.totalElements,
      });
    } catch (error) {
      console.error(error);
      message.error("Cannot load upload list");
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
      message.success("Deleted successfully");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "imagePath", // FIX: According to API returning 'imagePath'
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <Link 
          href={`/main/media/detail/${record.mediaItemId}`} // FIX: mediaItemId (lowercase m)
          className="text-white hover:text-violet-400 font-bold"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "mediaType", // FIX: API returns 'mediaType', not 'typeName'
      key: "mediaType",
      render: (type: string) => (
        <Tag color="violet" className="font-bold uppercase">{type}</Tag>
      ),
    },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-400 text-sm">
          {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/main/media/detail/${record.mediaItemId}`}>
            <Button type="text" icon={<EyeOutlined />} className="text-gray-400" />
          </Link>
          <Popconfirm
            title="Delete this upload?"
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
        <h2 className="text-2xl font-bold text-white mb-6">Upload History</h2>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="mediaItemId" // FIX: mediaItemId (lowercase m)
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