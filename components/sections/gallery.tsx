"use client";

import { motion } from "framer-motion";
import { ChefHat, Hammer, Briefcase, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  {
    name: "Restaurateur",
    tag: "Réservations · Menu",
    icon: ChefHat,
    accent: "from-amber-200/60 to-orange-200/40 dark:from-amber-500/20 dark:to-orange-500/10",
  },
  {
    name: "Artisan",
    tag: "Devis · Réalisations",
    icon: Hammer,
    accent: "from-slate-200/70 to-zinc-200/40 dark:from-slate-500/20 dark:to-zinc-500/10",
  },
  {
    name: "Consultant",
    tag: "Expertise · Contact",
    icon: Briefcase,
    accent: "from-indigo-200/60 to-blue-200/40 dark:from-indigo-500/20 dark:to-blue-500/10",
  },
  {
    name: "Santé",
    tag: "Prise de RDV · Praticien",
    icon: Stethoscope,
    accent: "from-emerald-200/60 to-teal-200/40 dark:from-emerald-500/20 dark:to-teal-500/10",
  },
];

export function Gallery() {
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
            pour le référencement.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((tpl, i) => (
            <motion.article
              key={tpl.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br",
                  tpl.accent
                )}
              >
                <div className="absolute inset-4 rounded-xl border border-white/50 bg-white/70 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2 dark:border-white/10">
                    <span className="h-2 w-2 rounded-full bg-red-400/70" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                    <span className="h-2 w-2 rounded-full bg-green-400/70" />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="h-2.5 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
                    <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/5" />
                    <div className="h-2 w-4/5 rounded-full bg-black/5 dark:bg-white/5" />
                    <div className="mt-4 h-16 rounded-lg bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/90 text-primary shadow-md">
                  <tpl.icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold tracking-tight">
                  {tpl.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{tpl.tag}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
