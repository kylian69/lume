"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({
  initialName,
  initialPhone,
}: {
  initialName: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [phone, setPhone] = React.useState(initialPhone);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    setSaving(false);
    setMessage(res.ok ? "Profil mis à jour" : "Erreur — réessayez");
    if (res.ok) router.refresh();
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Nom</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="06 12 34 56 78"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" /> Enregistrer
            </>
          )}
        </Button>
        {message && (
          <span className="text-sm text-muted-foreground">{message}</span>
        )}
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [kind, setKind] = React.useState<"ok" | "err">("ok");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "password",
        currentPassword: current,
        newPassword: next,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setKind("ok");
      setMessage("Mot de passe mis à jour.");
      setCurrent("");
      setNext("");
    } else {
      setKind("err");
      setMessage(data.error || "Erreur");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Mot de passe actuel
        </label>
        <Input
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <Input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          8 caractères minimum.
        </p>
      </div>
      {message && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            kind === "ok"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {message}
        </div>
      )}
      <Button disabled={saving}>
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Mettre à jour"
        )}
      </Button>
    </form>
  );
}
