"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Tooltip } from "antd";
import { UserOutlined, SecurityScanOutlined, SwapOutlined } from "@ant-design/icons";
import { getAdminUsers, toggleUserStatus, promoteUser, demoteUser, UserItem } from "@/src/services/adminService";


export default function UserManager() {
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ page, limit: pagination.pageSize });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, []);

  // Xử lý đổi quyền: Nếu là ADMIN thì Demote, nếu là USER thì Promote
  const handleRoleChange = async (record: UserItem) => {
    try {
      if (record.role === "ADMIN") {
        await demoteUser(record.id);
        message.success(`Đã hạ quyền ${record.username} xuống USER`);
      } else {
        await promoteUser(record.id);
        message.success(`Đã nâng quyền ${record.username} lên ADMIN`);
      }
      fetchData(pagination.current);
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      message.success("Cập nhật trạng thái thành công");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Lỗi cập nhật");
    }
  };

  const columns = [
    { 
      title: "Thông tin User", 
      key: "userInfo",
      render: (record: UserItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 overflow-hidden border border-gray-700">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app"}${record.avatar}`} 
              alt="avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-white">{record.username}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </div>
      )
    },
    { 
      title: "Quyền hạn", 
      dataIndex: "role", 
      render: (r: string) => <Tag color={r === "ADMIN" ? "volcano" : "blue"}>{r}</Tag> 
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      render: (s: string) => <Tag color={s === "ACTIVE" ? "success" : "default"}>{s}</Tag> 
    },
    {
      title: "Thao tác",
      render: (_: any, record: UserItem) => (
        <Space>
          {/* Nút Promote/Demote */}
          <Tooltip title={record.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}>
            <Popconfirm 
              title={`Xác nhận đổi quyền của ${record.username}?`} 
              onConfirm={() => handleRoleChange(record)}
            >
              <Button 
                size="small"
                icon={record.role === "ADMIN" ? <UserOutlined /> : <SecurityScanOutlined />}
                className={record.role === "ADMIN" ? "text-blue-400 border-blue-400" : "text-orange-400 border-orange-400"}
              >
                {record.role === "ADMIN" ? "Demote" : "Promote"}
              </Button>
            </Popconfirm>
          </Tooltip>

          {/* Nút Khóa/Mở khóa */}
          <Popconfirm title="Đổi trạng thái?" onConfirm={() => handleToggleStatus(record.id)}>
            <Button danger={record.status === "ACTIVE"} icon={<SwapOutlined />} size="small">
              {record.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
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
      pagination={{ ...pagination, onChange: (p) => fetchData(p) }}
      className="custom-admin-table"
    />
  );
}