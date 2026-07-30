import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets scroll to the top on every route change, since browsers otherwise preserve scroll position. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
