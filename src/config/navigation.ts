export interface NavItem {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Events', href: '/events' },
]
