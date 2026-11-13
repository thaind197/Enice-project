'use client';
import { useEffect, useState } from 'react';
import { Table, Tag, Switch, Button, message, Image, Space, Input, Modal, Form, InputNumber, Popconfirm, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // Trạng thái tab: all, active, inactive
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Lấy TOÀN BỘ sản phẩm (cả ẩn cả hiện) để Admin quản lý
      const res = await fetch('/api/products?admin=true');
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      message.error('Lỗi lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleActive = async (id: number, checked: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: checked } : p));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: checked })
      });
      message.success(checked ? 'Đã bật hiển thị' : 'Đã ẩn sản phẩm');
    } catch {
      message.error('Lỗi cập nhật');
      fetchProducts();
    }
  };

  const openEditModal = (record: any) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      brand: record.brand,
      price: record.price,
      salePrice: record.salePrice,
      rating: record.rating,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const id = editingProduct.id;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...values } : p));
      
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      message.success('Đã lưu thay đổi');
      setIsModalOpen(false);
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      message.success('Đã xóa sản phẩm vĩnh viễn');
      fetchProducts();
    } catch {
      message.error('Lỗi khi xóa');
    }
  };

  const columns = [
    { 
      title: 'Ảnh', 
      dataIndex: 'img1', 
      width: 80, 
      render: (img: string) => (
        <Image src={`/${img}`} width={50} height={50} className="object-cover rounded-md" fallback="https://via.placeholder.com/50" />
      ) 
    },
    { 
      title: 'Tên sản phẩm', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text: string, record: any) => (
        <div>
          <div className="font-semibold text-blue-600 line-clamp-2">{text}</div>
          <div className="text-xs text-gray-500">ID: {record.id} | {record.brand}</div>
        </div>
      ) 
    },
    { 
      title: 'Giá bán', 
      dataIndex: 'price', 
      key: 'price', 
      render: (price: number, record: any) => (
        <div>
          {record.salePrice ? (
            <>
              <div className="text-red-600 font-bold">{record.salePrice.toLocaleString('vi-VN')}₫</div>
              <div className="text-gray-400 line-through text-xs">{price.toLocaleString('vi-VN')}₫</div>
            </>
          ) : (
            <div className="font-bold">{price.toLocaleString('vi-VN')}₫</div>
          )}
        </div>
      ) 
    },
    { 
      title: 'Hiển thị', 
      dataIndex: 'isActive', 
      key: 'isActive', 
      render: (isActive: boolean, record: any) => (
        <Switch checked={isActive} onChange={(checked) => toggleActive(record.id, checked)} />
      ) 
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} className="text-blue-500" onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xóa sản phẩm này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Lọc theo Tab và ô tìm kiếm
  const filteredData = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase()) || p.brand.toLowerCase().includes(searchText.toLowerCase());
    if (!matchSearch) return false;

    if (activeTab === 'active') return p.isActive === true;
    if (activeTab === 'inactive') return p.isActive === false;
    return true; // Tab 'all'
  });

  // Đếm số lượng
  const activeCount = products.filter(p => p.isActive).length;
  const inactiveCount = products.length - activeCount;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm">Quản lý toàn bộ sản phẩm của hệ thống</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Thêm Sản phẩm
        </Button>
      </div>

      {/* Thanh công cụ: Tabs trạng thái và Tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 border-b pb-2">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `Tất cả (${products.length})` },
            { key: 'active', label: `Đang hiển thị (${activeCount})` },
            { key: 'inactive', label: `Đang ẩn (${inactiveCount})` },
          ]}
        />
        <Input 
          placeholder="Tìm theo tên hoặc danh mục..." 
          prefix={<SearchOutlined />} 
          size="large"
          className="max-w-md w-full md:w-auto"
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 15, showSizeChanger: true }}
        bordered
      />

      {/* Modal Sửa */}
      <Modal
        title="Sửa thông tin sản phẩm"
        open={isModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Danh mục (Thương hiệu)">
            <Input />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="price" label="Giá gốc (VNĐ)">
              <InputNumber className="w-full" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="salePrice" label="Giá khuyến mãi (VNĐ)">
              <InputNumber className="w-full" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </div>
          <Form.Item name="rating" label="Đánh giá (1-5 sao)">
            <InputNumber min={1} max={5} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}