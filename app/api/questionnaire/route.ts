import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureClientUser, logActivity } from "@/lib/accounts";

const schema = z.object({
  metier: z.string().optional().default(""),
  metierCustom: z.string().optional().default(""),
  objectifs: z.array(z.string()).optional().default([]),
  objectifCustom: z.string().optional().default(""),
  style: z.string().optional().default(""),
  inspiration: z.string().optional().default(""),
  logoName: z.string().optional().default(""),
  logoPreview: z.string().optional().default(""),
  couleur: z.string().optional().default(""),
  fonctionnalites: z.array(z.string()).optional().default([]),
  siteActuel: z.string().optional().default(""),
  googleBusiness: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  facebook: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  entreprise: z.string().min(1, "Nom d'entreprise requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const account = await ensureClientUser({
      email: data.email,
      name: data.entreprise,
      phone: data.telephone || undefined,
    });

    // Cherche un prospect existant pour cet email / user
    let prospect = await prisma.prospect.findFirst({
      where: {
        OR: [
          { userId: account.user.id },
          { email: data.email.toLowerCase() },
        ],
      },
      include: { questionnaire: true },
    });

    if (!prospect) {
      prospect = await prisma.prospect.create({
        data: {
          userId: account.user.id,
          companyName: data.entreprise,
          contactName: data.entreprise,
          email: data.email.toLowerCase(),
          phone: data.telephone || null,
          status: "NEW",
          source: "QUESTIONNAIRE",
        },
        include: { questionnaire: true },
      });
      await logActivity({
        entityType: "prospect",
        entityId: prospect.id,
        action: "created",
        metadata: { source: "questionnaire" },
      });
    } else if (!prospect.userId) {
      await prisma.prospect.update({
        where: { id: prospect.id },
        data: { userId: account.user.id },
      });
    }

    const questionnairePayload = {
      metier: data.metier || null,
      metierCustom: data.metierCustom || null,
      objectifs: JSON.stringify(data.objectifs),
      objectifCustom: data.objectifCustom || null,
      style: data.style || null,
      inspiration: data.inspiration || null,
      logoName: data.logoName || null,
      logoPreview: data.logoPreview || null,
      couleur: data.couleur || null,
      fonctionnalites: JSON.stringify(data.fonctionnalites),
      siteActuel: data.siteActuel || null,
      googleBusiness: data.googleBusiness || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      linkedin: data.linkedin || null,
      message: data.message || null,
    };

    if (prospect.questionnaire) {
      await prisma.questionnaireResponse.update({
        where: { id: prospect.questionnaire.id },
        data: questionnairePayload,
      });
    } else {
      await prisma.questionnaireResponse.create({
        data: { ...questionnairePayload, prospectId: prospect.id },
      });
    }

    await logActivity({
      userId: account.user.id,
      entityType: "prospect",
      entityId: prospect.id,
      action: "questionnaire_submitted",
    });

    return NextResponse.json({
      ok: true,
      prospectId: prospect.id,
      newAccount: !!account.tempPassword,
      tempPassword: account.tempPassword,
    });
  } catch (err) {
    console.error("[/api/questionnaire]", err);
    return NextResponse.json(
      { error: "Erreur interne. Merci de réessayer." },
      { status: 500 },
    );
  }
}
