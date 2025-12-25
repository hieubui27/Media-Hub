import HeaderNav from "@/src/components/Menu/HeaderNav";
import { UserProvider } from "@/src/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* Sử dụng flexbox để Footer luôn nằm dưới đáy 
            nếu nội dung trang quá ngắn 
          */}
          <div className="flex flex-col min-h-screen">
                <header>
                    <HeaderNav/>
                </header>


            {/* Main content - flex-grow sẽ đẩy footer xuống */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer */}
            
          </div>
        </UserProvider>
      </body>
    </html>
  );
}