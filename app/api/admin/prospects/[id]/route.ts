import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const patchSchema = z.object({
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "PROPOSAL_SENT",
      "NEGOTIATING",
      "WON",
      "LOST",
      "ARCHIVED",
    ])
    .optional(),
  estimatedValue: z.number().int().nullable().optional(),
  companyName: z.string().min(1).optional(),
  contactName: z.string().nullable().optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  note: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }
  const existing = await prisma.prospect.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const { note, ...rest } = parsed.data;
  const updates: Record<string, unknown> = { ...rest };
  if (rest.email) updates.email = rest.email.toLowerCase().trim();
  if (rest.status && rest.status !== existing.status) {
    updates.stageChangedAt = new Date();
  }

  const updated = await prisma.prospect.update({
    where: { id },
    data: updates,
  });

  if (rest.status && rest.status !== existing.status) {
    await logActivity({
      userId: session.user.id,
      entityType: "prospect",
      entityId: id,
      action: "status_changed",
      metadata: { from: existing.status, to: rest.status },
    });
  }

  const infoChanged: Record<string, unknown> = {};
  for (const key of ["companyName", "contactName", "email", "phone"] as const) {
    if (rest[key] !== undefined && rest[key] !== existing[key]) {
      infoChanged[key] = { from: existing[key], to: rest[key] };
    }
  }
  if (Object.keys(infoChanged).length > 0) {
    await logActivity({
      userId: session.user.id,
      entityType: "prospect",
      entityId: id,
      action: "info_updated",
      metadata: infoChanged,
    });
  }

  if (note && note.trim()) {
    await prisma.prospectNote.create({
      data: {
        prospectId: id,
        authorId: session.user.id,
        content: note.trim(),
      },
    });
    await logActivity({
      userId: session.user.id,
      entityType: "prospect",
      entityId: id,
      action: "note_added",
    });
  }

  return NextResponse.json({ ok: true, prospect: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const existing = await prisma.prospect.findUnique({
    where: { id },
    select: { companyName: true, email: true },
  });
  await prisma.prospect.delete({ where: { id } });
  if (existing) {
    await logActivity({
      userId: session.user.id,
      entityType: "prospect",
      entityId: id,
      action: "deleted",
      metadata: existing,
    });
  }
  return NextResponse.json({ ok: true });
}
