# ENICE

Hai ứng dụng Node.js (cần Node 18 trở lên):

- `web2/` — trang bán hàng cho khách + máy chủ dữ liệu (sản phẩm, ảnh, ưu đãi, lượt truy cập).
- `web1/` — trang quản trị, chỉ có 1 tài khoản; gọi sang web sản phẩm để sửa dữ liệu.

## Chạy trên máy cá nhân

Cho mỗi thư mục (`web2` trước, `web1` sau):
1. `npm install`
2. Sao chép `.env.example` thành `.env`, điền giá trị (xem chú thích trong file).
3. `npm start`



Khách xem: http://localhost:3001 — Quản trị: http://localhost:3002



## Không đưa lên GitHub
`.env`, `users.json`, `node_modules/`, `trash.json`, `promotions.json`, `visits.json`, `products.bak.js`, file `.bat` chứa mật khẩu.
Nên để repo ở chế độ **Private**.



## Cập nhật lên máy chủ thật
Chỉ chép đè file mã nguồn (`server.js`, `public/index.html`, `public/login.html`, `public/product-card.css`...).
**Không** chép đè `public/products.js`, thư mục `public/key/` và các file `.json` trên máy chủ, vì đó là dữ liệu đang chạy thật.
