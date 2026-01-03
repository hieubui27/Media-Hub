"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getAdminReviews, deleteReview, ReviewItem } from "@/src/services/adminService";

export default function ReviewManager() {
  const [data, setData] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminReviews({ page, limit: pagination.pageSize });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      message.success("Review deleted");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Media", dataIndex: "mediaTitle", width: 200 },
    { title: "User", dataIndex: "userName", width: 150 },
    { 
      title: "Content", 
      dataIndex: "content", 
      render: (txt: string) => (
        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
          {txt}
        </Typography.Paragraph>
      )
    },
    { title: "Date", dataIndex: "createdAt", width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: "Action",
      width: 80,
      render: (_: any, record: ReviewItem) => (
        <Space>
          <Popconfirm title="Delete this review?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        onChange: (page) => fetchData(page),
      }}
    />
  );
}
