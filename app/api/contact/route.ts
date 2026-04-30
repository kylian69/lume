import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureClientUser, logActivity } from "@/lib/accounts";
import { sendEmail } from "@/lib/email/client";
import { getAdminEmails } from "@/lib/email/recipients";
import {
  prospectCreatedTemplate,
  quoteRequestedTemplate,
} from "@/lib/email/templates";

const schema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional().default(""),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  planType: z.enum(["START", "STANDARD", "PRO"]).optional(),
  subscription: z.enum(["NONE", "LIGHT", "COMPLETE"]).optional(),
  budget: z.number().int().optional(),
  timeline: z.string().optional().default(""),
  details: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const account = await ensureClientUser({
      email: d.email,
      name: d.companyName,
      phone: d.phone || undefined,
    });

    let prospect = await prisma.prospect.findFirst({
      where: {
        OR: [
          { userId: account.user.id },
          { email: d.email.toLowerCase() },
        ],
      },
    });
    let isNewProspect = false;
    if (!prospect) {
      prospect = await prisma.prospect.create({
        data: {
          userId: account.user.id,
          companyName: d.companyName,
          contactName: d.contactName || null,
          email: d.email.toLowerCase(),
          phone: d.phone || null,
          status: "NEW",
          source: "QUOTE_FORM",
        },
      });
      isNewProspect = true;
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        prospectId: prospect.id,
        planType: d.planType ?? null,
        subscription: d.subscription ?? null,
        budget: d.budget ?? null,
        timeline: d.timeline || null,
        details: d.details || null,
      },
    });

    await logActivity({
      userId: account.user.id,
      entityType: "prospect",
      entityId: prospect.id,
      action: "quote_requested",
      metadata: { quoteId: quote.id, planType: d.planType },
    });

    const adminEmails = await getAdminEmails();
    if (adminEmails.length > 0) {
      if (isNewProspect) {
        const tpl = prospectCreatedTemplate({
          id: prospect.id,
          companyName: prospect.companyName,
          email: prospect.email,
          phone: prospect.phone,
          source: "QUOTE_FORM",
        });
        await sendEmail({ to: adminEmails, ...tpl });
      }
      const tpl = quoteRequestedTemplate({
        prospectId: prospect.id,
        companyName: prospect.companyName,
        email: prospect.email,
        planType: d.planType ?? null,
        budgetCents: d.budget ?? null,
        timeline: d.timeline || null,
        details: d.details || null,
      });
      await sendEmail({ to: adminEmails, ...tpl });
    }

    return NextResponse.json({
      ok: true,
      prospectId: prospect.id,
      quoteId: quote.id,
      newAccount: !!account.tempPassword,
      tempPassword: account.tempPassword,
    });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
