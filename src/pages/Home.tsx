import { Seo } from "../components/Seo";
import { JsonLd } from "../components/JsonLd";
import { organizationSchema } from "../lib/schema";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { Hero } from "../components/home/Hero";
import { QuickStats } from "../components/home/QuickStats";
import { AboutSection } from "../components/home/AboutSection";
import { GallerySection } from "../components/home/GallerySection";
import { PurposeSection } from "../components/home/PurposeSection";
import { OrganizationSpotlight } from "../components/home/OrganizationSpotlight";
import { EventHighlights } from "../components/home/EventHighlights";
import { HomeCTA } from "../components/home/HomeCTA";

export default function Home() {
  const settings = useSiteSettings();
  const defaultSeo = settings.seo;
  return (
    <>
      <Seo
        title={defaultSeo.title}
        description={defaultSeo.description}
        canonical="/"
      />
      <JsonLd data={organizationSchema(settings)} />
      <Hero />
      <QuickStats />
      <AboutSection />
      <GallerySection />
      <PurposeSection />
      <OrganizationSpotlight />
      <EventHighlights />
      <HomeCTA />
    </>
  );
}
