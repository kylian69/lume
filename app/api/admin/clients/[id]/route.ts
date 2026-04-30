import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({
  name: z.string().optional(),
  phone: z.string().nullable().optional(),
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
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }
  const before = await prisma.user.findUnique({
    where: { id },
    select: { name: true, phone: true },
  });
  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
  });
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  if (before) {
    for (const key of ["name", "phone"] as const) {
      if (key in parsed.data && parsed.data[key] !== before[key]) {
        changes[key] = { from: before[key], to: parsed.data[key] ?? null };
      }
    }
  }
  if (Object.keys(changes).length > 0) {
    await logActivity({
      userId: session.user.id,
      entityType: "client",
      entityId: id,
      action: "updated",
      metadata: changes,
    });
  }
  return NextResponse.json({ ok: true, user });
}
