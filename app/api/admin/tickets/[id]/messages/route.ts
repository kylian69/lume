import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().optional().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }
  const message = await prisma.ticketMessage.create({
    data: {
      ticketId: id,
      authorId: session.user.id,
      content: parsed.data.content,
      isInternal: parsed.data.isInternal,
    },
  });
  if (!parsed.data.isInternal) {
    await prisma.supportTicket.update({
      where: { id },
      data: {
        status: "WAITING_CLIENT",
        updatedAt: new Date(),
      },
    });
  }
  await logActivity({
    userId: session.user.id,
    entityType: "ticket",
    entityId: id,
    action: parsed.data.isInternal ? "internal_note" : "replied",
  });
  return NextResponse.json({ ok: true, message });
}
