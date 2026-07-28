import { Link } from 'react-router-dom'
import { Mail, ExternalLink } from 'lucide-react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { siteLogo } from '../../lib/assets'
import { EmbroideredAccent } from '../EmbroideredAccent'

export function Footer() {
  const year = new Date().getFullYear()
  const { facebook, instagram } = siteConfig.socialLinks

  return (
    <footer className="border-t border-dashed border-stitch-gray/40 bg-linen-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 font-display text-lg font-black text-trust-blue">
            <img src={siteLogo} alt="" className="h-8 w-8" />
            Council of the Organizations of the Ateneo - Zamboanga
          </span>
          <EmbroideredAccent color="blue" index={0} size={40} />
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">Quick Links</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="font-body text-fabric-dark transition-colors hover:text-thread-red">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">Contact</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href="mailto:info@coaz.org" className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                <Mail size={18} strokeWidth={1.75} />
                Email
              </a>
            </li>
            {facebook && (
              <li>
                <a href={facebook} className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                  <ExternalLink size={18} strokeWidth={1.75} />
                  Facebook
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <a href={instagram} className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                  <ExternalLink size={18} strokeWidth={1.75} />
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-dashed border-stitch-gray/40">
        <p className="mx-auto max-w-[1200px] px-6 py-6 text-center font-body text-sm text-stitch-gray">
          {`© ${year} Council of the Organizations of the Ateneo - Zamboanga. All Rights Reserved.`}
        </p>
      </div>
    </footer>
  )
}
