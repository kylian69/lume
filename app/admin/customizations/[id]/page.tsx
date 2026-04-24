import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CustomizationControls } from "@/components/admin/customization-controls";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await prisma.customizationRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } },
    },
  });
  if (!request) notFound();

  return (
    <div>
      <PageHeader
        title={request.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Personnalisations", href: "/admin/customizations" },
          { label: request.title },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/customizations">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusBadge kind="customization" value={request.status} />
                <StatusBadge kind="priority" value={request.priority} />
                {request.category && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {request.category}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm">
                {request.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Soumise le {formatDateTime(request.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{request.user.name || "—"}</p>
              <a
                href={`mailto:${request.user.email}`}
                className="block text-xs text-primary hover:underline"
              >
                {request.user.email}
              </a>
              <Link
                href={`/admin/clients/${request.user.id}`}
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                Voir la fiche client →
              </Link>
              {request.project && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Projet : {request.project.name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomizationControls
                id={request.id}
                status={request.status}
                priority={request.priority}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
