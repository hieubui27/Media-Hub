"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Popconfirm, message, Input, Select, Modal, Form } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { getAdminMedias, deleteMedia, updateMedia, MediaItem } from "@/src/services/adminService";

export default function MediaManager() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminMedias({ 
        page, 
        limit: pagination.pageSize,
        title: searchText, 
        type: typeFilter !== "all" ? typeFilter : undefined 
      });
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

  useEffect(() => {
    fetchData(1);
  }, [typeFilter]); // Reload when filter changes

  const handleSearch = () => fetchData(1);

  const handleDelete = async (id: number) => {
    try {
      await deleteMedia(id);
      message.success("Media deleted");
      fetchData(pagination.current);
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const openEdit = (record: MediaItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await updateMedia(editingItem.id, values);
        message.success("Media updated");
        setIsModalOpen(false);
        fetchData(pagination.current);
      }
    } catch (error) {
      message.error("Update failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { 
      title: "Title", 
      dataIndex: "title",
      render: (text: string, record: MediaItem) => (
        <div className="flex items-center gap-2">
           {record.urlImage && <img src={record.urlImage} alt="" className="w-8 h-8 object-cover rounded" />}
           <span className="font-medium">{text}</span>
        </div>
      )
    },
    { title: "Type", dataIndex: "typeName", render: (t: string) => <Tag color="blue">{t}</Tag> },
    { 
      title: "Status", 
      dataIndex: "status", 
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "error"}>{status}</Tag>
      )
    },
    { title: "Created By", dataIndex: "createdBy" },
    {
      title: "Action",
      render: (_: any, record: MediaItem) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Search media..." 
          prefix={<SearchOutlined />} 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
        />
        <Select defaultValue="all" style={{ width: 120 }} onChange={setTypeFilter}>
          <Select.Option value="all">All Types</Select.Option>
          <Select.Option value="Movie">Movie</Select.Option>
          <Select.Option value="TV Series">TV Series</Select.Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>Search</Button>
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

      <Modal 
        title="Edit Media" 
        open={isModalOpen} 
        onOk={handleUpdate} 
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="typeName" label="Type">
            <Select>
                <Select.Option value="Movie">Movie</Select.Option>
                <Select.Option value="TV Series">TV Series</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
