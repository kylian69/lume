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

const DESIGN_WIDTH = 480;
const DESIGN_HEIGHT = 360;

/**
 * Scales a fixed design (DESIGN_WIDTH x DESIGN_HEIGHT) to fit any container
 * while preserving the 4:3 aspect ratio. Avoids viewport-breakpoint surprises
 * when a "site preview" is rendered inside a small thumbnail.
 */
export function FittedMockup({
  id,
  className,
}: {
  id: TemplateId;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      setScale(Math.min(w / DESIGN_WIDTH, h / DESIGN_HEIGHT));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale || 0.0001})`,
          transformOrigin: "center center",
          opacity: scale ? 1 : 0,
        }}
      >
        <TemplateMockup id={id} />
      </div>
    </div>
  );
}

/**
 * The fixed-size 480×360 site mockup. Always rendered at design size; use
 * <FittedMockup /> to embed it in arbitrary containers.
 */
export function TemplateMockup({ id }: { id: TemplateId }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/60 bg-white text-[11px] text-zinc-900 shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-black/5 px-3 py-2 dark:border-white/10">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-black/5 dark:bg-white/5" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {id === "restaurateur" && <RestaurateurMockup />}
        {id === "artisan" && <ArtisanMockup />}
        {id === "consultant" && <ConsultantMockup />}
        {id === "sante" && <SanteMockup />}
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
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-black/5 px-4 py-2.5 dark:border-white/10">
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white",
            accent
          )}
        >
          <Icon className="h-3 w-3" />
        </span>
        <span className="truncate font-semibold tracking-tight">{brand}</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-zinc-500 dark:text-zinc-400">
        {links.map((l) => (
          <span key={l} className="whitespace-nowrap">
            {l}
          </span>
        ))}
      </div>
      <span
        className={cn(
          "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium text-white",
          accent
        )}
      >
        {cta}
      </span>
    </div>
  );
}

// ---------- Per-trade mockups ----------

function RestaurateurMockup() {
  return (
    <>
      <SiteHeader
        brand="Le Lume"
        links={["Carte", "Réserver", "Contact"]}
        cta="Réserver"
        accent="bg-amber-500"
        Icon={ChefHat}
      />

      <div className="shrink-0 bg-gradient-to-br from-amber-50 to-orange-100/60 px-4 py-3 dark:from-amber-500/10 dark:to-orange-500/5">
        <p className="text-[9px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
          Cuisine de saison
        </p>
        <p className="mt-0.5 font-serif text-[15px] font-semibold leading-tight">
          Une table où le produit raconte l&apos;histoire.
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400">
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <span className="ml-1">4,9 · 312 avis</span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2 p-3">
        {[
          { name: "Entrée", price: "14 €" },
          { name: "Plat", price: "26 €" },
          { name: "Dessert", price: "11 €" },
        ].map((d) => (
          <div
            key={d.name}
            className="flex flex-col rounded-md border border-black/5 bg-white p-1.5 dark:border-white/10 dark:bg-white/5"
          >
            <div className="aspect-[4/3] rounded bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-500/20 dark:to-orange-500/10" />
            <p className="mt-1 truncate text-[11px] font-medium">{d.name}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {d.price}
            </p>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-black/5 px-4 py-2 text-[10px] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-amber-600" />
          Mar-Sam · 12h-14h · 19h-22h
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-amber-600" />
          12 rue de Lyon, Paris
        </span>
      </div>
    </>
  );
}

function ArtisanMockup() {
  return (
    <>
      <SiteHeader
        brand="Atelier Lume"
        links={["Réalisations", "Métier", "Devis"]}
        cta="Devis"
        accent="bg-zinc-700"
        Icon={Hammer}
      />

      <div className="shrink-0 bg-gradient-to-br from-zinc-50 to-zinc-200/60 px-4 py-3 dark:from-white/5 dark:to-white/0">
        <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Menuiserie · Sur mesure
        </p>
        <p className="mt-0.5 text-[15px] font-semibold leading-tight">
          Le bois travaillé avec exigence.
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Award className="h-2.5 w-2.5" /> 18 ans d&apos;expérience
          </span>
          <span>·</span>
          <span>Île-de-France</span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2 p-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"
          >
            <div className="h-full w-full rounded-md bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-black/5 px-4 py-2 dark:border-white/10">
        <span className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400">
          <Phone className="h-3 w-3" /> 06 12 34 56 78
        </span>
        <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-medium text-white dark:bg-white dark:text-zinc-900">
          Demander un devis
        </span>
      </div>
    </>
  );
}

function ConsultantMockup() {
  return (
    <>
      <SiteHeader
        brand="Lume Conseil"
        links={["Expertises", "Cas clients", "À propos"]}
        cta="Échanger"
        accent="bg-indigo-600"
        Icon={Briefcase}
      />

      <div className="shrink-0 bg-gradient-to-br from-indigo-50 to-blue-100/60 px-4 py-3 dark:from-indigo-500/10 dark:to-blue-500/5">
        <p className="text-[9px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          Stratégie & transformation
        </p>
        <p className="mt-0.5 text-[15px] font-semibold leading-tight">
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
              <I className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-0.5 text-[11px] font-semibold leading-none">
                {v}
              </p>
              <p className="text-[9px] text-zinc-500 dark:text-zinc-400">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {[
          "Stratégie d'entreprise",
          "Transformation organisationnelle",
          "Pilotage de la performance",
        ].map((s) => (
          <div
            key={s}
            className="flex items-center justify-between rounded-md border border-black/5 bg-white px-2.5 py-1.5 text-[11px] dark:border-white/10 dark:bg-white/5"
          >
            <span className="truncate font-medium">{s}</span>
            <span className="shrink-0 text-indigo-600 dark:text-indigo-400">
              →
            </span>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-black/5 bg-indigo-50/40 px-4 py-2 text-[10px] italic text-zinc-600 dark:border-white/10 dark:bg-indigo-500/5 dark:text-zinc-400">
        « Un accompagnement structuré qui a transformé notre comité de direction. »
        <span className="ml-1 not-italic text-zinc-400">— C. Dupont, COO</span>
      </div>
    </>
  );
}

function SanteMockup() {
  const slots = ["09:30", "10:15", "11:00", "14:30", "15:15", "16:00"];

  return (
    <>
      <SiteHeader
        brand="Cabinet Lume"
        links={["Praticien", "Soins", "Accès"]}
        cta="Prendre RDV"
        accent="bg-emerald-600"
        Icon={Stethoscope}
      />

      <div className="shrink-0 bg-gradient-to-br from-emerald-50 to-teal-100/60 px-4 py-3 dark:from-emerald-500/10 dark:to-teal-500/5">
        <p className="text-[9px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Médecine générale
        </p>
        <p className="mt-0.5 text-[15px] font-semibold leading-tight">
          Dr. Martin · Consultations sur RDV
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" /> Lyon 6ᵉ
          </span>
          <span>·</span>
          <span>Conventionné · Carte vitale</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between text-[11px]">
          <p className="font-medium">Disponibilités · Aujourd&apos;hui</p>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-3 w-3" /> En ligne
          </span>
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {slots.map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-md border py-1.5 text-center text-[10px] font-medium",
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

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-black/5 px-4 py-2 text-[10px] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-emerald-600" />
          Lun-Ven · 9h-19h
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-emerald-600" />
          04 78 12 34 56
        </span>
      </div>
    </>
  );
}
