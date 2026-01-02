"use client";

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tabs, 
  Tag, 
  Button, 
  Space, 
  Popconfirm, 
  ConfigProvider, 
  theme, 
  message, 
  Select,
  Image,
  Tooltip,
  Modal,
  Form,
  Input
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { 
  DeleteOutlined, 
  EyeOutlined, 
  SwapOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';

import { 
  adminGetMedias, 
  adminToggleMediaStatus, 
  adminDeleteMedia,
  adminGetReviews, 
  adminDeleteReview,
  adminGetUsers,
  adminToggleUserStatus,
  adminUpdateMedia,
  AdminMediaItem,
  AdminReviewItem,
  AdminUserItem
} from '@/src/services/admin';
import withAdminAuth from '@/src/hoc/withAdminAuth';
import { useAdmin } from '@/src/contexts/AdminContext';
import { getImageUrl } from '@/src/utils/imageHelper';

const { Option } = Select;
const { TextArea } = Input;

function AdminDashboard() {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  
  // Pagination State (Ant Design format)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
  });
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Edit State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState<AdminMediaItem | null>(null);
  const [editForm] = Form.useForm();

  // --- FETCH DATA ---
  const fetchData = async (page: number, pageSize: number, tabKey: string, status?: string) => {
    setLoading(true);
    try {
      let res;
      if (tabKey === '1') {
        res = await adminGetMedias(page, pageSize, status);
      } else if (tabKey === '2') {
        res = await adminGetReviews(page, pageSize); 
      } else if (tabKey === '3') {
        res = await adminGetUsers(page, pageSize, status);
      }

      if (res) {
        setData(res.content);
        setPagination((prev) => ({
          ...prev,
          current: res.number + 1, // API 0-based -> Antd 1-based
          pageSize: res.size,
          total: res.totalElements, // Map totalElements to pagination
        }));
      }
    } catch (error) {
      console.error(error);
      message.error('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Effect load data when deps change
  useEffect(() => {
    fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
  }, [activeTab, pagination.current, pagination.pageSize, statusFilter]);

  // Handle Tab Change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset to page 1 when changing tabs
    setPagination({ ...pagination, current: 1 });
    setStatusFilter(undefined);
    setData([]);
  };

  // Handle Table Changes (Pagination, Filter, Sort)
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // --- ACTIONS ---

  const handleToggleMedia = async (id: number | string) => {
    try {
      await adminToggleMediaStatus(id);
      message.success('Đã thay đổi trạng thái Media');
      fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
    } catch (e) {
      message.error('Lỗi khi thay đổi trạng thái');
    }
  };

  const handleDeleteMedia = async (id: number | string) => {
    try {
      await adminDeleteMedia(id);
      message.success('Đã xóa Media thành công');
      fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
    } catch (e) {
      message.error('Lỗi khi xóa Media');
    }
  };

  const handleDeleteReview = async (id: number | string) => {
    try {
      await adminDeleteReview(id);
      message.success('Đã xóa đánh giá vĩnh viễn');
      fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
    } catch (e) {
      message.error('Lỗi khi xóa đánh giá');
    }
  };

  const handleToggleUser = async (id: number | string) => {
    try {
      await adminToggleUserStatus(id);
      message.success('Đã cập nhật trạng thái User');
      fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
    } catch (e) {
      message.error('Lỗi khi cập nhật User');
    }
  }

  // --- EDIT ACTIONS ---
  const openEditModal = (record: AdminMediaItem) => {
    setEditingMedia(record);
    editForm.setFieldsValue({
        title: record.title,
        description: record.description || '',
        typeName: record.typeName || 'PHIM_LE', // Default if missing
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
        const values = await editForm.validateFields();
        if (!editingMedia) return;

        await adminUpdateMedia(editingMedia.id, values);
        message.success('Cập nhật Media thành công');
        setIsEditModalVisible(false);
        setEditingMedia(null);
        fetchData(pagination.current || 1, pagination.pageSize || 10, activeTab, statusFilter);
    } catch (error) {
        console.error(error);
        message.error('Lỗi khi cập nhật Media');
    }
  };

  // --- COLUMNS ---

  const mediaColumns: ColumnsType<AdminMediaItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
    { 
      title: 'Ảnh bìa', 
      dataIndex: 'urlImage', 
      key: 'urlImage',
      width: 100,
      render: (url: string) => (
        <Image 
          src={getImageUrl(url) || '/images/images.png'} 
          alt="cover"
          width={60} 
          height={80} 
          className="object-cover rounded border border-gray-700"
          fallback="/images/images.png"
        />
      )
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: 'Loại', dataIndex: 'typeName', key: 'typeName', width: 120 },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        const isActive = status === 'ACTIVE';
        return (
          <Tag icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={isActive ? 'success' : 'error'}>
            {status}
          </Tag>
        );
      }
    },
    { title: 'Người đăng', dataIndex: 'createdBy', key: 'createdBy', width: 150 },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Đổi trạng thái">
            <Popconfirm
              title="Đổi trạng thái?"
              onConfirm={() => handleToggleMedia(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                icon={<SwapOutlined />} 
                type="text" 
                className="text-blue-400 hover:text-blue-300" 
              />
            </Popconfirm>
          </Tooltip>

          <Tooltip title="Sửa bài">
             <Button 
                icon={<EditOutlined />} 
                type="text"
                className="text-orange-400 hover:text-orange-300"
                onClick={() => openEditModal(record)}
             />
          </Tooltip>

          <Tooltip title="Xóa Media">
            <Popconfirm
              title="Xóa Media?"
              description="Hành động này không thể hoàn tác!"
              onConfirm={() => handleDeleteMedia(record.id)}
              okText="Xóa ngay"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} type="text" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const reviewColumns: ColumnsType<AdminReviewItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', width: 80, align: 'center' },
    { title: 'Media', dataIndex: 'mediaTitle', key: 'mediaTitle', width: 200 },
    { title: 'User', dataIndex: 'user', key: 'user', width: 150 },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Xóa đánh giá?"
          description="Bạn có chắc muốn xóa đánh giá này?"
          onConfirm={() => handleDeleteReview(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button icon={<DeleteOutlined />} danger size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const userColumns: ColumnsType<AdminUserItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
    { title: 'Tên hiển thị', dataIndex: 'displayName', key: 'displayName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
          {status}
        </Tag>
      )
    },
    { 
      title: 'Ngày tham gia', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Đổi trạng thái?"
          onConfirm={() => handleToggleUser(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button icon={<SwapOutlined />} type="dashed" size="small">
            {record.status === 'ACTIVE' ? 'Block' : 'Unblock'}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Render Table Helper
  const renderTable = (columns: any) => (
    <>
      {/* Filter Bar */}
      {(activeTab === '1' || activeTab === '3') && (
        <div className="mb-4 flex items-center gap-2 bg-[#141414] p-3 rounded-lg border border-gray-800">
          <FilterOutlined className="text-gray-400" />
          <span className="text-gray-300 text-sm font-medium">Lọc theo trạng thái:</span>
          <Select
            placeholder="Tất cả"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => setStatusFilter(value)}
            value={statusFilter}
            className="custom-select"
          >
            <Option value="ACTIVE">Active</Option>
            <Option value="INACTIVE">Inactive</Option>
          </Select>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        bordered
        size="middle"
      />
    </>
  );

  const items = [
    { key: '1', label: 'Quản lý Media', children: activeTab === '1' ? renderTable(mediaColumns) : null },
    { key: '2', label: 'Quản lý Review', children: activeTab === '2' ? renderTable(reviewColumns) : null },
    { key: '3', label: 'Quản lý Người dùng', children: activeTab === '3' ? renderTable(userColumns) : null },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#141414',
          colorBgBase: '#0a0a0a',
          colorTextBase: '#ffffff',
          colorBorder: '#303030',
        },
      }}
    >
      <div className="min-h-screen bg-[#0a0a0a] p-6 text-white">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-400 text-sm">Trung tâm quản lý nội dung Media Hub</p>
                </div>
                <Button 
                  onClick={logout} 
                  type="primary" 
                  danger 
                  className="bg-red-600 hover:bg-red-500 border-none font-semibold"
                >
                  Đăng xuất
                </Button>
            </div>
          
          <div className="bg-[#141414] rounded-xl border border-gray-800 p-6 shadow-xl">
            <Tabs
              activeKey={activeTab}
              items={items}
              onChange={handleTabChange}
              type="card"
              className="custom-tabs"
            />
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
            title="Chỉnh sửa Media"
            open={isEditModalVisible}
            onOk={handleEditSubmit}
            onCancel={() => setIsEditModalVisible(false)}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={editForm} layout="vertical" name="edit_media_form">
                <Form.Item 
                    name="title" 
                    label="Tiêu đề" 
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    name="typeName" 
                    label="Loại phim" 
                    rules={[{ required: true, message: 'Bắt buộc chọn loại phim' }]}
                >
                    <Select>
                        <Option value="PHIM_LE">Phim Lẻ</Option>
                        <Option value="PHIM_BO">Phim Bộ</Option>
                        <Option value="PHIM_CHIEU_RAP">Phim Chiếu Rạp</Option>
                        <Option value="TV_SHOWS">TV Shows</Option>
                        <Option value="HOAT_HINH">Hoạt Hình</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="description" label="Mô tả">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

// Wrap with HOC for protection
export default withAdminAuth(AdminDashboard);