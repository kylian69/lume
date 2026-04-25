"use client";

import * as React from "react";
import {
  ChefHat,
  Hammer,
  Briefcase,
  Stethoscope,
  Star,
  Clock,
  MapPin,
  Phone,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateId = "restaurateur" | "artisan" | "consultant" | "sante";

type MockupProps = {
  id: TemplateId;
  /** When true, renders a denser version optimized for the gallery thumbnail. */
  compact?: boolean;
  className?: string;
};

/**
 * Stylized in-browser mockups that visually evoke each trade's website.
 * Used both as gallery thumbnail and inside the preview modal.
 */
export function TemplateMockup({ id, compact = false, className }: MockupProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border border-white/60 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900",
        className
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2 dark:border-white/10">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 hidden h-3 flex-1 rounded-full bg-black/5 dark:bg-white/5 sm:block" />
      </div>

      <div className={cn("text-zinc-900 dark:text-zinc-100", compact ? "text-[8px]" : "text-[11px] sm:text-xs")}>
        {id === "restaurateur" && <RestaurateurMockup compact={compact} />}
        {id === "artisan" && <ArtisanMockup compact={compact} />}
        {id === "consultant" && <ConsultantMockup compact={compact} />}
        {id === "sante" && <SanteMockup compact={compact} />}
      </div>
    </div>
  );
}

// ---------- Shared building blocks ----------

function SiteHeader({
  brand,
  links,
  cta,
  accent,
  Icon,
}: {
  brand: string;
  links: string[];
  cta: string;
  accent: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-black/5 px-3 py-2 dark:border-white/10">
      <div className="flex items-center gap-1.5">
        <span className={cn("flex h-4 w-4 items-center justify-center rounded-md text-white", accent)}>
          <Icon className="h-2.5 w-2.5" />
        </span>
        <span className="font-semibold tracking-tight">{brand}</span>
      </div>
      <div className="hidden items-center gap-2 text-[0.65rem] text-zinc-500 dark:text-zinc-400 sm:flex">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <span className={cn("rounded-full px-2 py-0.5 text-[0.6rem] font-medium text-white", accent)}>
        {cta}
      </span>
    </div>
  );
}

// ---------- Per-trade mockups ----------

