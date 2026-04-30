import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/email/client";
import { getAdminEmails } from "@/lib/email/recipients";
import { ticketMessageToAdminsTemplate } from "@/lib/email/templates";

const schema = z.object({ content: z.string().min(1) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const ticket = await prisma.supportTicket.findFirst({
    where: { id, authorId: session.user.id },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }
  const message = await prisma.ticketMessage.create({
    data: {
      ticketId: id,
      authorId: session.user.id,
      content: parsed.data.content,
    },
  });
  await prisma.supportTicket.update({
    where: { id },
    data: {
      status: "WAITING_STAFF",
      updatedAt: new Date(),
    },
  });

  const adminEmails = await getAdminEmails();
  if (adminEmails.length > 0) {
    const tpl = ticketMessageToAdminsTemplate({
      ticketId: id,
      subject: ticket.subject,
      isNewTicket: false,
      content: parsed.data.content,
      clientEmail: session.user.email,
      clientName: session.user.name,
    });
    await sendEmail({ to: adminEmails, ...tpl, replyTo: session.user.email });
  }

  return NextResponse.json({ ok: true, message });
}
