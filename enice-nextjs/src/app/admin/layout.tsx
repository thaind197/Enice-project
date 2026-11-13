'use client';
import { Layout, Menu, Button, message } from 'antd';
import { DashboardOutlined, ShoppingOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Content, Sider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      message.success('Đã đăng xuất');
      router.push('/login'); // Chuyển về trang đăng nhập
    } catch (error) {
      message.error('Lỗi đăng xuất');
    }
  };

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link href="/admin">Tổng quan</Link> },
    { key: '/admin/san-pham', icon: <ShoppingOutlined />, label: <Link href="/admin/san-pham">Quản lý Sản phẩm</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold bg-blue-900">
          ENICE ADMIN
        </div>
        
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={menuItems} />
        
        {/* Nút Đăng xuất ở dưới cùng thanh menu bên trái */}
        <div className="absolute bottom-4 w-full px-4">
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="w-full"
          >
            Thoát & Về trang chủ
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-lg font-semibold">Hệ thống Quản trị</h2>
          
          <div className="flex items-center gap-4">
            <div className="text-green-600 font-medium text-sm hidden md:block">🟢 Database: Connected</div>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}