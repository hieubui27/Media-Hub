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
      const res = await getAdminUsers();
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
      fixed: 'left' as const, // Cố định cột này bên trái khi cuộn ngang trên mobile
      render: (record: UserItem) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-violet-600 overflow-hidden border border-gray-700 shrink-0">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || "https://8dcbf8a962a3.ngrok-free.app"}${record.avatar}`} 
              alt="avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-white text-xs md:text-sm truncate">{record.username}</div>
            {/* Ẩn email trên điện thoại quá nhỏ, chỉ hiện từ màn hình sm trở lên */}
            <div className="text-[10px] md:text-xs text-gray-400 truncate hidden sm:block">{record.email}</div>
          </div>
        </div>
      )
    },
    { 
      title: "Quyền", 
      dataIndex: "role", 
      width: 80,
      render: (r: string) => (
        <Tag color={r === "ADMIN" ? "volcano" : "blue"} className="text-[10px] md:text-xs m-0">
          {r}
        </Tag>
      ) 
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      width: 100,
      responsive: ['sm'] as any, // Ẩn cột này trên điện thoại siêu nhỏ (xs)
      render: (s: string) => <Tag color={s === "ACTIVE" ? "success" : "default"}>{s}</Tag> 
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: 'right' as const, // Cố định cột thao tác bên phải trên mobile
      width: 120,
      render: (_: any, record: UserItem) => (
        <Space size="small">
          <Tooltip title={record.role === "ADMIN" ? "Demote" : "Promote"}>
            <Popconfirm 
              title="Đổi quyền?" 
              onConfirm={() => handleRoleChange(record)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                size="small"
                type="text"
                icon={record.role === "ADMIN" ? <UserOutlined className="text-blue-400" /> : <SecurityScanOutlined className="text-orange-400" />}
                className="flex items-center justify-center border border-gray-700"
              />
            </Popconfirm>
          </Tooltip>

          <Popconfirm title="Khóa/Mở?" onConfirm={() => handleToggleStatus(record.id)}>
            <Button 
              danger={record.status === "ACTIVE"} 
              icon={<SwapOutlined />} 
              size="small"
              type="text"
              className="flex items-center justify-center border border-gray-700"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          ...pagination, 
          onChange: (p) => fetchData(p),
          size: "small" // Thu nhỏ phân trang trên mobile
        }}
        // QUAN TRỌNG: Cấu hình scroll ngang
        scroll={{ x: 600 }} 
        className="custom-admin-table"
      />
    </div>
  );
}