"use client";

import { useState, useEffect } from "react";
import { 
  Upload, Button, message, Steps, Form, Input, 
  Select, DatePicker, Card, ConfigProvider, theme, InputNumber 
} from "antd";
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

// Định nghĩa danh sách Genres riêng biệt cho từng thể loại
const GENRES_BY_TYPE: Record<string, string[]> = {
  "Movie": ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"],
  "TV Series": ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Kids", "Mystery", "News", "Reality", "Sci-Fi & Fantasy", "Soap", "Talk", "War & Politics", "Western"],
  "Book": ["Drama", "Fiction", "Non-fiction", "Mystery", "Fantasy", "Science Fiction", "Romance", "Thriller", "Biography", "History", "Children's", "Young Adult", "Classic"],
  "Video Game": ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Horror", "Puzzle", "Shooter", "Survival"],
  "Music": ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Soul", "Folk", "Romance"]
};

export default function MediaUpload() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ countries: string[]; types: string[] }>({
    countries: [],
    types: ["Movie", "TV Series", "Book", "Video Game", "Music"] // Ưu tiên 5 loại chuẩn
  });
  
  const router = useRouter();
  const [form] = Form.useForm();
  
  // Theo dõi loại Media đang chọn để cập nhật giao diện và danh sách Genres
  const typeName = Form.useWatch("typeName", form);

  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await fetchFilterOptions();
        // Lấy danh sách quốc gia từ API, giữ nguyên 5 types chuẩn
        setOptions(prev => ({ ...prev, countries: data.countries }));
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
        message.success("Media information created successfully!");
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

  // Render các trường nhập liệu đặc thù theo mẫu dữ liệu JSON cung cấp
  const renderDynamicFields = () => {
    switch (typeName) {
      case "Book":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Author</span>} name="author">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. Đông Kinh Nghĩa Thục" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Edition</span>} name="edition">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. 1st Edition" />
              </Form.Item>
            </div>
            <Form.Item label={<span className="text-gray-400">Page Count</span>} name="pageCount">
              <InputNumber className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11 flex items-center" placeholder="e.g. 350" />
            </Form.Item>
          </>
        );
      case "Movie":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Director</span>} name="director">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. Edwin S. Porter" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Run Time (Minutes)</span>} name="runTimeMinutes">
                <InputNumber className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11 flex items-center" placeholder="e.g. 120" />
              </Form.Item>
            </div>
            <Form.Item label={<span className="text-gray-400">Cast</span>} name="cast">
              <Input.TextArea className="bg-[#0a0a0a] border-gray-700 text-white" placeholder="Lead actors..." />
            </Form.Item>
            <Form.Item label={<span className="text-gray-400">Producers</span>} name="producers">
              <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Production staff..." />
            </Form.Item>
          </>
        );
      case "TV Series":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Creator</span>} name="creator">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. Greg Daniels" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Production Company</span>} name="productionCompany">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Total Seasons</span>} name="totalSeasons">
                <InputNumber className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11 flex items-center" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Total Episodes</span>} name="totalEpisodes">
                <InputNumber className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11 flex items-center" />
              </Form.Item>
            </div>
          </>
        );
      case "Video Game":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Developer</span>} name="developer">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Publisher</span>} name="publisher">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
            </div>
            <Form.Item label={<span className="text-gray-400">Platform</span>} name="platform">
              <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. PC, PS5, Xbox Series X|S" />
            </Form.Item>
            <Form.Item label={<span className="text-gray-400">Minimum Requirements</span>} name="minRequirement">
              <Input.TextArea className="bg-[#0a0a0a] border-gray-700 text-white" placeholder="CPU, RAM, GPU..." />
            </Form.Item>
          </>
        );
      case "Music":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Artist</span>} name="artist" rules={[{ required: true }]}>
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Album</span>} name="album">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="text-gray-400">Composer</span>} name="composer">
                <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" />
              </Form.Item>
              <Form.Item label={<span className="text-gray-400">Track Number</span>} name="trackNumber">
                <InputNumber className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11 flex items-center" />
              </Form.Item>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          colorBgContainer: '#141414',
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
              initialValues={{ typeName: "Movie" }}
            >
              {/* PHẦN CHUNG CHO TẤT CẢ MEDIA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-gray-400">Title</span>}
                  name="title"
                  rules={[{ required: true, message: "Please enter title!" }]}
                >
                  <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Title of the media" />
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Media Type</span>} name="typeName">
                  <Select className="h-11" popupClassName="bg-[#141414]">
                    {options.types.map(t => <Option key={t} value={t}>{t}</Option>)}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label={<span className="text-gray-400">Country</span>} name="country">
                  <Select className="h-11" placeholder="Select Country" popupClassName="bg-[#141414]">
                    {options.countries.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Language</span>} name="language">
                  <Input className="bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="e.g. English" />
                </Form.Item>

                <Form.Item label={<span className="text-gray-400">Content Rating</span>} name="contentRating">
                  <Select className="h-11" placeholder="G, PG, M, NR..." popupClassName="bg-[#141414]">
                    <Option value="G">G</Option>
                    <Option value="PG">PG</Option>
                    <Option value="PG-13">PG-13</Option>
                    <Option value="R">R</Option>
                    <Option value="M">M</Option>
                    <Option value="NR">NR</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item label={<span className="text-gray-400">Release Date</span>} name="releaseDate">
                  <DatePicker className="w-full bg-[#0a0a0a] border-gray-700 text-white h-11" placeholder="Select date" />
                </Form.Item>

                <Form.Item 
                  label={<span className="text-gray-400">Genres ({typeName})</span>} 
                  name="genres" 
                  rules={[{ required: true, message: 'Please select at least one genre' }]}
                >
                  <Select 
                    mode="multiple" 
                    className="min-h-[44px]" 
                    placeholder={`Select ${typeName} genres`} 
                    popupClassName="bg-[#141414]"
                  >
                    {(GENRES_BY_TYPE[typeName || "Movie"] || []).map(g => (
                      <Option key={g} value={g}>{g}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* PHẦN RIÊNG THEO TỪNG LOẠI MEDIA */}
              <div className="my-6 p-6 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                <h3 className="text-violet-400 font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
                  {typeName} Specific Details
                </h3>
                {renderDynamicFields()}
              </div>

              <Form.Item label={<span className="text-gray-400">Description</span>} name="description">
                <Input.TextArea className="bg-[#0a0a0a] border-gray-700 text-white" rows={4} placeholder="Detailed description..." />
              </Form.Item>

              <div className="flex justify-end pt-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-violet-600 hover:!bg-violet-500 border-none h-12 px-10 font-bold rounded-lg shadow-lg shadow-violet-600/20"
                >
                  Continue: Upload Image
                </Button>
              </div>
            </Form>
          )}

          {/* CÁC BƯỚC TIẾP THEO GIỮ NGUYÊN */}
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
                <Button type="primary" onClick={() => router.push(`/main/media/detail/${mediaId}`)} className="bg-violet-600 h-11 px-8 font-bold rounded-lg shadow-lg shadow-violet-600/20">View Details</Button>
                <Button onClick={() => window.location.reload()} className="h-11 px-8 border-gray-700 text-white hover:bg-white/5 font-bold rounded-lg">Create Another</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}