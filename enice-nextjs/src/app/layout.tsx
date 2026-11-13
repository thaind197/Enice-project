import type { Metadata } from "next";
import { Suspense } from "react"; // Thêm import này
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import "./globals.css";

export const metadata: Metadata = {
  title: "ENICE - Thiết Bị Phòng Tắm Cao Cấp",
  description: "Chuyên cung cấp thiết bị vệ sinh, bồn tắm cao cấp, đảm bảo chất lượng – giá tốt – bảo hành chính hãng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning={true}>
        {/* Bọc AntdRegistry trong Suspense để xử lý lỗi Math.random() của Next.js 16 */}
        <Suspense fallback={<div>Đang tải giao diện...</div>}>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#1677ff',
                  borderRadius: 8,
                },
              }}
              locale={viVN}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}