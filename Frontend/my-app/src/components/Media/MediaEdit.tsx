"use client";

import { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Button, Card, ConfigProvider, theme, InputNumber, message, Spin } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getFilmDetail } from "@/src/services/getFilmDetail";
import { updateMediaItem } from "@/src/services/upload";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";

const { Option } = Select;

export default function MediaEdit() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL: /main/dashboard/upload/edit/[id]
  const [loading, setLoading] = useState(true);
  const typeName = Form.useWatch("typeName", form);

  useEffect(() => {
    async function loadMediaData() {
      try {
        const data = await getFilmDetail(id as string);
        // Map dữ liệu từ API vào Form
        form.setFieldsValue({
          ...data,
          releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
          genres: data.genres?.map((g: any) => g.name || g), // Tùy vào cấu trúc API trả về
        });
      } catch (error) {
        message.error("Không thể tải thông tin media");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadMediaData();
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format("YYYY-MM-DD") : null,
      };
      await updateMediaItem(id as string, payload);
      message.success("Cập nhật thành công!");
      router.push("/main/dashboard/upload"); // Quay lại trang lịch sử upload
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  if (loading) return <div className="text-center py-20"><Spin size="large" /></div>;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="mb-4 bg-transparent border-gray-700 text-gray-400"
        >
          Quay lại
        </Button>
        
        <Card title={<span className="text-white text-xl">Chỉnh sửa Media</span>} className="bg-[#141414] border-gray-800">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
                <Input className="bg-[#0a0a0a] border-gray-700 h-11" />
              </Form.Item>
              <Form.Item label="Loại Media" name="typeName">
                <Select disabled className="h-11">
                    <Option value="Movie">Movie</Option>
                    <Option value="TV Series">TV Series</Option>
                    <Option value="Book">Book</Option>
                    <Option value="Video Game">Video Game</Option>
                    <Option value="Music">Music</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Bạn có thể copy renderDynamicFields() từ MediaUpload.tsx vào đây */}
            
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={4} className="bg-[#0a0a0a] border-gray-700" />
            </Form.Item>

            <div className="flex justify-end">
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                className="bg-violet-600 h-11 px-10 font-bold"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}