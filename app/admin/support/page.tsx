import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/format";
import type { Prisma, TicketStatus } from "@prisma/client";

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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string | undefined, endOfDay = false) {
  if (!value || !ISO_DATE.test(value)) return undefined;
  const d = new Date(value + (endOfDay ? "T23:59:59.999" : "T00:00:00"));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function buildHref(params: { status?: string; from?: string; to?: string }) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  const qs = sp.toString();
  return qs ? `/admin/support?${qs}` : "/admin/support";
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
}) {
  const { status, from, to } = await searchParams;

  const isAll = status === "ALL";
  const filterStatus = STATUSES.includes(status as TicketStatus)
    ? (status as TicketStatus)
    : undefined;

  const fromDate = parseDate(from);
  const toDate = parseDate(to, true);

  const where: Prisma.SupportTicketWhereInput = {};
  if (filterStatus) {
    where.status = filterStatus;
  } else if (!isAll) {
    where.status = { in: ["OPEN", "WAITING_STAFF", "WAITING_CLIENT"] };
  }
  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {}),
    };
  }

  const tickets = await prisma.supportTicket.findMany({
    where,
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

  const currentStatusKey = isAll ? "ALL" : filterStatus ?? "";
  const hasDateFilter = Boolean(fromDate || toDate);

  return (
    <div>
      <PageHeader
        title="Support"
        description="Tickets de support soumis par les clients. Les personnalisations sont dans un onglet séparé."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill
          label="En cours"
          href={buildHref({ from, to })}
          active={!filterStatus && !isAll}
        />
        <FilterPill
          label="Tous"
          href={buildHref({ status: "ALL", from, to })}
          active={isAll}
        />
        {STATUSES.map((s) => (
          <FilterPill
            key={s}
            label={LABELS[s]}
            count={countMap[s]}
            href={buildHref({ status: s, from, to })}
            active={filterStatus === s}
          />
        ))}
      </div>

      <form
        method="get"
        action="/admin/support"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3"
      >
        {currentStatusKey ? (
          <input type="hidden" name="status" value={currentStatusKey} />
        ) : null}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="from"
            className="text-xs font-medium text-muted-foreground"
          >
            Du
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={from ?? ""}
            max={to || undefined}
            className="h-9 rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="to"
            className="text-xs font-medium text-muted-foreground"
          >
            Au
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={to ?? ""}
            min={from || undefined}
            className="h-9 rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="h-9 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Filtrer
        </button>
        {hasDateFilter ? (
          <Link
            href={buildHref({ status: currentStatusKey || undefined })}
            className="inline-flex h-9 items-center rounded-full border border-border/60 px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Réinitialiser les dates
          </Link>
        ) : null}
      </form>

      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Aucun ticket"
          description={
            hasDateFilter
              ? "Aucun ticket ne correspond aux filtres sélectionnés."
              : "Les demandes de support des clients apparaîtront ici."
          }
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
