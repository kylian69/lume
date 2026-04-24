import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Phone, Globe, Sparkles, LifeBuoy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatDateTime, formatEUR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { createdAt: "desc" } },
      subscriptions: { orderBy: { createdAt: "desc" } },
      tickets: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      customizations: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      prospect: true,
    },
  });
  if (!client) notFound();

  return (
    <div>
      <PageHeader
        title={client.name || client.email}
        description={client.email}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Clients", href: "/admin/clients" },
          { label: client.name || client.email },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projets & sites</CardTitle>
            </CardHeader>
            <CardContent>
              {client.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun projet associé à ce compte.
                </p>
              ) : (
                <div className="space-y-3">
                  {client.projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <StatusBadge kind="project" value={p.status} />
                          <span className="rounded-full bg-background px-2 py-0.5 font-medium text-foreground">
                            {p.planType}
                          </span>
                          {p.domain && (
                            <span className="inline-flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {p.domain}
                            </span>
                          )}
                        </div>
                      </div>
                      {p.previewUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={p.previewUrl} target="_blank" rel="noreferrer">
                            Aperçu
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Personnalisations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.customizations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune demande de personnalisation.
                </p>
              ) : (
                <div className="space-y-2">
                  {client.customizations.map((c) => (
                    <Link
                      key={c.id}
                      href={`/admin/customizations/${c.id}`}
                      className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <StatusBadge kind="customization" value={c.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(c.createdAt)}
                      </p>
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
                Tickets support
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun ticket pour ce client.
                </p>
              ) : (
                <div className="space-y-2">
                  {client.tickets.map((t) => (
                    <Link
                      key={t.id}
                      href={`/admin/support/${t.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {t.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(t.updatedAt)}
                        </p>
                      </div>
                      <StatusBadge kind="ticket" value={t.status} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${client.email}`}
                  className="text-primary hover:underline"
                >
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${client.phone}`}
                    className="text-primary hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Client depuis le {formatDate(client.createdAt)}
              </div>
              {client.prospect && (
                <Link
                  href={`/admin/prospects/${client.prospect.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  Voir la fiche prospect →
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Abonnements</CardTitle>
            </CardHeader>
            <CardContent>
              {client.subscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Pas d'abonnement actif.
                </p>
              ) : (
                <div className="space-y-2">
                  {client.subscriptions.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-border/50 bg-muted/30 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{s.tier}</span>
                        <StatusBadge kind="subscription" value={s.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatEUR(s.monthlyAmount)} / mois · période jusqu'au{" "}
                        {formatDate(s.currentPeriodEnd)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
