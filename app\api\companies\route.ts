import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const companies = await prisma.company.findMany({
    where: { users: { some: { userId: user.id } } },
    select: { id: true, name: true }
  });

  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ message: 'Name required' }, { status: 400 });

  const company = await prisma.company.create({
    data: {
      name,
      users: {
        create: {
          userId: user.id,
          role: 'OWNER'
        }
      }
    }
  });

  return NextResponse.json({ id: company.id, name: company.name }, { status: 201 });
}
