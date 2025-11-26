import Sidebar from "@/src/components/dashboard/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#16181c] min-h-screen flex p-20">
      <Sidebar />
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
