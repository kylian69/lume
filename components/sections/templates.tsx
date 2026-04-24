"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChefHat,
  Hammer,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Scissors,
  Camera,
  Dumbbell,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  metier: string;
  tagline: string;
  description: string;
  price: number;
  delay: string;
  icon: typeof ChefHat;
  accent: string;
  preview: string;
  features: string[];
  pages: string[];
  popular?: boolean;
};

const TEMPLATES: Template[] = [
  {
    id: "bistrot",
    name: "Bistrot",
    metier: "Restaurateur",
    tagline: "Menu appétissant, réservation simple.",
    description:
      "Un site chaleureux pour mettre en avant votre carte, vos horaires et permettre aux clients de réserver en un clic.",
    price: 99,
    delay: "48h",
    icon: ChefHat,
    accent: "from-amber-200/70 to-orange-200/40 dark:from-amber-500/25 dark:to-orange-500/10",
    preview: "menu",
    popular: true,
    features: [
      "Carte & menu illustrés",
      "Réservation en ligne",
      "Galerie photos",
      "Horaires & localisation",
    ],
    pages: ["Accueil", "Menu", "Réserver", "Contact"],
  },
  {
    id: "atelier",
    name: "Atelier",
    metier: "Artisan",
    tagline: "Vos réalisations mises en lumière.",
    description:
      "Un portfolio sobre et élégant pour présenter vos projets, récolter des demandes de devis et rassurer vos prospects.",
    price: 99,
    delay: "48h",
    icon: Hammer,
    accent: "from-stone-200/70 to-zinc-200/40 dark:from-stone-500/25 dark:to-zinc-500/10",
    preview: "portfolio",
    features: [
      "Galerie de réalisations",
      "Demande de devis",
      "Témoignages clients",
      "Zones d'intervention",
    ],
    pages: ["Accueil", "Réalisations", "Services", "Devis"],
  },
  {
    id: "cabinet",
    name: "Cabinet",
    metier: "Consultant",
    tagline: "Crédibilité instantanée.",
    description:
      "Une structure professionnelle pour détailler votre expertise, votre parcours et générer des prises de contact qualifiées.",
    price: 129,
    delay: "48h",
    icon: Briefcase,
    accent: "from-indigo-200/70 to-blue-200/40 dark:from-indigo-500/25 dark:to-blue-500/10",
    preview: "expertise",
    features: [
      "Expertises & missions",
      "Parcours & références",
      "Prise de contact avancée",
      "Blog optionnel",
    ],
    pages: ["Accueil", "Expertise", "À propos", "Contact"],
  },
  {
    id: "clinique",
    name: "Clinique",
    metier: "Santé",
    tagline: "Simple, rassurant, accessible.",
    description:
      "Un site conforme pour votre cabinet ou pratique : présentation, prise de rendez-vous intégrée et informations pratiques claires.",
    price: 129,
    delay: "48h",
    icon: Stethoscope,
    accent: "from-emerald-200/70 to-teal-200/40 dark:from-emerald-500/25 dark:to-teal-500/10",
    preview: "medical",
    features: [
      "Prise de rendez-vous",
      "Présentation du praticien",
      "Informations pratiques",
      "Accessibilité renforcée",
    ],
    pages: ["Accueil", "Le praticien", "RDV", "Infos"],
  },
  {
    id: "academy",
    name: "Academy",
    metier: "Coach / Formateur",
    tagline: "Vendez vos programmes.",
    description:
      "Un site orienté conversion pour présenter vos formations, capter des leads et démontrer vos résultats.",
    price: 149,
    delay: "72h",
    icon: GraduationCap,
    accent: "from-violet-200/70 to-fuchsia-200/40 dark:from-violet-500/25 dark:to-fuchsia-500/10",
    preview: "program",
    popular: true,
    features: [
      "Présentation des programmes",
      "Tunnel de conversion",
      "Témoignages & résultats",
      "Formulaire de qualification",
    ],
    pages: ["Accueil", "Programmes", "Résultats", "Réserver"],
  },
  {
    id: "studio",
    name: "Studio",
    metier: "Coiffure & beauté",
    tagline: "Une esthétique à votre image.",
    description:
      "Un site élégant avec réservation en ligne, présentation des prestations et galerie inspirante.",
    price: 99,
    delay: "48h",
    icon: Scissors,
    accent: "from-rose-200/70 to-pink-200/40 dark:from-rose-500/25 dark:to-pink-500/10",
    preview: "beauty",
    features: [
      "Prestations & tarifs",
      "Réservation en ligne",
      "Galerie d'inspirations",
      "Fiches praticien·ne·s",
    ],
    pages: ["Accueil", "Prestations", "Réserver", "Équipe"],
  },
  {
    id: "lens",
    name: "Lens",
    metier: "Photographe",
    tagline: "Votre portfolio, plein écran.",
    description:
      "Un site immersif pour faire rayonner votre travail visuel et proposer vos offres de shooting.",
    price: 129,
    delay: "72h",
    icon: Camera,
    accent: "from-slate-300/70 to-neutral-200/40 dark:from-slate-500/25 dark:to-neutral-500/10",
    preview: "portfolio-photo",
    features: [
      "Portfolio plein écran",
      "Offres & tarifs",
      "Prise de contact",
      "Galerie par catégorie",
    ],
    pages: ["Accueil", "Portfolio", "Offres", "Contact"],
  },
  {
    id: "pulse",
    name: "Pulse",
    metier: "Bien-être / Sport",
    tagline: "Motivez, inscrivez, fidélisez.",
    description:
      "Un site énergique pour votre salle, studio ou pratique sportive : planning, inscription et offres d'essai.",
    price: 149,
    delay: "72h",
    icon: Dumbbell,
    accent: "from-lime-200/70 to-green-200/40 dark:from-lime-500/25 dark:to-green-500/10",
    preview: "sport",
    features: [
      "Planning des cours",
      "Offre d'essai gratuite",
      "Abonnements & tarifs",
      "Équipe & valeurs",
    ],
    pages: ["Accueil", "Planning", "Abonnements", "Contact"],
  },
];

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "Restaurateur", label: "Restaurateur" },
  { id: "Artisan", label: "Artisan" },
  { id: "Consultant", label: "Consultant" },
  { id: "Santé", label: "Santé" },
  { id: "Coach / Formateur", label: "Coach" },
  { id: "Coiffure & beauté", label: "Beauté" },
  { id: "Photographe", label: "Photographe" },
  { id: "Bien-être / Sport", label: "Sport" },
];

