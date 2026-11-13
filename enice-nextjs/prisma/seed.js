const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang đọc products.js...');
  const productsFile = fs.readFileSync(path.join(__dirname, '../products.js'), 'utf8');
  const window = {};
  eval(productsFile);
  const oldProducts = window.products;

  for (const p of oldProducts) {
    await prisma.product.create({
      data: {
        name: p.name || 'Chưa có tên',
        price: p.price || 0,
        salePrice: p.salePrice || null,
        brand: p.brand || 'Khác',
        rating: p.rating || 5,
        isTopseller: p.isTopseller || false,
        isActive: true,
        img1: p.img1 || '',
        size: JSON.stringify(p.size || []),
        desc: p.desc || '',
      }
    });
  }

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', passwordHash: 'admin123', role: 'admin' }
  });

  console.log(`🎉 Đã nạp thành công ${oldProducts.length} sản phẩm!`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());