import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get('admin') === 'true';

    const where: any = {};
    if (!adminMode) where.isActive = true;

    const products = await prisma.product.findMany({ where, orderBy: { id: 'asc' } });
    const parsedData = products.map(p => ({ ...p, size: JSON.parse(p.size) }));

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}