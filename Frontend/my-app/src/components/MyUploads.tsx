"use client";

import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, ConfigProvider, theme, Space, Tag, Avatar, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getMyUploads, deleteMediaItem } from "@/src/services/media";
import { UploadHistoryItem } from "@/src/interfaces/uploadHistory";
import Link from "next/link";
import dayjs from "dayjs";

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
      // API page is 0-based
      const res = await getMyUploads(page - 1, pageSize);
      setData(res.content || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: res.totalElements,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load your uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []); // Initial load

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMediaItem(id);
      message.success("Media deleted successfully");
      fetchData(pagination.current, pagination.pageSize); // Reload
    } catch (error) {
      message.error("Failed to delete media");
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "urlItem",
      key: "urlItem",
      width: 100,
      render: (url: string) => (
        <Avatar 
          shape="square" 
          size={64} 
          src={url || "/images.png"} 
          className="border border-white/10 object-cover"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: UploadHistoryItem) => (
        <Link 
          href={`/main/media/detail/${record.MediaItemId}`} 
          className="text-white hover:text-violet-400 font-bold block mb-1"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "typeName",
      key: "typeName",
      width: 120,
      render: (type: string) => (
        <Tag color="geekblue" className="font-bold uppercase">{type}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <span className="text-gray-400 text-sm">
          {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: any, record: UploadHistoryItem) => (
        <Space size="middle">
          {/* View Button */}
          <Link href={`/main/media/detail/${record.MediaItemId}`}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              className="text-gray-400 hover:!text-violet-400" 
            />
          </Link>

          {/* Edit Button (Placeholder functionality) */}
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-500 hover:!text-blue-400"
            onClick={() => message.info("Edit feature coming soon!")}
          />

          {/* Delete Button */}
          <Popconfirm
            title="Delete this media?"
            description="Are you sure to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(record.MediaItemId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              className="hover:bg-red-500/10"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#1f1f1f",
          colorBorderSecondary: "#303030",
          colorPrimary: "#8b5cf6", // violet-500
        },
      }}
    >
      <div className="mt-12 bg-[#1f1f1f] border border-white/5 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Lịch sử đăng bài</h2>
          <Button onClick={() => fetchData(1, pagination.pageSize)}>Refresh</Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="MediaItemId"
          pagination={{
            ...pagination,
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          loading={loading}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span className="text-gray-400">Bạn chưa đăng bài nào</span>}
              />
            ),
          }}
          className="custom-table"
          scroll={{ x: 800 }} // Horizontal scroll on mobile
        />
      </div>
    </ConfigProvider>
  );
}
