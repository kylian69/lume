"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ThreadMessage = {
  id: string;
  content: string;
  isInternal?: boolean;
  createdAt: string | Date;
  author: {
    name?: string | null;
    email: string;
    role?: string;
  };
};

export function TicketThread({
  ticketId,
  subject,
  status,
  priority,
  category,
  messages,
  scope, // "portal" | "admin"
  allowStatusChange,
}: {
  ticketId: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  messages: ThreadMessage[];
  scope: "portal" | "admin";
  allowStatusChange?: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = React.useState("");
  const [internal, setInternal] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState(status);
  const [currentPriority, setCurrentPriority] = React.useState(priority);

  const endpoint =
    scope === "portal"
      ? `/api/portal/tickets/${ticketId}/messages`
      : `/api/admin/tickets/${ticketId}/messages`;

  async function send() {
    if (!content.trim()) return;
    setSending(true);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ...(scope === "admin" ? { isInternal: internal } : {}),
      }),
    });
    setSending(false);
    if (res.ok) {
      setContent("");
      setInternal(false);
      router.refresh();
    }
  }

  async function updateStatus(newStatus: string) {
    if (scope !== "admin") return;
    setCurrentStatus(newStatus);
    await fetch(`/api/admin/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function updatePriority(newPriority: string) {
    if (scope !== "admin") return;
    setCurrentPriority(newPriority);
    await fetch(`/api/admin/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{subject}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge kind="ticket" value={currentStatus} />
                <StatusBadge kind="priority" value={currentPriority} />
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {category}
                </span>
              </div>
            </div>
            {allowStatusChange && (
              <div className="flex flex-wrap gap-2">
                <Select
                  value={currentStatus}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="h-9 w-auto"
                >
                  <option value="OPEN">Ouvert</option>
                  <option value="WAITING_STAFF">À traiter</option>
                  <option value="WAITING_CLIENT">Attente client</option>
                  <option value="RESOLVED">Résolu</option>
                  <option value="CLOSED">Fermé</option>
                </Select>
                <Select
                  value={currentPriority}
                  onChange={(e) => updatePriority(e.target.value)}
                  className="h-9 w-auto"
                >
                  <option value="LOW">Faible</option>
                  <option value="NORMAL">Normale</option>
                  <option value="HIGH">Haute</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {messages.map((m) => {
          const isStaff = m.author.role === "ADMIN";
          return (
            <div
              key={m.id}
              className={cn(
                "rounded-2xl border p-4",
                m.isInternal
                  ? "border-amber-500/30 bg-amber-500/5"
                  : isStaff
                    ? "border-primary/20 bg-primary/5"
                    : "border-border/60 bg-card",
              )}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-2 font-medium">
                  {m.isInternal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Lock className="h-3 w-3" /> Note interne
                    </span>
                  )}
                  {m.author.name || m.author.email}
                  {isStaff && (
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      Équipe Lume
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {formatDateTime(m.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea
            placeholder={
              scope === "admin"
                ? "Écrire une réponse au client…"
                : "Répondre à l'équipe Lume…"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            {scope === "admin" ? (
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={internal}
                  onChange={(e) => setInternal(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Note interne (invisible au client)
              </label>
            ) : (
              <span />
            )}
            <Button onClick={send} disabled={sending || !content.trim()}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Envoyer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