function TemplatePreview({ variant, accent }: { variant: string; accent: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br",
        accent
      )}
    >
      <div className="absolute inset-4 rounded-xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2 dark:border-white/10">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <span className="h-2 w-2 rounded-full bg-green-400/70" />
        </div>
        <div className="space-y-2 p-4">
          <div className="h-2.5 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/5" />
          <div className="h-2 w-4/5 rounded-full bg-black/5 dark:bg-white/5" />
          {variant === "menu" && (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-10 rounded-md bg-black/5 dark:bg-white/5" />
              <div className="h-10 rounded-md bg-black/5 dark:bg-white/5" />
              <div className="h-10 rounded-md bg-black/5 dark:bg-white/5" />
              <div className="h-10 rounded-md bg-black/5 dark:bg-white/5" />
            </div>
          )}
          {variant === "portfolio" && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="h-12 rounded-md bg-black/10 dark:bg-white/10" />
              <div className="h-12 rounded-md bg-black/5 dark:bg-white/5" />
              <div className="h-12 rounded-md bg-black/10 dark:bg-white/10" />
            </div>
          )}
          {variant === "expertise" && (
            <div className="mt-3 space-y-1.5">
              <div className="h-6 rounded-md bg-black/5 dark:bg-white/5" />
              <div className="h-6 rounded-md bg-black/10 dark:bg-white/10" />
              <div className="h-6 rounded-md bg-black/5 dark:bg-white/5" />
            </div>
          )}
          {variant === "medical" && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/5" />
                <div className="h-2 w-3/4 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="h-2 w-2/3 rounded-full bg-black/5 dark:bg-white/5" />
              </div>
            </div>
          )}
          {variant === "program" && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 rounded-md bg-black/5 p-1.5 dark:bg-white/5">
                <div className="h-4 w-4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-black/5 p-1.5 dark:bg-white/5">
                <div className="h-4 w-4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          )}
          {variant === "beauty" && (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-16 rounded-md bg-black/10 dark:bg-white/10" />
              <div className="space-y-1.5">
                <div className="h-3 rounded-md bg-black/5 dark:bg-white/5" />
                <div className="h-3 rounded-md bg-black/5 dark:bg-white/5" />
                <div className="h-3 rounded-md bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          )}
          {variant === "portfolio-photo" && (
            <div className="mt-3 grid grid-cols-4 gap-1">
              <div className="aspect-square rounded bg-black/10 dark:bg-white/10" />
              <div className="aspect-square rounded bg-black/5 dark:bg-white/5" />
              <div className="aspect-square rounded bg-black/10 dark:bg-white/10" />
              <div className="aspect-square rounded bg-black/5 dark:bg-white/5" />
              <div className="aspect-square rounded bg-black/5 dark:bg-white/5" />
              <div className="aspect-square rounded bg-black/10 dark:bg-white/10" />
              <div className="aspect-square rounded bg-black/5 dark:bg-white/5" />
              <div className="aspect-square rounded bg-black/10 dark:bg-white/10" />
            </div>
          )}
          {variant === "sport" && (
            <div className="mt-3 space-y-1.5">
              <div className="flex gap-1.5">
                <div className="h-8 flex-1 rounded-md bg-black/10 dark:bg-white/10" />
                <div className="h-8 flex-1 rounded-md bg-black/5 dark:bg-white/5" />
                <div className="h-8 flex-1 rounded-md bg-black/5 dark:bg-white/5" />
              </div>
              <div className="h-6 rounded-md bg-black/10 dark:bg-white/10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FormState = {
  entreprise: string;
  email: string;
  telephone: string;
  details: string;
};

function TemplateModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  const [form, setForm] = React.useState<FormState>({
    entreprise: "",
    email: "",
    telephone: "",
    details: "",
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle"
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  };

  const Icon = template.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`template-${template.id}-title`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: "spring", damping: 24, stiffness: 240 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">
              Demande envoyée !
            </h3>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Merci {form.entreprise || "à vous"}. Notre équipe vous contactera
              sous 24h pour valider votre modèle <strong>{template.name}</strong>{" "}
              et finaliser la personnalisation.
            </p>
            <Button onClick={onClose} className="mt-8">
              Parfait, fermer
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "relative flex items-center gap-4 border-b border-border/60 bg-gradient-to-br p-6",
                template.accent
              )}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/90 text-primary shadow-md">
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                  Modèle · {template.metier}
                </p>
                <h3
                  id={`template-${template.id}-title`}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {template.name}
                </h3>
                <p className="mt-0.5 text-sm text-foreground/80">
                  {template.tagline}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[70vh] space-y-5 overflow-y-auto p-6 sm:p-8"
            >
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Prix du modèle
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Livraison sous {template.delay}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {template.price}€
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · paiement unique
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`entreprise-${template.id}`}
                  className="mb-1.5 block text-sm font-medium"
                >
                  Nom de l'entreprise{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  id={`entreprise-${template.id}`}
                  required
                  value={form.entreprise}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, entreprise: e.target.value }))
                  }
                  placeholder="Lume Studio"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`email-${template.id}`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id={`email-${template.id}`}
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="vous@exemple.fr"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`tel-${template.id}`}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Téléphone
                  </label>
                  <Input
                    id={`tel-${template.id}`}
                    type="tel"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telephone: e.target.value }))
                    }
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`details-${template.id}`}
                  className="mb-1.5 block text-sm font-medium"
                >
                  Informations de personnalisation
                </label>
                <Textarea
                  id={`details-${template.id}`}
                  rows={4}
                  value={form.details}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, details: e.target.value }))
                  }
                  placeholder="Vos horaires, couleurs préférées, slogan, informations clés à afficher…"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Nous reviendrons vers vous pour finaliser logo, couleurs et
                  contenus. Vous n'êtes pas obligé·e de tout remplir maintenant.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  En validant, aucun paiement n'est effectué. Nous vous
                  recontactons pour confirmer.
                </p>
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>
                      Valider le modèle
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Templates() {
  const [category, setCategory] = React.useState("all");
  const [selected, setSelected] = React.useState<Template | null>(null);

  const filtered =
    category === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.metier === category);

  return (
    <section
      id="templates"
      aria-labelledby="templates-title"
      className="py-24 sm:py-32"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Nouveau · Modèles prêts à l'emploi
          </div>
          <h2
            id="templates-title"
            className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Un site en ligne dès 99€, livré en 48h
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nos modèles pré-conçus par cœur de métier couvrent l'essentiel :
            choisissez-en un, renseignez vos informations et recevez un site
            professionnel plus rapidement et à moindre coût.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filtre par métier"
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-all sm:text-sm",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/60 bg-card text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <motion.article
                  key={tpl.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  {tpl.popular && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-md">
                      Populaire
                    </span>
                  )}

                  <TemplatePreview variant={tpl.preview} accent={tpl.accent} />

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {tpl.metier}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold tracking-tight">
                      {tpl.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tpl.tagline}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {tpl.features.slice(0, 3).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs text-foreground/80"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                            aria-hidden
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold tracking-tight">
                            {tpl.price}€
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {tpl.delay}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(tpl)}
                      >
                        Choisir
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-8 text-center sm:p-10">
          <Sparkles className="mx-auto h-6 w-6 text-primary" aria-hidden />
          <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
            Besoin de plus de personnalisation ?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Les modèles sont rapides et économiques, mais moins flexibles. Pour
            un site 100% sur-mesure, nos offres complètes vous accompagnent de A
            à Z.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <a href="#tarifs">Voir les offres sur-mesure</a>
            </Button>
            <Button asChild>
              <a href="#questionnaire">
                Démarrer un projet sur-mesure
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <TemplateModal
            template={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
