import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/format";
import type { TicketStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES: TicketStatus[] = [
  "OPEN",
  "WAITING_STAFF",
  "WAITING_CLIENT",
  "RESOLVED",
  "CLOSED",
];

const LABELS: Record<TicketStatus, string> = {
  OPEN: "Ouverts",
  WAITING_STAFF: "À traiter",
  WAITING_CLIENT: "Attente client",
  RESOLVED: "Résolus",
  CLOSED: "Fermés",
};

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = STATUSES.includes(status as TicketStatus)
    ? (status as TicketStatus)
    : undefined;

  const tickets = await prisma.supportTicket.findMany({
    where: filterStatus
      ? { status: filterStatus }
      : { status: { in: ["OPEN", "WAITING_STAFF", "WAITING_CLIENT"] } },
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { messages: true } },
    },
  });

  const counts = await prisma.supportTicket.groupBy({
    by: ["status"],
    _count: true,
  });
  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count] as const),
  );

  return (
    <div>
      <PageHeader
        title="Support"
        description="Tickets de support soumis par les clients. Les personnalisations sont dans un onglet séparé."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill label="En cours" href="/admin/support" active={!filterStatus} />
        {STATUSES.map((s) => (
          <FilterPill
            key={s}
            label={LABELS[s]}
            count={countMap[s]}
            href={`/admin/support?status=${s}`}
            active={filterStatus === s}
          />
        ))}
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Aucun ticket"
          description="Les demandes de support des clients apparaîtront ici."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/support/${t.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {t.subject}
                      </p>
                      <StatusBadge kind="ticket" value={t.status} />
                      <StatusBadge kind="priority" value={t.priority} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{t.author.name || t.author.email}</span>
                      <span>{formatRelative(t.updatedAt)}</span>
                      <span>{t._count.messages} message{t._count.messages > 1 ? "s" : ""}</span>
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

function FilterPill({
  label,
  count,
  href,
  active,
}: {
  label: string;
  count?: number;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {count ? (
        <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[10px]">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
