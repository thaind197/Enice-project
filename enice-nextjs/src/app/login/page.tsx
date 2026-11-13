'use client';
import { useState, useEffect } from 'react'; // 1. Thêm useEffect
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  // 2. Thêm dòng khởi tạo form
  const [form] = Form.useForm();

  // 3. Thêm hàm reset form khi vào trang
  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success('Đăng nhập thành công! Đang chuyển hướng...');
        router.push('/admin');
      } else {
        const data = await res.json();
        message.error(data.error || 'Sai tên đăng nhập hoặc mật khẩu');
      }
    } catch (err) {
      message.error('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 tracking-wider">ENICE</h1>
          <p className="text-gray-500 font-medium">Hệ thống quản trị nội bộ</p>
        </div>
        
        {/* 4. Thêm prop form={form} vào thẻ Form */}
        <Form form={form} name="login" onFinish={onFinish} size="large" layout="vertical" autoComplete="off">
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Tên đăng nhập" 
              autoComplete="new-username" 
              style={{ color: '#000', backgroundColor: '#fff' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input 
              type={showPassword ? 'text' : 'password'}
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Mật khẩu" 
              autoComplete="new-password" 
              style={{ color: '#000', backgroundColor: '#fff' }}
              suffix={
                <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-400 hover:text-blue-500">
                  {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button type="primary" htmlType="submit" className="w-full font-semibold" loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}