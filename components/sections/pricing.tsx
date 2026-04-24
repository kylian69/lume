"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Standard",
    tagline: "L'essentiel pour lancer votre activité.",
    setup: "290€",
    monthly: "29€",
    featured: false,
    features: [
      "Site vitrine jusqu'à 5 pages",
      "Hébergement & nom de domaine",
      "SEO local optimisé",
      "Formulaire de contact",
      "Mises à jour illimitées",
      "Support par email · 48h",
    ],
  },
  {
    name: "Pro",
    tagline: "La solution complète pour convertir et fidéliser.",
    setup: "490€",
    monthly: "49€",
    featured: true,
    features: [
      "Site complet jusqu'à 12 pages",
      "Prise de rendez-vous intégrée",
      "SEO avancé · Rich snippets",
      "Blog & newsletter",
      "Analytics & tableau de bord",
      "Support prioritaire · 4h",
    ],
  },
];

export function Pricing() {
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
            Transparent, sans surprise
          </h2>
          <p className="mt-4 text-muted-foreground">
            Un tarif de mise en service unique, puis un abonnement mensuel qui
            couvre tout. Pas d'engagement, résiliable à tout moment.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 shadow-sm transition-all",
                plan.featured
                  ? "border-primary/40 bg-gradient-to-b from-primary/5 to-transparent shadow-lg shadow-primary/10 md:scale-[1.02]"
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
                  {plan.setup}
                </span>
                <span className="text-sm text-muted-foreground">
                  de mise en service
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1 text-muted-foreground">
                <span className="text-sm">puis</span>
                <span className="text-xl font-semibold text-foreground">
                  {plan.monthly}
                </span>
                <span className="text-sm">/ mois</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