function RestaurateurMockup({ compact }: { compact: boolean }) {
  return (
    <div>
      <SiteHeader
        brand="Le Lume"
        links={["Carte", "Réserver", "Contact"]}
        cta="Réserver"
        accent="bg-amber-500"
        Icon={ChefHat}
      />

      <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 px-3 py-3 dark:from-amber-500/10 dark:to-orange-500/5">
        <p className="text-[0.6rem] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
          Cuisine de saison
        </p>
        <p className="mt-0.5 font-serif text-base font-semibold leading-tight sm:text-lg">
          Une table où le produit raconte l&apos;histoire.
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[0.65rem] text-zinc-600 dark:text-zinc-400">
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <span className="ml-1">4,9 · 312 avis</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-3">
        {[
          { name: "Entrée", price: "14 €" },
          { name: "Plat", price: "26 €" },
          { name: "Dessert", price: "11 €" },
        ].map((d) => (
          <div
            key={d.name}
            className="rounded-md border border-black/5 bg-white p-1.5 dark:border-white/10 dark:bg-white/5"
          >
            <div className="aspect-[4/3] rounded bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-500/20 dark:to-orange-500/10" />
            <p className="mt-1 truncate font-medium">{d.name}</p>
            <p className="text-[0.6rem] text-zinc-500 dark:text-zinc-400">{d.price}</p>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-2 border-t border-black/5 px-3 py-2 text-[0.65rem] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-600" />
            Mar-Sam · 12h-14h, 19h-22h
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-amber-600" />
            12 rue de Lyon, Paris
          </div>
        </div>
      )}
    </div>
  );
}

function ArtisanMockup({ compact }: { compact: boolean }) {
  return (
    <div>
      <SiteHeader
        brand="Atelier Lume"
        links={["Réalisations", "Métier", "Devis"]}
        cta="Devis"
        accent="bg-zinc-700"
        Icon={Hammer}
      />

      <div className="bg-gradient-to-br from-zinc-50 to-zinc-200/60 px-3 py-3 dark:from-white/5 dark:to-white/0">
        <p className="text-[0.6rem] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Menuiserie · Sur mesure
        </p>
        <p className="mt-0.5 text-base font-semibold leading-tight sm:text-lg">
          Le bois travaillé avec exigence.
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[0.65rem] text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Award className="h-2.5 w-2.5" /> 18 ans d&apos;expérience
          </span>
          <span>·</span>
          <span>Île-de-France</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"
          >
            <div className="h-full w-full rounded-md bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
          </div>
        ))}
      </div>

      {!compact && (
        <div className="border-t border-black/5 px-3 py-2 dark:border-white/10">
          <div className="flex items-center justify-between text-[0.65rem]">
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <Phone className="h-3 w-3" /> 06 12 34 56 78
            </div>
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[0.6rem] font-medium text-white dark:bg-white dark:text-zinc-900">
              Demander un devis
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultantMockup({ compact }: { compact: boolean }) {
  return (
    <div>
      <SiteHeader
        brand="Lume Conseil"
        links={["Expertises", "Cas clients", "À propos"]}
        cta="Échanger"
        accent="bg-indigo-600"
        Icon={Briefcase}
      />

      <div className="bg-gradient-to-br from-indigo-50 to-blue-100/60 px-3 py-3 dark:from-indigo-500/10 dark:to-blue-500/5">
        <p className="text-[0.6rem] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          Stratégie & transformation
        </p>
        <p className="mt-0.5 text-base font-semibold leading-tight sm:text-lg">
          Des décisions claires, un cap tenu.
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            { v: "15 ans", l: "d'expertise", I: TrendingUp },
            { v: "50+", l: "clients accompagnés", I: Users },
            { v: "94%", l: "renouvellements", I: CheckCircle2 },
          ].map(({ v, l, I }) => (
            <div
              key={l}
              className="rounded-md border border-indigo-100 bg-white p-1.5 dark:border-white/10 dark:bg-white/5"
            >
              <I className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-0.5 font-semibold leading-none">{v}</p>
              <p className="text-[0.55rem] text-zinc-500 dark:text-zinc-400">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 p-3">
        {["Stratégie d'entreprise", "Transformation organisationnelle", "Pilotage de la performance"].map((s) => (
          <div
            key={s}
            className="flex items-center justify-between rounded-md border border-black/5 bg-white px-2 py-1 dark:border-white/10 dark:bg-white/5"
          >
            <span className="font-medium">{s}</span>
            <span className="text-[0.6rem] text-indigo-600 dark:text-indigo-400">→</span>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="border-t border-black/5 bg-indigo-50/40 px-3 py-2 text-[0.65rem] text-zinc-600 dark:border-white/10 dark:bg-indigo-500/5 dark:text-zinc-400">
          « Un accompagnement structuré qui a transformé notre comité de direction. »
          <span className="ml-1 text-zinc-400">— C. Dupont, COO</span>
        </div>
      )}
    </div>
  );
}

function SanteMockup({ compact }: { compact: boolean }) {
  const slots = ["09:30", "10:15", "11:00", "14:30", "15:15", "16:00"];
  const visible = compact ? slots.slice(0, 3) : slots;

  return (
    <div>
      <SiteHeader
        brand="Cabinet Lume"
        links={["Le praticien", "Soins", "Accès"]}
        cta="Prendre RDV"
        accent="bg-emerald-600"
        Icon={Stethoscope}
      />

      <div className="bg-gradient-to-br from-emerald-50 to-teal-100/60 px-3 py-3 dark:from-emerald-500/10 dark:to-teal-500/5">
        <p className="text-[0.6rem] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Médecine générale
        </p>
        <p className="mt-0.5 text-base font-semibold leading-tight sm:text-lg">
          Dr. Martin · Consultations sur RDV
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[0.65rem] text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" /> Lyon 6ᵉ
          </span>
          <span>·</span>
          <span>Conventionné · Carte vitale</span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Disponibilités · Aujourd&apos;hui</p>
          <span className="flex items-center gap-1 text-[0.6rem] text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-2.5 w-2.5" /> En ligne
          </span>
        </div>
        <div className={cn("mt-1.5 grid gap-1", compact ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-6")}>
          {visible.map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-md border text-center text-[0.65rem] font-medium",
                compact ? "py-1" : "py-1.5",
                i === 1
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-500/30 dark:bg-white/5 dark:text-emerald-300"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-2 border-t border-black/5 px-3 py-2 text-[0.65rem] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-emerald-600" />
            Lun-Ven · 9h-19h
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-emerald-600" />
            04 78 12 34 56
          </div>
        </div>
      )}
    </div>
  );
}
