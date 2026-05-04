"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InternalNotes, type Note } from "@/components/admin/internal-notes";

export function ClientContactEditor({
  clientId,
  initial,
}: {
  clientId: string;
  initial: { name: string | null; email: string; phone: string | null };
}) {
  const router = useRouter();
  const [name, setName] = React.useState(initial.name ?? "");
  const [email, setEmail] = React.useState(initial.email);
  const [phone, setPhone] = React.useState(initial.phone ?? "");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const dirty =
    name.trim() !== (initial.name ?? "") ||
    email.trim() !== initial.email ||
    phone.trim() !== (initial.phone ?? "");

  async function save() {
    if (!email.trim()) {
      setMessage("Email requis");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
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
        <Field label="Nom" value={name} onChange={setName} placeholder="Nom complet" />
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

export function ClientNotes({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: Note[];
}) {
  return (
    <InternalNotes
      initialNotes={initialNotes}
      addUrl={`/api/admin/clients/${clientId}/notes`}
      noteUrl={(noteId) => `/api/admin/clients/notes/${noteId}`}
    />
  );
}
