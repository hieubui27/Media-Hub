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
        message.success("Media information created!");
        setCurrentStep(1);
      }
    } catch (error) {
      message.error("Error creating media info");
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
      message.success("Image uploaded successfully!");
      setCurrentStep(2);
    } catch (err) {
      onError({ err });
      message.error("Image upload failed.");
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
              { title: 'Information', icon: <FileTextOutlined /> },
              { title: 'Images', icon: <FileImageOutlined /> },
              { title: 'Finish', icon: <CheckCircleOutlined /> }
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
                  label={<span className="text-gray-400">Title</span>}
                  name="title"
                  rules={[{ required: true, message: "Please enter title!" }]}
                >
                  <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11 hover:border-violet-500 focus:border-violet-500" placeholder="e.g. Avengers: Endgame" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label={<span className="text-gray-400">Media Type</span>} name="typeName" initialValue="Movie">
                  <Select className="h-11" popupClassName="bg-[#141414]">
                    {options.types.map(t => <Option key={t} value={t}>{t}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Country</span>} name="country">
                  <Select className="h-11" placeholder="Select Country" popupClassName="bg-[#141414]">
                    {options.countries.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Release Date</span>} name="releaseDate">
                  <DatePicker className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Select date" />
                </Form.Item>
              </div>

              <Form.Item label={<span className="text-gray-400">Genres</span>} name="genres" rules={[{ required: true }]}>
                <Select mode="multiple" className="min-h-[44px]" placeholder="Select genres" popupClassName="bg-[#141414]">
                  {options.genres.map(g => <Option key={g} value={g}>{g}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-gray-400">Description</span>} name="description">
                <Input.TextArea className="bg-[#0a0a0a] border-gray-700 text-white" rows={4} placeholder="Enter detailed description..." />
              </Form.Item>

              <div className="flex justify-end pt-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-violet-600 hover:!bg-violet-500 border-none h-12 px-10 font-bold rounded-lg"
                >
                  Continue: Upload Image
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
                <p className="text-lg text-white font-bold">Drag or click to select image</p>
                <p className="text-gray-500">Supports JPG, PNG, WEBP</p>
              </Upload.Dragger>
              <Button type="link" className="mt-4 text-gray-500" onClick={() => setCurrentStep(2)}>Skip this step</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center py-16">
              <CheckCircleOutlined className="text-6xl text-emerald-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-6">Media Created Successfully!</h2>
              <div className="flex justify-center gap-4">
                <Button type="primary" onClick={() => router.push(`/main/media/detail/${mediaId}`)} className="bg-violet-600 h-11 px-8">View Details</Button>
                <Button onClick={() => window.location.reload()} className="h-11 px-8 border-gray-700 text-white hover:bg-white/5">Create Another</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}