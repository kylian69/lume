import Link from "next/link";
import { LifeBuoy, Plus, MessageCircle } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/format";
import { formatTicketNumber } from "@/lib/ticket-number";

export const dynamic = "force-dynamic";

export default async function PortalSupportPage() {
  const session = await getSession();
  const userId = session!.user.id;

  const tickets = await prisma.supportTicket.findMany({
    where: { authorId: userId },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Support"
        description="Posez vos questions, signalez un souci. Notre équipe vous répond rapidement."
        actions={
          <Button asChild>
            <Link href="/portal/support/new">
              <Plus className="h-4 w-4" />
              Nouveau ticket
            </Link>
          </Button>
        }
      />

      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Aucun ticket"
          description="Créez votre premier ticket pour échanger avec notre équipe support."
          action={
            <Button asChild>
              <Link href="/portal/support/new">
                <MessageCircle className="h-4 w-4" /> Contacter le support
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/portal/support/${t.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatTicketNumber(t.number)}
                      </span>
                      <p className="truncate text-sm font-semibold">
                        {t.subject}
                      </p>
                      <StatusBadge kind="ticket" value={t.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{t.category}</span>
                      <span>{t._count.messages} message{t._count.messages > 1 ? "s" : ""}</span>
                      <span>{formatRelative(t.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
