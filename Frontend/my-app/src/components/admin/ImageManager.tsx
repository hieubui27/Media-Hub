"use client";

import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, message, Input, Tabs, Image as AntImage, Modal } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { getAdminUsers, getAdminMedias, resetUserAvatar, updateMediaImage, UserItem, MediaItem } from "@/src/services/adminService";

export default function ImageManager() {
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        { key: "1", label: "User Avatars", children: <AvatarPanel /> },
        { key: "2", label: "Media Images", children: <MediaImagePanel /> },
      ]}
    />
  );
}

function AvatarPanel() {
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
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchData(1); }, []);

  const handleReset = async (id: number) => {
    try {
      await resetUserAvatar(id);
      message.success("Avatar reset to default");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Reset failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Username", dataIndex: "username" },
    { 
      title: "Avatar", 
      dataIndex: "avatar", 
      render: (url: string) => (
        url ? <AntImage src={url} width={50} height={50} className="rounded-full object-cover" /> : "Default"
      )
    },
    {
      title: "Action",
      render: (_: any, record: UserItem) => (
        <Space>
          <Popconfirm title="Reset avatar?" onConfirm={() => handleReset(record.id)}>
            <Button icon={<ReloadOutlined />} size="small">Reset</Button>
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
      pagination={{ ...pagination, onChange: fetchData }}
    />
  );
}

function MediaImagePanel() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState("");

  // Update Image Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [newUrl, setNewUrl] = useState("");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminMedias({ page, limit: pagination.pageSize, title: search });
      if (res && res.content) {
        setData(res.content);
        setPagination({ ...pagination, current: page, total: res.totalElements });
      }
    } catch (error) {
      message.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchData(1); }, []);

  const openUpdate = (item: MediaItem) => {
    setCurrentMedia(item);
    setNewUrl(item.urlImage || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentMedia) return;
    try {
      await updateMediaImage(currentMedia.id, newUrl);
      message.success("Image updated");
      setIsModalOpen(false);
      fetchData(pagination.current);
    } catch (error) {
      message.error("Update failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Title", dataIndex: "title" },
    { 
      title: "Image", 
      dataIndex: "urlImage", 
      render: (url: string) => (
        url ? <AntImage src={url} width={80} /> : "No Image"
      )
    },
    {
      title: "Action",
      render: (_: any, record: MediaItem) => (
        <Button icon={<EditOutlined />} onClick={() => openUpdate(record)}>Change</Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4">
         <Input placeholder="Search media..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
         <Button icon={<SearchOutlined />} onClick={() => fetchData(1)}>Search</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        loading={loading}
        pagination={{ ...pagination, onChange: fetchData }}
      />
      <Modal title="Update Media Image" open={isModalOpen} onOk={handleUpdate} onCancel={() => setIsModalOpen(false)}>
        <Input placeholder="Image URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
        <div className="mt-4">
            <p className="mb-2">Preview:</p>
            {newUrl && <img src={newUrl} alt="Preview" className="max-w-full max-h-40 object-contain border" />}
        </div>
      </Modal>
    </div>
  );
}
