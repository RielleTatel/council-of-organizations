import { useMemo, useState } from 'react'
import Masonry from 'react-masonry-css'
import { AnimatePresence, motion } from 'framer-motion'
import type { Organization } from '../../lib/contentful/types'
import { filterOrganizations } from '../../lib/directory'
import { clusters } from '../../config/clusters'
import { threadsByColor } from '../../lib/assets'
import { PinnedSearchNote } from './PinnedSearchNote'
import { NotebookTabs } from './NotebookTabs'
import { PinnedCard } from './PinnedCard'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { DriftingThread } from '../ui/DriftingThread'

const BREAKPOINTS = { default: 4, 1100: 3, 700: 2, 500: 1 }

interface DiscoveryBoardProps {
  organizations: Organization[]
  isLoading: boolean
  activeCluster: string | null
  onClusterChange: (slug: string | null) => void
}

export function DiscoveryBoard({ organizations, isLoading, activeCluster, onClusterChange }: DiscoveryBoardProps) {
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const c of clusters) acc[c.slug] = organizations.filter((o) => o.cluster.slug === c.slug).length
    return acc
  }, [organizations])

  const results = filterOrganizations(organizations, query, activeCluster)

  return (
    <section className="relative overflow-hidden bg-canvas-cream py-16 md:py-20">
      {/* faint corkboard wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ background: 'radial-gradient(120% 80% at 50% 0%, var(--color-thread-yellow), transparent 60%)' }}
      />
      {/* yarn woven behind the board */}
      <DriftingThread src={threadsByColor.blue[0]} className="pointer-events-none absolute left-[-3%] top-24 hidden w-40 opacity-40 lg:block" duration={7} />
      <DriftingThread src={threadsByColor.pink[0]} className="pointer-events-none absolute right-[-2%] top-1/2 hidden w-32 opacity-40 lg:block" duration={6.5} delay={0.4} />
      <FloatingAccent duration={6} distance={7} rotate={4} className="pointer-events-none absolute left-[4%] bottom-16 hidden opacity-70 md:block">
        <EmbroideredAccent color="green" index={0} size={36} />
      </FloatingAccent>

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mb-10">
          <PinnedSearchNote value={query} onChange={setQuery} />
        </div>

        <div className="mb-10">
          <NotebookTabs activeCluster={activeCluster} onSelect={onClusterChange} counts={counts} />
        </div>

        {isLoading ? (
          <Masonry breakpointCols={BREAKPOINTS} className="board-masonry" columnClassName="board-masonry-col">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-[6px] bg-linen-white shadow-[0_6px_20px_rgba(46,74,143,0.08)]" />
            ))}
          </Masonry>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <EmbroideredAccent color="yellow" index={1} size={56} />
            <p className="font-body text-lg text-stitch-gray">No organizations match — try another name or cluster.</p>
          </div>
        ) : (
          // Whole-board cross-fade keyed by cluster (react-masonry-css can't do per-card exit);
          // search filters live within the current view via reconcile.
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCluster ?? 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Masonry breakpointCols={BREAKPOINTS} className="board-masonry" columnClassName="board-masonry-col">
                {results.map((org, i) => (
                  <PinnedCard key={org.slug} organization={org} index={i} />
                ))}
              </Masonry>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
