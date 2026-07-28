import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { buttonVariants } from '../components/ui/Button'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { FloatingAccent } from '../components/ui/FloatingAccent'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | COA-Z" description="The page you are looking for could not be found." />
      <section className="mx-auto flex min-h-[60dvh] max-w-[700px] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div className="flex items-center gap-3">
          <FloatingAccent duration={5.5} distance={7} rotate={7}>
            <EmbroideredAccent color="pink" index={0} size={48} />
          </FloatingAccent>
          <FloatingAccent duration={6.5} delay={0.3} distance={8} rotate={-6}>
            <EmbroideredAccent color="blue" index={0} size={48} />
          </FloatingAccent>
          <FloatingAccent duration={6} delay={0.6} distance={6} rotate={6}>
            <EmbroideredAccent color="yellow" index={0} size={48} />
          </FloatingAccent>
        </div>
        <h1 className="font-display text-5xl font-black tracking-[-0.02em] text-trust-blue">404</h1>
        <p className="font-body text-lg leading-relaxed text-fabric-dark">
          This thread leads nowhere. The page you are looking for may have moved or no longer exists.
        </p>
        <Link to="/" className={buttonVariants({ variant: 'primary' })}>
          Return Home
        </Link>
      </section>
    </>
  )
}
