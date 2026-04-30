"use client";

import { useState } from "react";
import {
  History,
  UserPlus,
  ArrowRightLeft,
  StickyNote,
  FileText,
  Send,
  MessageSquare,
  Lock,
  Trash2,
  Pencil,
  CreditCard,
  Sparkles,
  LifeBuoy,
  Briefcase,
  Activity,
  ChevronDown,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { ActivityEntry } from "@/lib/activity";

type Descriptor = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const ENTITY_LABELS: Record<string, string> = {
  prospect: "Prospect",
  client: "Client",
  project: "Projet",
  subscription: "Abonnement",
  customization: "Personnalisation",
  ticket: "Ticket support",
};

const ENTITY_ICONS: Record<string, Descriptor["icon"]> = {
  prospect: UserPlus,
  client: UserPlus,
  project: Briefcase,
  subscription: CreditCard,
  customization: Sparkles,
  ticket: LifeBuoy,
};

function describe(action: string, entityType: string): Descriptor {
  switch (action) {
    case "created":
      return { icon: UserPlus, label: `${ENTITY_LABELS[entityType] ?? entityType} créé` };
    case "deleted":
      return { icon: Trash2, label: `${ENTITY_LABELS[entityType] ?? entityType} supprimé` };
    case "updated":
      return { icon: Pencil, label: "Mise à jour" };
    case "status_changed":
      return { icon: ArrowRightLeft, label: "Statut modifié" };
    case "note_added":
      return { icon: StickyNote, label: "Note ajoutée" };
    case "questionnaire_submitted":
      return { icon: FileText, label: "Questionnaire soumis" };
    case "quote_requested":
      return { icon: Send, label: "Demande de devis" };
    case "replied":
      return { icon: MessageSquare, label: "Réponse au ticket" };
    case "internal_note":
      return { icon: Lock, label: "Note interne" };
    default:
      return {
        icon: ENTITY_ICONS[entityType] ?? Activity,
        label: action.replace(/_/g, " "),
      };
  }
}

function formatChange(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return String(value);
  return JSON.stringify(value);
}

function renderMetadata(
  action: string,
  metadata: Record<string, unknown> | null,
): React.ReactNode {
  if (!metadata) return null;
  if (action === "status_changed" && "from" in metadata && "to" in metadata) {
    return (
      <span className="text-xs text-muted-foreground">
        {formatChange(metadata.from)} → {formatChange(metadata.to)}
      </span>
    );
  }
  if (action === "updated") {
    const entries = Object.entries(metadata).filter(
      ([, v]) =>
        v && typeof v === "object" && v !== null && "from" in (v as object) && "to" in (v as object),
    );
    if (entries.length > 0) {
      return (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {entries.map(([key, v]) => {
            const change = v as { from: unknown; to: unknown };
            return (
              <li key={key}>
                <span className="font-medium">{key}</span>{" "}
                : {formatChange(change.from)} → {formatChange(change.to)}
              </li>
            );
          })}
        </ul>
      );
    }
  }
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
      {entries.map(([k, v]) => (
        <li key={k}>
          <span className="font-medium">{k}</span> : {formatChange(v)}
        </li>
      ))}
    </ul>
  );
}

export function ActivityTimeline({
  entries,
  title = "Historique d'activité",
}: {
  entries: ActivityEntry[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const count = entries.length;
  const lastDate = entries[0]?.createdAt;

  return (
    <div className="rounded-xl border border-border/50 bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-muted/40"
      >
        <History className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">
          {count === 0
            ? "aucune action"
            : `${count} action${count > 1 ? "s" : ""}${
                lastDate ? ` · dernière le ${formatDateTime(lastDate)}` : ""
              }`}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-border/50 px-4 py-4">
          {count === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune action enregistrée pour l'instant.
            </p>
          ) : (
            <ol className="relative space-y-4 border-l border-border/60 pl-6">
              {entries.map((e) => {
                const { icon: Icon, label } = describe(e.action, e.entityType);
                const entityLabel = ENTITY_LABELS[e.entityType] ?? e.entityType;
                const actor = e.user
                  ? e.user.name || e.user.email
                  : "Système / public";
                return (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground">
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p className="text-sm font-medium">{label}</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {entityLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(e.createdAt)} · par{" "}
                      <span className="font-medium text-foreground">{actor}</span>
                    </p>
                    {renderMetadata(e.action, e.metadata)}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
