"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatEUR, formatDateTime } from "@/lib/format";
import type { ProspectStatus } from "@prisma/client";

type Note = {
  id: string;
  content: string;
  createdAt: string | Date;
  author?: { name?: string | null; email: string } | null;
};

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

export function ProspectNotes({
  prospectId,
  initialNotes,
}: {
  prospectId: string;
  initialNotes: Note[];
}) {
  const router = useRouter();
  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [content, setContent] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/prospects/${prospectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: content.trim() }),
    });
    setSaving(false);
    if (res.ok) {
      setNotes((n) => [
        {
          id: `tmp-${Date.now()}`,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          author: null,
        },
        ...n,
      ]);
      setContent("");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <StickyNote className="h-4 w-4 text-primary" />
          Notes internes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Ajouter une note interne (visible uniquement par l'équipe)…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button
              onClick={submit}
              disabled={saving || !content.trim()}
              size="sm"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune note pour ce prospect.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl border border-border/50 bg-muted/30 p-3"
              >
                <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {note.author?.name || note.author?.email || "Équipe"} ·{" "}
                  {formatDateTime(note.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
