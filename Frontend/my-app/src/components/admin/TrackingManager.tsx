"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getAdminTracking, deleteTracking, TrackingItem } from "@/src/services/adminService";

export default function TrackingManager() {
  const [data, setData] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminTracking({ 
        page, 
        limit: pagination.pageSize,
        status: statusFilter !== "all" ? statusFilter : undefined 
      });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Failed to load tracking records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      await deleteTracking(id);
      message.success("Record deleted");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "User", dataIndex: "userName" },
    { title: "Media", dataIndex: "mediaTitle" },
    { 
      title: "Status", 
      dataIndex: "status", 
      render: (status: string) => {
        let color = "default";
        if (status === "WATCHING") color = "processing";
        if (status === "WATCHED") color = "success";
        if (status === "PLAN_TO_WATCH") color = "warning";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: "Rating", dataIndex: "rating", render: (r: number) => r ? `${r}/5` : "-" },
    { title: "Comment", dataIndex: "comment", ellipsis: true },
    {
      title: "Action",
      render: (_: any, record: TrackingItem) => (
        <Space>
          <Popconfirm title="Delete record?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Select defaultValue="all" style={{ width: 150 }} onChange={setStatusFilter}>
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="WATCHING">Watching</Select.Option>
          <Select.Option value="WATCHED">Watched</Select.Option>
          <Select.Option value="PLAN_TO_WATCH">Plan to Watch</Select.Option>
        </Select>
      </div>
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
    </div>
  );
}
