"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, MessagesSquare, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Choisissez votre modèle",
    description:
      "Sélectionnez un template pensé pour votre métier. Chaque structure est optimisée pour convertir vos visiteurs en clients.",
  },
  {
    icon: MessagesSquare,
    title: "Remplissez le questionnaire",
    description:
      "Un questionnaire intelligent collecte vos informations et votre ton. Aucune compétence technique requise.",
  },
  {
    icon: Rocket,
    title: "Lancez votre activité",
    description:
      "Votre site est généré, optimisé SEO et mis en ligne en moins de 24 heures. Vous n'avez plus qu'à accueillir vos clients.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="how-title"
      className="py-24 sm:py-32"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Processus</p>
          <h2
            id="how-title"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Trois étapes pour briller
          </h2>
          <p className="mt-4 text-muted-foreground">
            De l&apos;inscription au déploiement, chaque étape est pensée pour vous
            faire gagner du temps.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" aria-hidden />
              </div>
              <div
                className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                aria-hidden
              >
                Étape {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
