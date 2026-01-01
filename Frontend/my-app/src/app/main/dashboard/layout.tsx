import Sidebar from "@/src/components/dashboard/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#16181c] min-h-screen flex flex-col lg:flex-row p-4 md:p-8 lg:p-12 gap-6 lg:gap-10 pt-24 lg:pt-28">
      <Sidebar />
      <main className="flex-1 text-white min-w-0">{children}</main>
    </div>
  );
}
