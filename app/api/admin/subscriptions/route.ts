import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";
import { sendEmail } from "@/lib/email/client";
import { getAdminEmails } from "@/lib/email/recipients";
import { subscriptionCreatedTemplate } from "@/lib/email/templates";

const schema = z.object({
  userId: z.string().min(1),
  projectId: z.string().optional(),
  tier: z.enum(["NONE", "LIGHT", "COMPLETE"]).default("LIGHT"),
  monthlyAmount: z.number().int().nonnegative(),
  currency: z.string().optional(),
  currentPeriodEnd: z.string(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const periodEnd = new Date(d.currentPeriodEnd);
  if (Number.isNaN(periodEnd.getTime())) {
    return NextResponse.json(
      { error: "currentPeriodEnd invalide" },
      { status: 400 },
    );
  }

  const client = await prisma.user.findUnique({
    where: { id: d.userId },
    select: { id: true, email: true, name: true },
  });
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId: d.userId,
      projectId: d.projectId ?? null,
      tier: d.tier,
      monthlyAmount: d.monthlyAmount,
      currency: d.currency ?? "EUR",
      currentPeriodEnd: periodEnd,
    },
  });

  await logActivity({
    userId: session.user.id,
    entityType: "subscription",
    entityId: subscription.id,
    action: "created",
    metadata: { tier: d.tier, monthlyAmount: d.monthlyAmount },
  });

  const adminEmails = await getAdminEmails();
  if (adminEmails.length > 0) {
    const tpl = subscriptionCreatedTemplate({
      subscriptionId: subscription.id,
      clientEmail: client.email,
      clientName: client.name,
      tier: d.tier,
      monthlyAmountCents: d.monthlyAmount,
      currentPeriodEnd: periodEnd,
    });
    await sendEmail({ to: adminEmails, ...tpl });
  }

  return NextResponse.json({ ok: true, subscription });
}
