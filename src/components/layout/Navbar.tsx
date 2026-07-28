import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { siteLogo } from '../../lib/assets'
import { cn } from '../../lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-linen-white/95 shadow-[0_2px_16px_rgba(46,74,143,0.06)] backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-black tracking-[-0.02em] text-trust-blue">
          <img src={siteLogo} alt="" className="h-9 w-9" />
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red',
                    isActive && 'border-b-2 border-thread-red pb-1',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden text-trust-blue"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu strokeWidth={1.75} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-canvas-cream md:hidden">
          <div className="flex h-[72px] items-center justify-between px-6">
            <span className="flex items-center gap-2 font-display text-xl font-black text-trust-blue">
              <img src={siteLogo} alt="" className="h-9 w-9" />
              {siteConfig.name}
            </span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="text-trust-blue">
              <X strokeWidth={1.75} />
            </button>
          </div>
          <ul className="flex flex-col px-6">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-dashed border-stitch-gray/50">
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-lg font-medium text-trust-blue"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
