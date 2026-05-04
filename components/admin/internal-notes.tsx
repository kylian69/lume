"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, StickyNote, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

export type Note = {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  author?: { name?: string | null; email: string } | null;
};

export function InternalNotes({
  initialNotes,
  addUrl,
  noteUrl,
  title = "Notes internes",
}: {
  initialNotes: Note[];
  addUrl: string;
  noteUrl: (noteId: string) => string;
  title?: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [content, setContent] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingContent, setEditingContent] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function add() {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch(addUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim() }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      if (data.note) {
        setNotes((n) => [data.note, ...n]);
      }
      setContent("");
      router.refresh();
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditingContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingContent("");
  }

  async function saveEdit(id: string) {
    if (!editingContent.trim()) return;
    setBusyId(id);
    const res = await fetch(noteUrl(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editingContent.trim() }),
    });
    setBusyId(null);
    if (res.ok) {
      const data = await res.json();
      setNotes((list) =>
        list.map((n) => (n.id === id ? { ...n, ...(data.note || {}) } : n)),
      );
      cancelEdit();
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette note ?")) return;
    setBusyId(id);
    const res = await fetch(noteUrl(id), { method: "DELETE" });
    setBusyId(null);
    if (res.ok) {
      setNotes((list) => list.filter((n) => n.id !== id));
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <StickyNote className="h-4 w-4 text-primary" />
          {title}
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
              onClick={add}
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
            Aucune note pour le moment.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => {
              const isEditing = editingId === note.id;
              const busy = busyId === note.id;
              return (
                <li
                  key={note.id}
                  className="rounded-xl border border-border/50 bg-muted/30 p-3"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={busy}
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(note.id)}
                          disabled={busy || !editingContent.trim()}
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="whitespace-pre-wrap text-sm">
                          {note.content}
                        </p>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(note)}
                            disabled={busy}
                            className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50"
                            aria-label="Modifier la note"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(note.id)}
                            disabled={busy}
                            className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-destructive disabled:opacity-50"
                            aria-label="Supprimer la note"
                          >
                            {busy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {note.author?.name || note.author?.email || "Équipe"} ·{" "}
                        {formatDateTime(note.createdAt)}
                        {note.updatedAt &&
                        new Date(note.updatedAt).getTime() -
                          new Date(note.createdAt).getTime() >
                          1000
                          ? " · modifiée"
                          : ""}
                      </p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
