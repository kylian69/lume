import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({
  status: z
    .enum(["OPEN", "WAITING_CLIENT", "WAITING_STAFF", "RESOLVED", "CLOSED"])
    .optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
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
  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: {
      ...parsed.data,
      closedAt:
        parsed.data.status === "CLOSED" || parsed.data.status === "RESOLVED"
          ? new Date()
          : undefined,
    },
  });
  await logActivity({
    userId: session.user.id,
    entityType: "ticket",
    entityId: id,
    action: "updated",
    metadata: parsed.data,
  });
  return NextResponse.json({ ok: true, ticket });
}
