import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const createSchema = z.object({
  subject: z.string().min(3, "Sujet trop court"),
  category: z
    .enum(["TECHNIQUE", "FACTURATION", "CONTENU", "FONCTIONNALITE", "AUTRE"])
    .default("AUTRE"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  content: z.string().min(10, "Message trop court"),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const ticket = await prisma.supportTicket.create({
    data: {
      authorId: session.user.id,
      subject: d.subject,
      category: d.category,
      priority: d.priority,
      status: "OPEN",
      projectId: d.projectId ?? null,
      messages: {
        create: {
          authorId: session.user.id,
          content: d.content,
        },
      },
    },
  });
  await logActivity({
    userId: session.user.id,
    entityType: "ticket",
    entityId: ticket.id,
    action: "created",
  });
  return NextResponse.json({ ok: true, ticketId: ticket.id });
}

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const tickets = await prisma.supportTicket.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      subject: true,
      status: true,
      priority: true,
      category: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ tickets });
}
