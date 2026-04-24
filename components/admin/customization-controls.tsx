"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CustomizationControls({
  id,
  status,
  priority,
}: {
  id: string;
  status: string;
  priority: string;
}) {
  const router = useRouter();
  const [s, setS] = React.useState(status);
  const [p, setP] = React.useState(priority);
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/customizations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s, priority: p }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Statut
        </label>
        <Select value={s} onChange={(e) => setS(e.target.value)}>
          <option value="SUBMITTED">Soumise</option>
          <option value="IN_REVIEW">En revue</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminée</option>
          <option value="REJECTED">Refusée</option>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Priorité
        </label>
        <Select value={p} onChange={(e) => setP(e.target.value)}>
          <option value="LOW">Faible</option>
          <option value="NORMAL">Normale</option>
          <option value="HIGH">Haute</option>
        </Select>
      </div>
      <Button size="sm" onClick={save} disabled={saving} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
      </Button>
    </div>
  );
}
