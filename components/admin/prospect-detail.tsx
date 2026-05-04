"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  UserCheck,
  Archive,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatEUR } from "@/lib/format";
import type { ProspectStatus } from "@prisma/client";
import { InternalNotes, type Note } from "@/components/admin/internal-notes";

const STATUSES: ProspectStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATING",
  "WON",
  "LOST",
  "ARCHIVED",
];

const LABELS: Record<ProspectStatus, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  QUALIFIED: "Qualifié",
  PROPOSAL_SENT: "Devis envoyé",
  NEGOTIATING: "Négociation",
  WON: "Gagné",
  LOST: "Perdu",
  ARCHIVED: "Archivé",
};

export function ProspectStatusEditor({
  prospectId,
  initialStatus,
  initialEstimatedValue,
}: {
  prospectId: string;
  initialStatus: ProspectStatus;
  initialEstimatedValue: number | null;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<ProspectStatus>(initialStatus);
  const [value, setValue] = React.useState(
    initialEstimatedValue ? String(Math.round(initialEstimatedValue / 100)) : "",
  );
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          estimatedValue: value ? Math.round(Number(value)) * 100 : null,
        }),
      });
      if (res.ok) {
        setMessage("Enregistré");
        router.refresh();
      } else {
        setMessage("Erreur lors de l'enregistrement");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2000);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Statut & valeur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Étape du funnel
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProspectStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {LABELS[s]}
              </option>
            ))}
          </Select>
          <div className="mt-2">
            <StatusBadge kind="prospect" value={status} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Valeur estimée (€)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="490"
          />
          {value && (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatEUR(Number(value) * 100)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
          {message && (
            <span className="text-xs text-muted-foreground">{message}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProspectContactEditor({
  prospectId,
  initial,
}: {
  prospectId: string;
  initial: {
    companyName: string;
    contactName: string | null;
    email: string;
    phone: string | null;
  };
}) {
  const router = useRouter();
  const [companyName, setCompanyName] = React.useState(initial.companyName);
  const [contactName, setContactName] = React.useState(initial.contactName ?? "");
  const [email, setEmail] = React.useState(initial.email);
  const [phone, setPhone] = React.useState(initial.phone ?? "");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const dirty =
    companyName.trim() !== initial.companyName ||
    contactName.trim() !== (initial.contactName ?? "") ||
    email.trim() !== initial.email ||
    phone.trim() !== (initial.phone ?? "");

  async function save() {
    if (!companyName.trim() || !email.trim()) {
      setMessage("Entreprise et email requis");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactName: contactName.trim() || null,
          email: email.trim(),
          phone: phone.trim() || null,
        }),
      });
      if (res.ok) {
        setMessage("Enregistré");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Erreur lors de l'enregistrement");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Coordonnées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field label="Entreprise" value={companyName} onChange={setCompanyName} />
        <Field
          label="Contact"
          value={contactName}
          onChange={setContactName}
          placeholder="Nom du contact"
        />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field
          label="Téléphone"
          value={phone}
          onChange={setPhone}
          type="tel"
          placeholder="06 12 34 56 78"
        />
        <div className="flex items-center gap-3 pt-1">
          <Button onClick={save} disabled={saving || !dirty} size="sm">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
          {message && (
            <span className="text-xs text-muted-foreground">{message}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export function ProspectActions({
  prospectId,
  hasUser,
  status,
}: {
  prospectId: string;
  hasUser: boolean;
  status: ProspectStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<null | "convert" | "archive" | "delete">(
    null,
  );
  const [message, setMessage] = React.useState<string | null>(null);

  async function convert() {
    if (hasUser) return;
    if (
      !confirm(
        "Convertir ce prospect en client ? Un compte sera créé (ou réutilisé) avec son email.",
      )
    )
      return;
    setBusy("convert");
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/prospects/${prospectId}/convert`,
        { method: "POST" },
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.tempPassword) {
          setMessage(`Compte créé. Mot de passe temporaire : ${data.tempPassword}`);
        } else {
          setMessage("Prospect converti en client.");
        }
        router.refresh();
      } else {
        setMessage(data.error || "Erreur lors de la conversion");
      }
    } finally {
      setBusy(null);
    }
  }

  async function archive() {
    if (status === "ARCHIVED") return;
    setBusy("archive");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/prospects/${prospectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });
      if (res.ok) {
        setMessage("Prospect archivé");
        router.refresh();
      } else {
        setMessage("Erreur lors de l'archivage");
      }
    } finally {
      setBusy(null);
      setTimeout(() => setMessage(null), 2500);
    }
  }

  async function remove() {
    if (
      !confirm(
        "Supprimer définitivement ce prospect ? Cette action est irréversible (les notes et le questionnaire seront supprimés).",
      )
    )
      return;
    setBusy("delete");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/prospects/${prospectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/prospects");
        router.refresh();
      } else {
        setMessage("Erreur lors de la suppression");
        setBusy(null);
      }
    } catch {
      setBusy(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={convert}
          disabled={busy !== null || hasUser}
          size="sm"
          className="w-full justify-start"
        >
          {busy === "convert" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          {hasUser ? "Déjà client" : "Convertir en client"}
        </Button>
        <Button
          onClick={archive}
          disabled={busy !== null || status === "ARCHIVED"}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          {busy === "archive" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
          {status === "ARCHIVED" ? "Archivé" : "Archiver"}
        </Button>
        <Button
          onClick={remove}
          disabled={busy !== null}
          variant="outline"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          {busy === "delete" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Supprimer
        </Button>
        {message && (
          <p className="pt-1 text-xs text-muted-foreground">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ProspectNotes({
  prospectId,
  initialNotes,
}: {
  prospectId: string;
  initialNotes: Note[];
}) {
  return (
    <InternalNotes
      initialNotes={initialNotes}
      addUrl={`/api/admin/prospects/${prospectId}/notes`}
      noteUrl={(noteId) => `/api/admin/prospects/notes/${noteId}`}
    />
  );
}
