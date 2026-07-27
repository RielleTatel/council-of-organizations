import { Helmet } from 'react-helmet-async'
import { defaultSeo } from '../config/seo'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { FabricTexture } from '../components/ui/FabricTexture'
import { Hero } from '../components/home/Hero'
import { QuickStats } from '../components/home/QuickStats'
import { AboutSection } from '../components/home/AboutSection'
import { PurposeSection } from '../components/home/PurposeSection'
import { FeaturedOrganization } from '../components/home/FeaturedOrganization'
import { UpcomingEvents } from '../components/home/UpcomingEvents'
import { HomeCTA } from '../components/home/HomeCTA'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{defaultSeo.title}</title>
        <meta name="description" content={defaultSeo.description} />
        <meta property="og:title" content={defaultSeo.og.title} />
        <meta property="og:description" content={defaultSeo.og.description} />
        <meta name="twitter:card" content={defaultSeo.twitter.card} />
      </Helmet>

      <FabricTexture />
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <QuickStats />
        <AboutSection />
        <PurposeSection />
        <FeaturedOrganization />
        <UpcomingEvents />
        <HomeCTA />
      </main>
      <Footer />
    </>
  )
}
