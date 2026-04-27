import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Lume — éditeur, hébergement, propriété intellectuelle, données personnelles et cookies.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "editeur",
    title: "1. Éditeur du site",
    body: (
      <>
        <p>
          Le site <strong>lume.studio</strong> est édité par{" "}
          <strong>Lume</strong>, société par actions simplifiée au capital
          social de 1 000 €.
        </p>
        <ul className="mt-3 space-y-1">
          <li>Siège social : 12 rue de la Lumière, 75011 Paris, France</li>
          <li>RCS : Paris B 000 000 000</li>
          <li>SIRET : 000 000 000 00000</li>
          <li>TVA intracommunautaire : FR00 000000000</li>
          <li>
            Directeur de la publication : la personne représentant légalement
            la société.
          </li>
          <li>
            Contact :{" "}
            <a
              href="mailto:contact@lume.studio"
              className="text-primary underline underline-offset-2"
            >
              contact@lume.studio
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "hebergeur",
    title: "2. Hébergement",
    body: (
      <>
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca
          Ave #4133, Covina, CA 91723, États-Unis. Les données sont stockées
          en Europe lorsque la configuration le permet.
        </p>
      </>
    ),
  },
  {
    id: "propriete",
    title: "3. Propriété intellectuelle",
    body: (
      <>
        <p>
          L&apos;ensemble des contenus présents sur le site (textes, images,
          logos, marques, code source, designs) est protégé par le droit
          français et international de la propriété intellectuelle. Toute
          reproduction, représentation, modification, publication ou
          adaptation, totale ou partielle, est interdite sans l&apos;accord
          écrit préalable de Lume.
        </p>
        <p className="mt-3">
          La marque « Lume » et son identité graphique sont la propriété
          exclusive de la société Lume.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "4. Données personnelles",
    body: (
      <>
        <p>
          Conformément au Règlement Général sur la Protection des Données
          (RGPD) et à la loi « Informatique et libertés » du 6 janvier 1978
          modifiée, vous disposez d&apos;un droit d&apos;accès, de
          rectification, d&apos;opposition, d&apos;effacement, de portabilité
          et de limitation du traitement des données vous concernant.
        </p>
        <p className="mt-3">
          Les données collectées via le questionnaire (nom de l&apos;entreprise,
          email, téléphone, métier, contenus partagés) sont utilisées
          uniquement dans le cadre de la préparation et de la livraison de
          votre site. Elles ne sont jamais cédées à des tiers à des fins
          commerciales.
        </p>
        <p className="mt-3">
          Pour exercer vos droits, écrivez-nous à{" "}
          <a
            href="mailto:rgpd@lume.studio"
            className="text-primary underline underline-offset-2"
          >
            rgpd@lume.studio
          </a>
          . Vous disposez également du droit d&apos;introduire une
          réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            cnil.fr
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies",
    body: (
      <>
        <p>
          Le site utilise un nombre limité de cookies strictement nécessaires
          à son fonctionnement (préférence de thème clair/sombre, sécurité).
          Aucun cookie publicitaire ou de suivi tiers n&apos;est déposé sans
          votre consentement.
        </p>
        <p className="mt-3">
          Vous pouvez à tout moment paramétrer votre navigateur pour refuser
          ces cookies. Cette opération peut altérer certaines
          fonctionnalités du site.
        </p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "6. Limitation de responsabilité",
    body: (
      <>
        <p>
          Lume met tout en œuvre pour fournir des informations exactes et à
          jour. La société ne saurait toutefois être tenue responsable des
          omissions, inexactitudes ou indisponibilités, qu&apos;elles soient
          de son fait ou du fait de tiers partenaires.
        </p>
        <p className="mt-3">
          Le site peut contenir des liens vers des sites externes. Lume
          n&apos;exerce aucun contrôle sur ces sites et décline toute
          responsabilité quant à leur contenu.
        </p>
      </>
    ),
  },
  {
    id: "droit",
    title: "7. Droit applicable",
    body: (
      <>
        <p>
          Les présentes mentions légales sont régies par le droit français.
          En cas de litige, les tribunaux français seront seuls compétents,
          sous réserve des dispositions impératives applicables aux
          consommateurs.
        </p>
      </>
    ),
  },
];

export default function MentionsLegalesPage() {
  const updatedAt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <Navbar />
      <main id="main" className="pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour à l&apos;accueil
            </Link>

            <header className="mt-8">
              <p className="text-sm font-medium text-primary">Informations</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Mentions légales
              </h1>
              <p className="mt-4 text-muted-foreground">
                Vous trouverez ci-dessous les informations légales concernant
                l&apos;éditeur du site, l&apos;hébergement, la propriété
                intellectuelle et le traitement de vos données personnelles.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Dernière mise à jour : {updatedAt}
              </p>
            </header>

            <nav
              aria-label="Sommaire"
              className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sommaire
              </p>
              <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 space-y-12">
              {SECTIONS.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-24"
                >
                  <h2
                    id={`${s.id}-title`}
                    className="text-2xl font-semibold tracking-tight"
                  >
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
