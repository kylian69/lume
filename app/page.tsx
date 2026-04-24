import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Gallery } from "@/components/sections/gallery";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";
import { Questionnaire } from "@/components/sections/questionnaire";
import { Footer } from "@/components/sections/footer";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lume",
    url: "https://lume.studio",
    description:
      "Lume est une plateforme Website-as-a-Service qui livre un site professionnel optimisé SEO en moins de 24 heures.",
    sameAs: [],
    offers: [
      {
        "@type": "Offer",
        name: "Standard",
        price: "290",
        priceCurrency: "EUR",
        description: "290€ de mise en service, puis 29€ / mois.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "490",
        priceCurrency: "EUR",
        description: "490€ de mise en service, puis 49€ / mois.",
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Gallery />
        <Pricing />
        <About />
        <Questionnaire />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
