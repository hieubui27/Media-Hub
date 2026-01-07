"use client";

import React, { useEffect, useState } from "react";
import { 
  Modal, Form, Input, Select, DatePicker, 
  InputNumber, message, Spin, ConfigProvider, theme 
} from "antd";
import { getFilmDetail } from "@/src/services/getFilmDetail";
import { updateMediaItem } from "@/src/services/upload";
import dayjs from "dayjs";

const { Option } = Select;

// Danh sách Genres được lấy từ logic của MediaUpload.tsx
const GENRES_BY_TYPE: Record<string, string[]> = {
  "Movie": ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"],
  "TV Series": ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Kids", "Mystery", "News", "Reality", "Sci-Fi & Fantasy", "Soap", "Talk", "War & Politics", "Western"],
  "Book": ["Drama", "Fiction", "Non-fiction", "Mystery", "Fantasy", "Science Fiction", "Romance", "Thriller", "Biography", "History", "Children's", "Young Adult", "Classic"],
  "Video Game": ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Horror", "Puzzle", "Shooter", "Survival"],
  "Music": ["Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Soul", "Folk", "Romance"]
};

interface UpdateMediaModalProps {
  mediaId: number | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateMediaModal = ({ mediaId, visible, onClose, onSuccess }: UpdateMediaModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Theo dõi loại Media để render các trường động
  const typeName = Form.useWatch("typeName", form);

  useEffect(() => {
    if (visible && mediaId) {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await getFilmDetail(mediaId.toString());
          
          // Điền sẵn giá trị vào form
          form.setFieldsValue({
            ...data,
            releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
            // Map danh sách genres từ object (nếu có) sang mảng string cho Select mode="multiple"
            genres: data.genres?.map((g: any) => g.name || g) || [],
          });
        } catch (error) {
          message.error("Không thể tải thông tin media");
          onClose();
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [visible, mediaId, form, onClose]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format("YYYY-MM-DD") : null,
      };
      
      setLoading(true);
      await updateMediaItem(mediaId!, payload);
      message.success("Cập nhật thông tin thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Render các trường đặc thù theo từng loại Media tương tự MediaUpload.tsx
  const renderDynamicFields = () => {
    switch (typeName) {
      case "Book":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Author" name="author"><Input /></Form.Item>
              <Form.Item label="Edition" name="edition"><Input /></Form.Item>
            </div>
            <Form.Item label="Page Count" name="pageCount"><InputNumber className="w-full" /></Form.Item>
          </>
        );
      case "Movie":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Director" name="director"><Input /></Form.Item>
              <Form.Item label="Run Time (Minutes)" name="runTimeMinutes"><InputNumber className="w-full" /></Form.Item>
            </div>
            <Form.Item label="Cast" name="cast"><Input.TextArea /></Form.Item>
          </>
        );
      case "TV Series":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Total Seasons" name="totalSeasons"><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Total Episodes" name="totalEpisodes"><InputNumber className="w-full" /></Form.Item>
          </div>
        );
      case "Video Game":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Developer" name="developer"><Input /></Form.Item>
              <Form.Item label="Publisher" name="publisher"><Input /></Form.Item>
            </div>
            <Form.Item label="Platform" name="platform"><Input /></Form.Item>
          </>
        );
      case "Music":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Artist" name="artist" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Album" name="album"><Input /></Form.Item>
          </div>
        );
      default: return null;
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Modal
        title={<span className="text-violet-400 font-bold uppercase tracking-wider">Chỉnh sửa thông tin Media</span>}
        open={visible}
        onCancel={onClose}
        onOk={handleUpdate}
        confirmLoading={loading}
        width={800}
        okText="Cập nhật"
        cancelText="Hủy bỏ"
        centered
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" className="mt-4 max-h-[70vh] overflow-y-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="Media title" />
              </Form.Item>

              <Form.Item label="Media Type" name="typeName">
                <Select>
                  <Option value="Movie">Movie</Option>
                  <Option value="TV Series">TV Series</Option>
                  <Option value="Book">Book</Option>
                  <Option value="Video Game">Video Game</Option>
                  <Option value="Music">Music</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Country" name="country"><Input /></Form.Item>
              <Form.Item label="Language" name="language"><Input /></Form.Item>
              <Form.Item label="Content Rating" name="contentRating">
                <Select placeholder="G, PG, R...">
                  <Option value="G">G</Option>
                  <Option value="PG">PG</Option>
                  <Option value="PG-13">PG-13</Option>
                  <Option value="R">R</Option>
                  <Option value="NR">NR</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Release Date" name="releaseDate">
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item label={`Genres (${typeName || 'Movie'})`} name="genres">
                <Select mode="multiple" placeholder="Select genres">
                  {(GENRES_BY_TYPE[typeName || "Movie"] || []).map(g => (
                    <Option key={g} value={g}>{g}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Phần hiển thị các trường riêng biệt */}
            <div className="my-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-violet-400 text-xs font-bold mb-3 uppercase tracking-widest italic">
                {typeName} Details
              </h4>
              {renderDynamicFields()}
            </div>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} placeholder="Media description..." />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </ConfigProvider>
  );
};