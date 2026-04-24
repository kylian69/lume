"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Hammer,
  Briefcase,
  Stethoscope,
  CalendarCheck,
  ShoppingBag,
  Store,
  Minus,
  LayoutGrid,
  Palette,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Answers = {
  metier: string;
  objectif: string;
  style: string;
  entreprise: string;
  email: string;
};

const METIERS = [
  { id: "restaurateur", label: "Restaurateur", icon: ChefHat },
  { id: "artisan", label: "Artisan", icon: Hammer },
  { id: "consultant", label: "Consultant", icon: Briefcase },
  { id: "sante", label: "Santé", icon: Stethoscope },
];

const OBJECTIFS = [
  {
    id: "rdv",
    label: "Prise de rendez-vous",
    description: "Permettre à mes clients de réserver en ligne.",
    icon: CalendarCheck,
  },
  {
    id: "vente",
    label: "Vente en ligne",
    description: "Vendre des produits ou services directement.",
    icon: ShoppingBag,
  },
  {
    id: "vitrine",
    label: "Vitrine",
    description: "Présenter mon activité et gagner en crédibilité.",
    icon: Store,
  },
];

const STYLES = [
  { id: "minimaliste", label: "Minimaliste", description: "Épuré, aéré, intemporel.", icon: Minus },
  { id: "professionnel", label: "Professionnel", description: "Structuré, rassurant, sérieux.", icon: LayoutGrid },
  { id: "creatif", label: "Créatif", description: "Audacieux, coloré, mémorable.", icon: Palette },
];

const STEPS = ["metier", "objectif", "style", "coordonnees", "loading"] as const;
type Step = (typeof STEPS)[number];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function Questionnaire() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [answers, setAnswers] = React.useState<Answers>({
    metier: "",
    objectif: "",
    style: "",
    entreprise: "",
    email: "",
  });

  const step: Step = STEPS[stepIndex];

  const canAdvance = React.useMemo(() => {
    switch (step) {
      case "metier":
        return !!answers.metier;
      case "objectif":
        return !!answers.objectif;
      case "style":
        return !!answers.style;
      case "coordonnees":
        return (
          answers.entreprise.trim().length > 1 &&
          /.+@.+\..+/.test(answers.email)
        );
      default:
        return false;
    }
  }, [step, answers]);

  const goTo = (next: number) => {
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) goTo(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  };

  React.useEffect(() => {
    if (step !== "loading") return;
    setProgress(0);
    setDone(false);
    const start = Date.now();
    const duration = 2600;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [step]);

  const stepNumber = Math.min(stepIndex + 1, 4);
  const totalSteps = 4;
  const barProgress = step === "loading" ? 100 : (stepIndex / totalSteps) * 100;

  return (
    <section
      id="questionnaire"
      aria-labelledby="questionnaire-title"
      className="py-24 sm:py-32"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Questionnaire</p>
          <h2
            id="questionnaire-title"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Trois minutes pour préparer votre site
          </h2>
          <p className="mt-4 text-muted-foreground">
            Répondez à quatre questions — notre moteur génère la structure, les
            balises et le contenu.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="border-b border-border/60 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                {step === "loading"
                  ? "Finalisation"
                  : `Étape ${stepNumber} sur ${totalSteps}`}
              </span>
              <span>{Math.round(barProgress)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${barProgress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="relative min-h-[420px] px-6 py-10 sm:px-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === "metier" && (
                  <StepWrapper
                    title="Quel est votre métier ?"
                    subtitle="Nous adaptons la structure du site à votre secteur."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {METIERS.map((m) => (
                        <OptionCard
                          key={m.id}
                          icon={m.icon}
                          label={m.label}
                          selected={answers.metier === m.id}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, metier: m.id }))
                          }
                        />
                      ))}
                    </div>
                  </StepWrapper>
                )}

                {step === "objectif" && (
                  <StepWrapper
                    title="Quel est l'objectif du site ?"
                    subtitle="Vos pages et appels à l'action seront calibrés en conséquence."
                  >
                    <div className="grid gap-3">
                      {OBJECTIFS.map((o) => (
                        <OptionCard
                          key={o.id}
                          icon={o.icon}
                          label={o.label}
                          description={o.description}
                          selected={answers.objectif === o.id}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, objectif: o.id }))
                          }
                        />
                      ))}
                    </div>
                  </StepWrapper>
                )}

                {step === "style" && (
                  <StepWrapper
                    title="Quel style préférez-vous ?"
                    subtitle="Typographie, couleurs et espaces seront ajustés à votre identité."
                  >
                    <div className="grid gap-3 sm:grid-cols-3">
                      {STYLES.map((s) => (
                        <OptionCard
                          key={s.id}
                          icon={s.icon}
                          label={s.label}
                          description={s.description}
                          selected={answers.style === s.id}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, style: s.id }))
                          }
                        />
                      ))}
                    </div>
                  </StepWrapper>
                )}

                {step === "coordonnees" && (
                  <StepWrapper
                    title="Vos coordonnées"
                    subtitle="Nous vous enverrons la maquette personnalisée sous 24h."
                  >
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (canAdvance) handleNext();
                      }}
                    >
                      <div>
                        <label
                          htmlFor="entreprise"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Nom de l'entreprise
                        </label>
                        <Input
                          id="entreprise"
                          name="entreprise"
                          autoComplete="organization"
                          placeholder="Atelier Rivière"
                          value={answers.entreprise}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              entreprise: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Email professionnel
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="contact@votre-entreprise.fr"
                          value={answers.email}
                          onChange={(e) =>
                            setAnswers((a) => ({ ...a, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Vos données restent strictement confidentielles.
                      </p>
                    </form>
                  </StepWrapper>
                )}

                {step === "loading" && (
                  <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                    {!done ? (
                      <>
                        <div className="relative flex h-16 w-16 items-center justify-center">
                          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                          <Loader2 className="relative h-8 w-8 animate-spin text-primary" />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold tracking-tight">
                          Génération de votre structure SEO…
                        </h3>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                          Analyse du métier, construction des balises, des
                          données structurées et du sitemap.
                        </p>
                        <div className="mt-8 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={false}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                          />
                        </div>
                        <p className="mt-3 text-xs font-medium tabular-nums text-muted-foreground">
                          {progress}%
                        </p>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-8 w-8" aria-hidden />
                        </span>
                        <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                          Votre structure est prête.
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                          Nous avons préparé une maquette sur-mesure pour{" "}
                          <span className="font-medium text-foreground">
                            {answers.entreprise || "votre entreprise"}
                          </span>
                          . Un aperçu vous attend dans votre boîte mail d'ici 24
                          heures.
                        </p>
                        <Button
                          className="mt-8"
                          size="lg"
                          onClick={() => {
                            setAnswers({
                              metier: "",
                              objectif: "",
                              style: "",
                              entreprise: "",
                              email: "",
                            });
                            goTo(0);
                          }}
                        >
                          Configurer un autre site
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step !== "loading" && (
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-6 py-4 sm:px-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance}
                className="gap-2"
              >
                {stepIndex === 3 ? "Générer mon site" : "Continuer"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="mb-6">
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function OptionCard({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
          : "border-border/60 bg-background hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
