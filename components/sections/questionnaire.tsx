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
  Scissors,
  Home,
  GraduationCap,
  Camera,
  Scale,
  Users,
  Dumbbell,
  Sparkles,
  Megaphone,
  UserPlus,
  Newspaper,
  CreditCard,
  PenLine,
  Images,
  Star,
  Mail,
  Globe,
  FileText,
  MapPin,
  Lock,
  MessageCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Answers = {
  metier: string;
  metierCustom: string;
  objectifs: string[];
  objectifCustom: string;
  style: string;
  inspiration: string;
  fonctionnalites: string[];
  entreprise: string;
  email: string;
  telephone: string;
  message: string;
};

const METIERS = [
  { id: "restaurateur", label: "Restaurateur", icon: ChefHat },
  { id: "artisan", label: "Artisan", icon: Hammer },
  { id: "consultant", label: "Consultant", icon: Briefcase },
  { id: "sante", label: "Santé", icon: Stethoscope },
  { id: "beaute", label: "Coiffure & beauté", icon: Scissors },
  { id: "immobilier", label: "Immobilier", icon: Home },
  { id: "coach", label: "Coach / Formateur", icon: GraduationCap },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "photographe", label: "Photographe", icon: Camera },
  { id: "juridique", label: "Juridique / Conseil", icon: Scale },
  { id: "bien-etre", label: "Bien-être / Sport", icon: Dumbbell },
  { id: "association", label: "Association", icon: Users },
];

const OBJECTIFS = [
  {
    id: "rdv",
    label: "Prise de rendez-vous",
    description: "Laisser mes clients réserver en ligne.",
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
  {
    id: "leads",
    label: "Génération de leads",
    description: "Collecter des prospects qualifiés.",
    icon: Megaphone,
  },
  {
    id: "recrutement",
    label: "Recrutement",
    description: "Attirer des candidats et présenter l'équipe.",
    icon: UserPlus,
  },
  {
    id: "communaute",
    label: "Informer / Communauté",
    description: "Fédérer autour de mon contenu.",
    icon: Newspaper,
  },
];

const STYLES = [
  { id: "minimaliste", label: "Minimaliste", description: "Épuré, aéré, intemporel.", icon: Minus },
  { id: "professionnel", label: "Professionnel", description: "Structuré, rassurant, sérieux.", icon: LayoutGrid },
  { id: "creatif", label: "Créatif", description: "Audacieux, coloré, mémorable.", icon: Palette },
];

const FONCTIONNALITES = [
  { id: "rdv", label: "Prise de RDV", icon: CalendarCheck },
  { id: "paiement", label: "Paiement en ligne", icon: CreditCard },
  { id: "blog", label: "Blog", icon: PenLine },
  { id: "galerie", label: "Galerie photos", icon: Images },
  { id: "temoignages", label: "Témoignages", icon: Star },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "multilingue", label: "Multilingue", icon: Globe },
  { id: "devis", label: "Formulaire de devis", icon: FileText },
  { id: "carte", label: "Carte / itinéraire", icon: MapPin },
  { id: "membres", label: "Espace membres", icon: Lock },
  { id: "chat", label: "Chat en ligne", icon: MessageCircle },
  { id: "catalogue", label: "Catalogue produits", icon: Package },
];

const STEPS = [
  "metier",
  "objectif",
  "style",
  "fonctionnalites",
  "coordonnees",
  "loading",
] as const;
type Step = (typeof STEPS)[number];
const TOTAL_STEPS = STEPS.length - 1;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const EMPTY: Answers = {
  metier: "",
  metierCustom: "",
  objectifs: [],
  objectifCustom: "",
  style: "",
  inspiration: "",
  fonctionnalites: [],
  entreprise: "",
  email: "",
  telephone: "",
  message: "",
};

