import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Chào mừng trở lại, Admin!</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-2">Hệ thống Quản trị ENICE</h2>
        <p className="text-gray-600">Sử dụng thanh menu bên trái để điều hướng các chức năng.</p>
      </div>
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg inline-block">
        👉 Đi tới <Link href="/admin/san-pham" className="font-bold underline">Quản lý sản phẩm</Link> để bật/tắt hiển thị.
      </div>
    </div>
  );
}