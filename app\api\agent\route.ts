import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getDefaultCompanyId(userId: string) {
  const cu = await prisma.companyUser.findFirst({ where: { userId } });
  return cu?.companyId || null;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ reply: 'You must be logged in.' }, { status: 401 });

  const { message } = await req.json() as { message: string };
  if (!message) return NextResponse.json({ reply: 'No message.' }, { status: 400 });

  const lower = message.toLowerCase();

  if (lower.includes('create') && lower.includes('lead')) {
    const nameMatch = message.match(/for (.+?)( with|$)/i);
    const emailMatch = message.match(/email ([^\s]+@[^\s]+)/i);

    const name = nameMatch?.[1]?.trim() || 'Unnamed Lead';
    const email = emailMatch?.[1]?.trim();

    const companyId = await getDefaultCompanyId(user.id);
    if (!companyId) {
      return NextResponse.json({ reply: 'You do not belong to any company yet.' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        companyId,
        ownerId: user.id,
        source: 'AGENT'
      }
    });

    return NextResponse.json({
      reply: `I created a lead "${lead.name}" with email ${lead.email || 'N/A'}.`
    });
  }

  if (lower.includes('list') && lower.includes('lead')) {
    const companyId = await getDefaultCompanyId(user.id);
    if (!companyId) {
      return NextResponse.json({ reply: 'You do not belong to any company yet.' });
    }

    const leads = await prisma.lead.findMany({
      where: { companyId, ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (!leads.length) {
      return NextResponse.json({ reply: 'You have no leads yet.' });
    }

    const summary = leads.map(l => `${l.name} (${l.email ?? 'no email'}) - ${l.status}`).join('; ');
    return NextResponse.json({ reply: `Here are your recent leads: ${summary}` });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: "Agent is limited because OPENAI_API_KEY is not set."
    });
  }

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `User said: "${message}". Respond as a helpful assistant for the business platform.`
  });

  const replyText = completion.output[0].content[0].type === 'output_text'
    ? completion.output[0].content[0].text
    : 'I received your message.';

  return NextResponse.json({ reply: replyText });
}
