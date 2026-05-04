import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({ content: z.string().min(1) });

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
  const prospect = await prisma.prospect.findUnique({ where: { id } });
  if (!prospect) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  const note = await prisma.prospectNote.create({
    data: {
      prospectId: id,
      authorId: session.user.id,
      content: parsed.data.content.trim(),
    },
    include: { author: { select: { name: true, email: true } } },
  });
  await logActivity({
    userId: session.user.id,
    entityType: "prospect",
    entityId: id,
    action: "note_added",
  });
  return NextResponse.json({ ok: true, note });
}
