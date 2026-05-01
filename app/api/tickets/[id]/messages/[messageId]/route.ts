import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/accounts";

// Edit window for non-admin authors (15 minutes after posting).
const USER_EDIT_WINDOW_MS = 15 * 60 * 1000;

const attachmentInput = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  storageKey: z.string().min(1),
});

const patchSchema = z.object({
  content: z.string().min(1).optional(),
  attachmentsToAdd: z.array(attachmentInput).optional(),
  attachmentsToRemove: z.array(z.string()).optional(),
});

async function loadContext(ticketId: string, messageId: string) {
  const message = await prisma.ticketMessage.findFirst({
    where: { id: messageId, ticketId },
    include: { ticket: { select: { authorId: true } } },
  });
  return message;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id, messageId } = await params;
  const message = await loadContext(id, messageId);
  if (!message || message.deletedAt) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isAuthor = message.authorId === session.user.id;
  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isAdmin) {
    // user must also be the ticket author and within the edit window
    if (message.ticket.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (Date.now() - message.createdAt.getTime() > USER_EDIT_WINDOW_MS) {
      return NextResponse.json(
        { error: "Délai de modification dépassé" },
        { status: 403 },
      );
    }
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }
  const { content, attachmentsToAdd, attachmentsToRemove } = parsed.data;

  await prisma.$transaction(async (tx) => {
    if (attachmentsToRemove?.length) {
      await tx.ticketAttachment.deleteMany({
        where: { id: { in: attachmentsToRemove }, messageId },
      });
    }
    if (attachmentsToAdd?.length) {
      await tx.ticketAttachment.createMany({
        data: attachmentsToAdd.map((a) => ({ ...a, messageId })),
      });
    }
    await tx.ticketMessage.update({
      where: { id: messageId },
      data: {
        ...(content !== undefined ? { content } : {}),
        editedAt: new Date(),
      },
    });
  });

  await logActivity({
    userId: session.user.id,
    entityType: "ticket",
    entityId: id,
    action: "message_edited",
    metadata: { messageId, byAdmin: isAdmin },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id, messageId } = await params;
  const message = await loadContext(id, messageId);
  if (!message || message.deletedAt) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isAuthor = message.authorId === session.user.id;
  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isAdmin) {
    if (message.ticket.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (Date.now() - message.createdAt.getTime() > USER_EDIT_WINDOW_MS) {
      return NextResponse.json(
        { error: "Délai de suppression dépassé" },
        { status: 403 },
      );
    }
  }

  await prisma.ticketMessage.update({
    where: { id: messageId },
    data: {
      deletedAt: new Date(),
      deletedById: session.user.id,
    },
  });

  await logActivity({
    userId: session.user.id,
    entityType: "ticket",
    entityId: id,
    action: "message_deleted",
    metadata: { messageId, byAdmin: isAdmin },
  });

  return NextResponse.json({ ok: true });
}
