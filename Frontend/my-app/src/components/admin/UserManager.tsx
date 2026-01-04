"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  SecurityScanOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  getAdminUsers,
  toggleUserStatus,
  promoteUser,
  demoteUser,
  UserItem,
} from "@/src/services/adminService";

export default function UserManager() {
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      if (res?.content) {
        setData(res.content);
        setPagination((prev) => ({
          ...prev,
          current: page,
          total: res.totalElements,
        }));
      }
    } catch {
      message.error("Error loading user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  // Promote / Demote
  const handleRoleChange = async (record: UserItem) => {
    try {
      record.role === "ADMIN"
        ? await demoteUser(record.id)
        : await promoteUser(record.id);

      message.success("Role updated successfully");
      fetchData(pagination.current);
    } catch {
      message.error("Operation failed");
    }
  };

  // Lock / Unlock
  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      message.success("Status updated successfully");
      fetchData(pagination.current);
    } catch {
      message.error("Update error");
    }
  };

  const columns = [
    /* ===== USER INFO (DESKTOP) ===== */
    {
      title: "User",
      key: "userInfo",
      width: 320,
      responsive: ["md"],
      render: (record: UserItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${record.avatar}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-white">
              {record.username}
            </div>
            <div className="text-xs text-gray-400">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },

    /* ===== USER INFO (MOBILE) ===== */
    {
      title: "Information",
      key: "mobileInfo",
      responsive: ["xs"],
      render: (record: UserItem) => (
        <div className="flex gap-3">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${record.avatar}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="space-y-1">
            <div className="font-semibold">{record.username}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
            <div className="flex gap-1">
              <Tag color={record.role === "ADMIN" ? "volcano" : "blue"}>
                {record.role}
              </Tag>
              <Tag
                color={record.status === "ACTIVE" ? "success" : "default"}
              >
                {record.status}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },

    /* ===== ROLE ===== */
    {
      title: "Role",
      dataIndex: "role",
      width: 120,
      align: "center",
      responsive: ["md"],
      render: (r: string) => (
        <Tag color={r === "ADMIN" ? "volcano" : "blue"}>{r}</Tag>
      ),
    },

    /* ===== STATUS ===== */
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      responsive: ["md"],
      render: (s: string) => (
        <Tag color={s === "ACTIVE" ? "success" : "default"}>{s}</Tag>
      ),
    },

    /* ===== ACTION ===== */
    {
      title: "Action",
      key: "action",
      width: 240,
      fixed: "right",
      render: (_: any, record: UserItem) => (
        <Space>
          <Tooltip
            title={
              record.role === "ADMIN"
                ? "Demote to USER"
                : "Promote to ADMIN"
            }
          >
            <Popconfirm
              title={`Confirm change role for ${record.username}?`}
              onConfirm={() => handleRoleChange(record)}
            >
              <Button
                size="small"
                icon={
                  record.role === "ADMIN" ? (
                    <UserOutlined />
                  ) : (
                    <SecurityScanOutlined />
                  )
                }
              >
                {record.role === "ADMIN" ? "Demote" : "Promote"}
              </Button>
            </Popconfirm>
          </Tooltip>

          <Popconfirm
            title="Change account status?"
            onConfirm={() => handleToggleStatus(record.id)}
          >
            <Button
              size="small"
              danger={record.status === "ACTIVE"}
              icon={<SwapOutlined />}
            >
              {record.status === "ACTIVE" ? "Lock" : "Unlock"}
            </Button>
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
        onChange: (p) => fetchData(p),
      }}
      scroll={{ x: "max-content" }}
      tableLayout="fixed"
      className="custom-admin-table"
    />
  );
}
