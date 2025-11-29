import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function getDefaultCompanyId(userId: string) {
  const cu = await prisma.companyUser.findFirst({ where: { userId } });
  return cu?.companyId || null;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const companyId = await getDefaultCompanyId(user.id);
  if (!companyId) return NextResponse.json([], { status: 200 });

  const leads = await prisma.lead.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const companyId = await getDefaultCompanyId(user.id);
  if (!companyId) return NextResponse.json({ message: 'No company' }, { status: 400 });

  const { name, email } = await req.json();
  if (!name) return NextResponse.json({ message: 'Name required' }, { status: 400 });

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      companyId,
      ownerId: user.id
    }
  });

  return NextResponse.json(lead, { status: 201 });
}
