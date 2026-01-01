"use client";

import MediaUpload from "@/src/components/MediaUpload";
import MyUploads from "@/src/components/MyUploads";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
              Create New <span className="text-violet-500">Media</span>
            </h1>
            <p className="text-gray-400">Share your favorite movies, books, or games with the community.</p>
          </div>
          
          <MediaUpload />
          
          <MyUploads />
        </div>
      </div>
    </ProtectedRoute>
  );
}