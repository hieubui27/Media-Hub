"use client";

import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getAdminHistory, HistoryItem } from "@/src/services/adminService";

export default function HistoryManager() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminHistory({ page, limit: pagination.pageSize });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "User", dataIndex: "userName" },
    { title: "Viewed Media", dataIndex: "mediaTitle" },
    { title: "Time", dataIndex: "viewedAt", render: (d: string) => new Date(d).toLocaleString() },
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
