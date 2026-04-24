"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubMode = "none" | "light" | "complete";

const SUB_MODES: {
  id: SubMode;
  label: string;
  description: string;
}[] = [
  {
    id: "none",
    label: "Achat unique",
    description: "Vous recevez le site. Aucun abonnement.",
  },
  {
    id: "light",
    label: "Light",
    description: "Hébergement & nom de domaine inclus.",
  },
  {
    id: "complete",
    label: "Complet",
    description: "Hébergement, mises à jour et support.",
  },
];

type Plan = {
  id: "start" | "standard" | "pro";
  name: string;
  tagline: string;
  setup: number;
  featured?: boolean;
  monthly: Record<SubMode, number>;
  baseFeatures: string[];
  lightExtras: string[];
  completeExtras: string[];
};

const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    tagline: "Le strict essentiel pour exister en ligne.",
    setup: 190,
    monthly: { none: 0, light: 9, complete: 19 },
    baseFeatures: [
      "Site vitrine jusqu'à 3 pages",
      "Design responsive & accessible",
      "SEO de base · balises optimisées",
      "Formulaire de contact",
      "Livraison du site sous 24h",
    ],
    lightExtras: [
      "Hébergement haute performance",
      "Nom de domaine offert la 1ʳᵉ année",
      "Certificat SSL automatique",
    ],
    completeExtras: [
      "Mises à jour illimitées",
      "Support par email · 48h",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "L'offre équilibrée pour lancer votre activité.",
    setup: 290,
    featured: true,
    monthly: { none: 0, light: 14, complete: 29 },
    baseFeatures: [
      "Site vitrine jusqu'à 5 pages",
      "SEO local optimisé",
      "Formulaire de contact avancé",
      "Intégration Google Maps",
      "Livraison du site sous 24h",
    ],
    lightExtras: [
      "Hébergement haute performance",
      "Nom de domaine offert la 1ʳᵉ année",
      "Certificat SSL automatique",
      "Sauvegardes hebdomadaires",
    ],
    completeExtras: [
      "Mises à jour illimitées",
      "Analytics & suivi de performance",
      "Support par email · 48h",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "La solution complète pour convertir et fidéliser.",
    setup: 490,
    monthly: { none: 0, light: 19, complete: 49 },
    baseFeatures: [
      "Site complet jusqu'à 12 pages",
      "Prise de rendez-vous intégrée",
      "SEO avancé · rich snippets",
      "Blog & newsletter",
      "Livraison du site sous 24h",
    ],
    lightExtras: [
      "Hébergement haute performance",
      "Nom de domaine offert la 1ʳᵉ année",
      "Certificat SSL automatique",
      "Sauvegardes quotidiennes",
    ],
    completeExtras: [
      "Mises à jour illimitées",
      "Tableau de bord analytics avancé",
      "Support prioritaire · 4h",
      "Optimisations SEO trimestrielles",
    ],
  },
];

function featuresFor(plan: Plan, mode: SubMode) {
  if (mode === "none") return plan.baseFeatures;
  if (mode === "light") return [...plan.baseFeatures, ...plan.lightExtras];
  return [...plan.baseFeatures, ...plan.lightExtras, ...plan.completeExtras];
}

export function Pricing() {
  const [mode, setMode] = React.useState<SubMode>("complete");

  return (
    <section
      id="tarifs"
      aria-labelledby="pricing-title"
      className="py-24 sm:py-32"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Tarifs</p>
          <h2
            id="pricing-title"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Trois offres, un abonnement à la carte
          </h2>
          <p className="mt-4 text-muted-foreground">
            Payez votre site une seule fois. Ajoutez, si vous le souhaitez,
            l'hébergement ou un suivi complet. Résiliable à tout moment.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Mode d'abonnement"
            className="flex w-full max-w-2xl items-stretch rounded-full border border-border/60 bg-muted/40 p-1.5"
          >
            {SUB_MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "relative flex-1 rounded-full px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sub-mode-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          {SUB_MODES.find((m) => m.id === mode)?.description}
        </p>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const features = featuresFor(plan, mode);
            const monthly = plan.monthly[mode];

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-8 shadow-sm transition-all",
                  plan.featured
                    ? "border-primary/40 bg-gradient-to-b from-primary/5 to-transparent shadow-lg shadow-primary/10 lg:scale-[1.02]"
                    : "border-border/60 bg-card hover:shadow-md"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                    Recommandé
                  </span>
                )}

                <header>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>
                </header>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight">
                    {plan.setup}€
                  </span>
                  <span className="text-sm text-muted-foreground">
                    de mise en service
                  </span>
                </div>

                <div className="mt-2 min-h-[28px] flex items-baseline gap-1 text-muted-foreground">
                  {monthly === 0 ? (
                    <span className="text-sm">Sans abonnement · paiement unique</span>
                  ) : (
                    <>
                      <span className="text-sm">puis</span>
                      <span className="text-xl font-semibold text-foreground">
                        {monthly}€
                      </span>
                      <span className="text-sm">/ mois</span>
                    </>
                  )}
                </div>

                <ul className="mt-8 space-y-3 text-sm">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.featured
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-foreground/80"
                        )}
                      >
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full"
                  >
                    <a href="#questionnaire">
                      Choisir l'offre {plan.name}
                    </a>
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          L'abonnement est totalement facultatif : vous pouvez acheter votre site une
          seule fois et le conserver. Vous pourrez activer ou résilier un abonnement
          à tout moment depuis votre espace client.
        </p>
      </div>
    </section>
  );
}
