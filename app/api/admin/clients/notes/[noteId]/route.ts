import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({ content: z.string().min(1) });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { noteId } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }
  const existing = await prisma.clientNote.findUnique({ where: { id: noteId } });
  if (!existing) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  const note = await prisma.clientNote.update({
    where: { id: noteId },
    data: { content: parsed.data.content.trim() },
    include: { author: { select: { name: true, email: true } } },
  });
  await logActivity({
    userId: session.user.id,
    entityType: "client",
    entityId: existing.clientId,
    action: "note_updated",
  });
  return NextResponse.json({ ok: true, note });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { noteId } = await params;
  const existing = await prisma.clientNote.findUnique({ where: { id: noteId } });
  if (!existing) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  await prisma.clientNote.delete({ where: { id: noteId } });
  await logActivity({
    userId: session.user.id,
    entityType: "client",
    entityId: existing.clientId,
    action: "note_deleted",
  });
  return NextResponse.json({ ok: true });
}
