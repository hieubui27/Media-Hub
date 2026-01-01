"use client";

import { useState, useEffect } from "react";
import { Upload, Button, message, Steps, Form, Input, Select, DatePicker, Card, ConfigProvider, theme } from "antd";
import { 
  CloudUploadOutlined, 
  FileTextOutlined, 
  FileImageOutlined, 
  CheckCircleOutlined 
} from "@ant-design/icons";
import { createMediaItem, uploadMediaImage } from "@/src/services/upload";
import { fetchFilterOptions } from "@/src/services/getGenres";
import { useRouter } from "next/navigation";

const { Step } = Steps;
const { Option } = Select;

export default function MediaUpload() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ genres: string[]; countries: string[]; types: string[] }>({
    genres: [],
    countries: [],
    types: []
  });
  
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await fetchFilterOptions();
        setOptions(data);
      } catch (err) {
        console.error("Failed to load metadata options", err);
      }
    }
    loadOptions();
  }, []);

  const onFinishInfo = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format("YYYY-MM-DD") : null,
      };
      const res = await createMediaItem(payload);
      const newId = res.MediaItemId || res.id;
      
      if (newId) {
        setMediaId(newId);
        message.success("Đã tạo thông tin Media!");
        setCurrentStep(1);
      }
    } catch (error: any) {
      message.error("Lỗi khi tạo thông tin media");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!mediaId) return;
    try {
      await uploadMediaImage(mediaId, file);
      onSuccess("Ok");
      message.success("Tải ảnh lên thành công!");
      setCurrentStep(2);
    } catch (err) {
      onError({ err });
      message.error("Tải ảnh thất bại.");
    }
  };

  return (
    // ConfigProvider giúp ép Ant Design tuân thủ theme Dark trên toàn bộ popup/dropdown
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6', // Màu tím violet giống nút bấm
          colorBgContainer: '#141414', // Màu nền của input/card
        },
      }}
    >
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="bg-[#141414] border-gray-800 text-white shadow-2xl rounded-2xl border">
          <Steps 
            current={currentStep} 
            className="mb-10"
            items={[
              { title: 'Thông tin', icon: <FileTextOutlined /> },
              { title: 'Hình ảnh', icon: <FileImageOutlined /> },
              { title: 'Hoàn tất', icon: <CheckCircleOutlined /> }
            ]}
          />

          {currentStep === 0 && (
            <Form 
              form={form}
              layout="vertical" 
              onFinish={onFinishInfo}
              requiredMark={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-gray-400">Tiêu đề</span>}
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                  <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11 hover:border-violet-500 focus:border-violet-500" placeholder="Ví dụ: Avengers: Endgame" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-400">Tiêu đề phụ / Tên gốc</span>}
                  name="aliasTitle"
                >
                  <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Tên gốc hoặc tên khác" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label={<span className="text-gray-400">Loại Media</span>} name="typeName" initialValue="Movie">
                  <Select className="h-11" popupClassName="bg-[#141414]">
                    {options.types.map(t => <Option key={t} value={t}>{t}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Quốc gia</span>} name="country">
                  <Select className="h-11" placeholder="Chọn quốc gia" popupClassName="bg-[#141414]">
                    {options.countries.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Ngày phát hành</span>} name="releaseDate">
                  <DatePicker className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Chọn ngày" />
                </Form.Item>
              </div>

              <Form.Item label={<span className="text-gray-400">Thể loại</span>} name="genres" rules={[{ required: true }]}>
                <Select mode="multiple" className="min-h-[44px]" placeholder="Chọn thể loại" popupClassName="bg-[#141414]">
                  {options.genres.map(g => <Option key={g} value={g}>{g}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-gray-400">Mô tả</span>} name="description">
                <Input.TextArea className="bg-[#0a0a0a] border-gray-700 text-white" rows={4} placeholder="Nhập mô tả chi tiết..." />
              </Form.Item>

              <div className="flex justify-end pt-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-violet-600 hover:!bg-violet-500 border-none h-12 px-10 font-bold rounded-lg"
                >
                  Tiếp tục: Tải ảnh lên
                </Button>
              </div>
            </Form>
          )}

          {currentStep === 1 && (
            <div className="text-center py-10">
              <Upload.Dragger
                customRequest={handleImageUpload}
                maxCount={1}
                accept="image/*"
                className="bg-[#0a0a0a] border-gray-700 hover:border-violet-500 rounded-xl p-10"
              >
                <p className="text-violet-500 text-4xl mb-4"><CloudUploadOutlined /></p>
                <p className="text-lg text-white font-bold">Kéo thả hoặc nhấp để chọn ảnh</p>
                <p className="text-gray-500">Hỗ trợ JPG, PNG, WEBP</p>
              </Upload.Dragger>
              <Button type="link" className="mt-4 text-gray-500" onClick={() => setCurrentStep(2)}>Bỏ qua bước này</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center py-16">
              <CheckCircleOutlined className="text-6xl text-emerald-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-6">Tạo Media Thành Công!</h2>
              <div className="flex justify-center gap-4">
                <Button type="primary" onClick={() => router.push(`/main/media/detail/${mediaId}`)} className="bg-violet-600 h-11 px-8">Xem chi tiết</Button>
                <Button onClick={() => window.location.reload()} className="h-11 px-8 border-gray-700 text-white hover:bg-white/5">Tạo thêm mới</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}