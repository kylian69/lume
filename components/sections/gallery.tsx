"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  Hammer,
  Briefcase,
  Stethoscope,
  ArrowRight,
  Check,
  FileText,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TemplateMockup, type TemplateId } from "@/components/template-mockup";

type Template = {
  id: TemplateId;
  name: string;
  tag: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  pages: string[];
  features: string[];
  highlights: string[];
};

const TEMPLATES: Template[] = [
  {
    id: "restaurateur",
    name: "Restaurateur",
    tag: "Réservations · Menu",
    description:
      "Un site qui met votre carte en valeur, sublime vos plats et facilite la réservation, en salle comme à emporter.",
    icon: ChefHat,
    accent:
      "from-amber-200/60 to-orange-200/40 dark:from-amber-500/20 dark:to-orange-500/10",
    pages: ["Accueil", "Notre cuisine", "Carte & menu", "Réservation", "Contact & accès"],
    features: [
      "Module de réservation en ligne",
      "Carte digitale à jour en un clic",
      "Galerie photo des plats & du lieu",
      "Avis Google intégrés",
      "Connexion à Google My Business",
    ],
    highlights: [
      "Pensé pour le mobile, là où vos clients vous trouvent.",
      "SEO local optimisé pour ressortir sur votre quartier.",
    ],
  },
  {
    id: "artisan",
    name: "Artisan",
    tag: "Devis · Réalisations",
    description:
      "Un site sobre et crédible qui valorise vos chantiers, rassure vos prospects et génère des demandes de devis qualifiées.",
    icon: Hammer,
    accent:
      "from-slate-200/70 to-zinc-200/40 dark:from-slate-500/20 dark:to-zinc-500/10",
    pages: ["Accueil", "Savoir-faire", "Réalisations", "Demande de devis", "Contact"],
    features: [
      "Galerie de réalisations avec filtres",
      "Formulaire de devis intelligent",
      "Mise en avant des certifications",
      "Témoignages clients",
      "Zone d'intervention sur carte",
    ],
    highlights: [
      "Crédibilité immédiate grâce aux preuves visuelles.",
      "Formulaire optimisé pour ne capter que les vrais leads.",
    ],
  },
  {
    id: "consultant",
    name: "Consultant",
    tag: "Expertise · Contact",
    description:
      "Un site premium qui positionne votre expertise, raconte vos cas clients et déclenche des prises de contact qualifiées.",
    icon: Briefcase,
    accent:
      "from-indigo-200/60 to-blue-200/40 dark:from-indigo-500/20 dark:to-blue-500/10",
    pages: ["Accueil", "Expertises", "Cas clients", "À propos", "Prise de contact"],
    features: [
      "Mise en récit des cas clients",
      "Téléchargement de livre blanc",
      "Prise de RDV intégrée (Calendly)",
      "Témoignages & logos clients",
      "Page À propos avec CV en ligne",
    ],
    highlights: [
      "Une scénographie qui inspire confiance dès la première seconde.",
      "Tunnel de conversion calibré pour les prospects B2B.",
    ],
  },
  {
    id: "sante",
    name: "Santé",
    tag: "Prise de RDV · Praticien",
    description:
      "Un site rassurant et conforme qui présente le praticien, oriente les patients et permet la prise de rendez-vous en ligne.",
    icon: Stethoscope,
    accent:
      "from-emerald-200/60 to-teal-200/40 dark:from-emerald-500/20 dark:to-teal-500/10",
    pages: ["Accueil", "Le praticien", "Soins & tarifs", "Prise de RDV", "Accès & contact"],
    features: [
      "Connexion Doctolib / agenda en ligne",
      "Présentation du praticien & diplômes",
      "Informations conventionnement & tarifs",
      "Plan d'accès & horaires",
      "Mentions légales conformes RGPD/santé",
    ],
    highlights: [
      "Ton sobre et rassurant, conforme aux usages du secteur.",
      "Accessibilité renforcée (contraste, navigation clavier).",
    ],
  },
];

export function Gallery() {
  const [activeId, setActiveId] = React.useState<TemplateId | null>(null);
  const active = TEMPLATES.find((t) => t.id === activeId) ?? null;

  return (
    <section
      id="modeles"
      aria-labelledby="gallery-title"
      className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-muted/30 to-transparent"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Modèles</p>
          <h2
            id="gallery-title"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Un design taillé pour votre métier
          </h2>
          <p className="mt-4 text-muted-foreground">
            Des structures éprouvées, personnalisées à votre marque et optimisées
            pour le référencement.{" "}
            <span className="text-foreground/80">
              Cliquez sur un modèle pour l&apos;aperçu détaillé.
            </span>
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((tpl, i) => (
            <motion.article
              key={tpl.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <button
                type="button"
                onClick={() => setActiveId(tpl.id)}
                aria-label={`Voir l'aperçu détaillé du modèle ${tpl.name}`}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br p-4",
                    tpl.accent
                  )}
                >
                  <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
                    <TemplateMockup id={tpl.id} compact />
                  </div>

                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/50 via-black/20 to-transparent py-3 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    Aperçu détaillé
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 p-6">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {tpl.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{tpl.tag}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <tpl.icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
      </div>

      <Dialog
        open={active !== null}
        onClose={() => setActiveId(null)}
        labelledBy="template-preview-title"
        describedBy="template-preview-description"
      >
        {active && <TemplatePreview template={active} />}
      </Dialog>
    </section>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  const Icon = template.icon;

  return (
    <div className="grid gap-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div
        className={cn(
          "relative bg-gradient-to-br p-6 sm:p-8",
          template.accent
        )}
      >
        <div className="aspect-[4/3] w-full">
          <TemplateMockup id={template.id} />
        </div>
        <p className="mt-4 text-center text-xs text-foreground/70">
          Aperçu indicatif — chaque livraison est personnalisée à vos contenus,
          couleurs et logo.
        </p>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <header>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Modèle {template.tag}
              </p>
              <h3
                id="template-preview-title"
                className="text-2xl font-semibold tracking-tight"
              >
                {template.name}
              </h3>
            </div>
          </div>
          <p
            id="template-preview-description"
            className="mt-4 text-sm text-muted-foreground"
          >
            {template.description}
          </p>
        </header>

        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Pages incluses
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.pages.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-foreground/80"
              >
                <FileText className="h-3 w-3 text-muted-foreground" />
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Fonctionnalités clés
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {template.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <ul className="space-y-1.5 text-xs text-foreground/80">
            {template.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <a href="#questionnaire">
              Choisir ce modèle
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href="#tarifs">Voir les tarifs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
