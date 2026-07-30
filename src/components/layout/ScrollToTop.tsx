import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToTop() {
  window.scrollTo(0, 0)
  // Belt-and-suspenders for mobile browsers: some (notably iOS Safari) keep the
  // outgoing page's scroll position on the incoming one if this runs before the
  // new route has finished laying out, so document scroll is reset directly too.
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** Resets scroll to the top on every route change, since browsers otherwise preserve scroll position. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    scrollToTop()
    const raf = requestAnimationFrame(scrollToTop)
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return null
}
