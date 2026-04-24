import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm, PasswordForm } from "@/components/portal/profile-forms";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PortalProfilePage() {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  return (
    <div>
      <PageHeader
        title="Mon profil"
        description="Gérez vos informations personnelles et votre mot de passe."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-xl bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Email de connexion</p>
              <p className="mt-0.5 font-medium">{user?.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Client depuis le {formatDate(user?.createdAt ?? null)}
              </p>
            </div>
            <ProfileForm
              initialName={user?.name ?? ""}
              initialPhone={user?.phone ?? ""}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
