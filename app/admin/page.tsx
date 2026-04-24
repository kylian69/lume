import Link from "next/link";
import {
  Mailbox,
  Users,
  LifeBuoy,
  TrendingUp,
  Sparkles,
  Clock,
  Banknote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEUR, formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalProspects,
    newProspects30d,
    activeClients,
    activeSubscriptions,
    openTickets,
    pendingCustomizations,
    recentProspects,
    recentTickets,
    monthlyRevenueAgg,
  ] = await Promise.all([
    prisma.prospect.count(),
    prisma.prospect.count({ where: { createdAt: { gte: since30 } } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "WAITING_STAFF"] } },
    }),
    prisma.customizationRequest.count({
      where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } },
    }),
    prisma.prospect.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.supportTicket.findMany({
      where: { status: { in: ["OPEN", "WAITING_STAFF"] } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        author: { select: { name: true, email: true } },
      },
    }),
    prisma.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { monthlyAmount: true },
    }),
  ]);

  const mrr = monthlyRevenueAgg._sum.monthlyAmount ?? 0;

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité — prospects, clients, support."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Prospects totaux"
          value={totalProspects}
          icon={Mailbox}
          trend={`+${newProspects30d} sur 30 jours`}
        />
        <StatCard
          label="Clients actifs"
          value={activeClients}
          icon={Users}
          trend={`${activeSubscriptions} abonnements`}
        />
        <StatCard
          label="MRR"
          value={formatEUR(mrr)}
          icon={Banknote}
          trend="Revenu récurrent mensuel"
        />
        <StatCard
          label="Support à traiter"
          value={openTickets}
          icon={LifeBuoy}
          trend={`${pendingCustomizations} personnalisations`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Derniers prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentProspects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun prospect pour l'instant.
              </p>
            ) : (
              <div className="space-y-2">
                {recentProspects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/prospects/${p.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {p.companyName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge kind="prospect" value={p.status} />
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {formatRelative(p.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Support à traiter
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tous les tickets sont traités 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {recentTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/admin/support/${t.id}`}
                    className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-muted/40"
                  >
                    <p className="truncate text-sm font-medium">{t.subject}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {t.author.name || t.author.email}
                      </span>
                      <StatusBadge kind="ticket" value={t.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Demandes de personnalisation en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PendingCustomizations />
        </CardContent>
      </Card>
    </div>
  );
}

async function PendingCustomizations() {
  const list = await prisma.customizationRequest.findMany({
    where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
    },
  });
  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Rien à traiter — excellent travail.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {list.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{r.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {r.user.name || r.user.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge kind="customization" value={r.status} />
            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
              <Clock className="h-3 w-3" /> {formatRelative(r.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
