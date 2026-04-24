import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).default("NORMAL"),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const request = await prisma.customizationRequest.create({
    data: {
      userId: session.user.id,
      projectId: d.projectId ?? null,
      title: d.title,
      description: d.description,
      category: d.category ?? null,
      priority: d.priority,
    },
  });
  await logActivity({
    userId: session.user.id,
    entityType: "customization",
    entityId: request.id,
    action: "created",
  });
  return NextResponse.json({ ok: true, id: request.id });
}
