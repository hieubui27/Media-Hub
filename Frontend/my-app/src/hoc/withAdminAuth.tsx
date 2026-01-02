"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/src/contexts/AdminContext";
import { Spin } from "antd";

export default function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const { admin, isLoading } = useAdmin();
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      if (!isLoading) {
        if (!admin || admin.role !== "ADMIN") {
          router.replace("/admin/login");
        } else {
          setIsVerified(true);
        }
      }
    }, [admin, isLoading, router]);

    if (isLoading || !isVerified) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Spin size="large" tip="Đang xác thực quyền Admin..." />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}