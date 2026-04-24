import Link from "next/link";
import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomizationsPage() {
  const requests = await prisma.customizationRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Demandes de personnalisation"
        description="Toutes les demandes d'évolution envoyées par les clients depuis leur espace."
      />

      {requests.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucune demande"
          description="Les demandes de personnalisation envoyées par les clients apparaîtront ici."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {requests.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/customizations/${r.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <StatusBadge kind="customization" value={r.status} />
                      <StatusBadge kind="priority" value={r.priority} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {r.user.name || r.user.email} · {formatRelative(r.createdAt)}
                      {r.category ? ` · ${r.category}` : ""}
                    </p>
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
