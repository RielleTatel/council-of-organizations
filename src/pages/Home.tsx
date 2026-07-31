import { Seo } from '../components/Seo'
import { defaultSeo } from '../config/seo'
import { Hero } from '../components/home/Hero'
import { QuickStats } from '../components/home/QuickStats'
import { AboutSection } from '../components/home/AboutSection'
import { GallerySection } from '../components/home/GallerySection'
import { PurposeSection } from '../components/home/PurposeSection'
import { OrganizationSpotlight } from '../components/home/OrganizationSpotlight'
import { EventHighlights } from '../components/home/EventHighlights'
import { HomeCTA } from '../components/home/HomeCTA'

export default function Home() {
  return (
    <>
      <Seo title={defaultSeo.title} description={defaultSeo.description} canonical="/" />
      <Hero />
      <QuickStats />
      <AboutSection />
      <GallerySection />
      <PurposeSection />
      <OrganizationSpotlight />
      <EventHighlights />
      <HomeCTA />
    </>
  )
}
