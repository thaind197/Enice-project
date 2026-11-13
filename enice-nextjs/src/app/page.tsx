'use client'; // Chuyển thành Client Component để dùng tìm kiếm/phân trang

import { useEffect, useState } from 'react';
import { Card, Tag, Rate, Input, Pagination, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Số sản phẩm trên 1 trang

  // Gọi API lấy toàn bộ sản phẩm đang hiển thị
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products'); // API mặc định đã lọc isActive: true
        const json = await res.json();
        setProducts(json.data || []);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Lọc theo ô tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchText.toLowerCase())
  );

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">ENICE</h1>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
             Đăng nhập
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Thanh tìm kiếm và tiêu đề */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Tất cả sản phẩm <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} sản phẩm)</span>
          </h2>
          <Input 
            size="large"
            placeholder="Tìm kiếm sản phẩm, danh mục..." 
            prefix={<SearchOutlined />} 
            className="max-w-md w-full md:w-auto"
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
            allowClear
          />
        </div>
        
        {/* Hiển thị trạng thái Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Đang tải sản phẩm..." />
          </div>
        ) : (
          <>
            {/* Lưới sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <Card
                  key={product.id}
                  hoverable
                  cover={
                    <div className="h-56 overflow-hidden bg-gray-100 relative">
                      <img 
                        src={`/${product.img1}`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isTopseller && (
                        <Tag color="gold" className="absolute top-2 left-2 font-semibold">
                          🔥 Top Bán Chạy
                        </Tag>
                      )}
                      {product.salePrice && (
                        <Tag color="red" className="absolute top-2 right-2 font-semibold">
                          -{Math.round((1 - product.salePrice / product.price) * 100)}%
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <div className="flex flex-col gap-2">
                    <Tag color="blue" className="w-fit">{product.brand}</Tag>
                    <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                    <Rate disabled defaultValue={product.rating} className="text-sm" />
                    
                    <div className="mt-2">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-bold text-lg">{formatPrice(product.salePrice)}</span>
                          <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Không tìm thấy sản phẩm */}
            {filteredProducts.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Không tìm thấy sản phẩm nào phù hợp với từ khóa.
              </div>
            )}

            {/* Thanh Phân trang */}
            {filteredProducts.length > pageSize && (
              <div className="flex justify-center mt-10">
                <Pagination 
                  current={currentPage} 
                  total={filteredProducts.length} 
                  pageSize={pageSize} 
                  onChange={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}