export function Questionnaire() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [answers, setAnswers] = React.useState<Answers>(EMPTY);

  const step: Step = STEPS[stepIndex];

  const canAdvance = React.useMemo(() => {
    switch (step) {
      case "metier":
        return (
          (!!answers.metier && answers.metier !== "autre") ||
          (answers.metier === "autre" && answers.metierCustom.trim().length > 1)
        );
      case "objectif":
        return (
          answers.objectifs.length > 0 &&
          (!answers.objectifs.includes("autre") ||
            answers.objectifCustom.trim().length > 1)
        );
      case "style":
        return !!answers.style;
      case "fonctionnalites":
        return true;
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

  const toggleObjectif = (id: string) =>
    setAnswers((a) => ({
      ...a,
      objectifs: a.objectifs.includes(id)
        ? a.objectifs.filter((x) => x !== id)
        : [...a.objectifs, id],
    }));

  const toggleFonctionnalite = (id: string) =>
    setAnswers((a) => ({
      ...a,
      fonctionnalites: a.fonctionnalites.includes(id)
        ? a.fonctionnalites.filter((x) => x !== id)
        : [...a.fonctionnalites, id],
    }));

  React.useEffect(() => {
    if (step !== "loading") return;
    setProgress(0);
    setDone(false);
    const start = Date.now();
    const duration = 2800;
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

  const stepNumber = Math.min(stepIndex + 1, TOTAL_STEPS);
  const barProgress =
    step === "loading" ? 100 : (stepIndex / TOTAL_STEPS) * 100;

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
            Quelques minutes pour préparer votre site
          </h2>
          <p className="mt-4 text-muted-foreground">
            Répondez à cinq questions — chaque réponse peut être personnalisée
            librement. Notre moteur génère ensuite la structure, les balises et
            le contenu.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="border-b border-border/60 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                {step === "loading"
                  ? "Finalisation"
                  : `Étape ${stepNumber} sur ${TOTAL_STEPS}`}
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

          <div className="relative min-h-[480px] px-6 py-10 sm:px-10">
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
                    subtitle="Sélectionnez votre domaine — ou décrivez-le si le vôtre ne figure pas dans la liste."
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      <OptionCard
                        icon={Sparkles}
                        label="Autre"
                        description="Décrivez votre activité."
                        selected={answers.metier === "autre"}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, metier: "autre" }))
                        }
                      />
                    </div>

                    <AnimatePresence>
                      {answers.metier === "autre" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <label
                            htmlFor="metierCustom"
                            className="mb-1.5 mt-6 block text-sm font-medium"
                          >
                            Précisez votre métier
                          </label>
                          <Input
                            id="metierCustom"
                            placeholder="Ex : torréfacteur artisanal, fleuriste, studio de podcast…"
                            value={answers.metierCustom}
                            onChange={(e) =>
                              setAnswers((a) => ({
                                ...a,
                                metierCustom: e.target.value,
                              }))
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </StepWrapper>
                )}

                {step === "objectif" && (
                  <StepWrapper
                    title="Quels sont vos objectifs ?"
                    subtitle="Sélectionnez un ou plusieurs objectifs. Les pages et appels à l'action seront calibrés en conséquence."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {OBJECTIFS.map((o) => (
                        <OptionCard
                          key={o.id}
                          icon={o.icon}
                          label={o.label}
                          description={o.description}
                          selected={answers.objectifs.includes(o.id)}
                          onClick={() => toggleObjectif(o.id)}
                        />
                      ))}
                      <OptionCard
                        icon={Sparkles}
                        label="Autre"
                        description="Un objectif spécifique ?"
                        selected={answers.objectifs.includes("autre")}
                        onClick={() => toggleObjectif("autre")}
                      />
                    </div>

                    <AnimatePresence>
                      {answers.objectifs.includes("autre") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <label
                            htmlFor="objectifCustom"
                            className="mb-1.5 mt-6 block text-sm font-medium"
                          >
                            Décrivez votre objectif
                          </label>
                          <Input
                            id="objectifCustom"
                            placeholder="Ex : organiser un événement, vendre un livre blanc…"
                            value={answers.objectifCustom}
                            onChange={(e) =>
                              setAnswers((a) => ({
                                ...a,
                                objectifCustom: e.target.value,
                              }))
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </StepWrapper>
                )}

                {step === "style" && (
                  <StepWrapper
                    title="Quel style préférez-vous ?"
                    subtitle="Typographie, couleurs et espaces seront ajustés à votre identité. Partagez aussi vos inspirations si vous en avez."
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

                    <div className="mt-6">
                      <label
                        htmlFor="inspiration"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Inspirations{" "}
                        <span className="font-normal text-muted-foreground">
                          (optionnel)
                        </span>
                      </label>
                      <Textarea
                        id="inspiration"
                        placeholder="Partagez 2 ou 3 sites que vous aimez, une ambiance, des couleurs…"
                        value={answers.inspiration}
                        onChange={(e) =>
                          setAnswers((a) => ({
                            ...a,
                            inspiration: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </StepWrapper>
                )}

                {step === "fonctionnalites" && (
                  <StepWrapper
                    title="Quelles fonctionnalités souhaitez-vous ?"
                    subtitle="Sélectionnez toutes celles qui vous intéressent — ou passez cette étape, nous adapterons en fonction de votre métier."
                  >
                    <div className="flex flex-wrap gap-2">
                      {FONCTIONNALITES.map((f) => {
                        const selected = answers.fonctionnalites.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleFonctionnalite(f.id)}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              selected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
                            )}
                          >
                            <f.icon className="h-4 w-4" aria-hidden />
                            {f.label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-6 text-xs text-muted-foreground">
                      Besoin d'une fonctionnalité spécifique ? Mentionnez-la à
                      l'étape suivante dans le champ « votre projet ».
                    </p>
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
                      <div className="grid gap-4 sm:grid-cols-2">
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
                      </div>
                      <div>
                        <label
                          htmlFor="telephone"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Téléphone{" "}
                          <span className="font-normal text-muted-foreground">
                            (optionnel)
                          </span>
                        </label>
                        <Input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="06 12 34 56 78"
                          value={answers.telephone}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              telephone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Parlez-nous de votre projet{" "}
                          <span className="font-normal text-muted-foreground">
                            (optionnel)
                          </span>
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Un contexte, une contrainte, une fonctionnalité particulière…"
                          value={answers.message}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              message: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Vos données restent strictement confidentielles.
                      </p>
                    </form>
                  </StepWrapper>
                )}

                {step === "loading" && (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
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
                            setAnswers(EMPTY);
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
                {stepIndex === TOTAL_STEPS - 1
                  ? "Générer mon site"
                  : "Continuer"}
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
