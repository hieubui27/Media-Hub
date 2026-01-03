"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Rate } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getAdminRatings, deleteRating, RatingItem } from "@/src/services/adminService";

export default function RatingManager() {
  const [data, setData] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminRatings({ page, limit: pagination.pageSize });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRating(id);
      message.success("Rating deleted");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Media", dataIndex: "mediaTitle" },
    { title: "User", dataIndex: "userName" },
    { 
      title: "Rating", 
      dataIndex: "rating", 
      render: (val: number) => <Rate disabled defaultValue={val} style={{ fontSize: 14 }} />
    },
    { title: "Date", dataIndex: "createdAt", render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: "Action",
      render: (_: any, record: RatingItem) => (
        <Space>
          <Popconfirm title="Delete this rating?" onConfirm={() => handleDelete(record.id)}>
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
