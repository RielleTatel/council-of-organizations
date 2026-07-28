import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import type { Event } from '../../lib/contentful/types'
import { cn } from '../../lib/utils'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface EventCardProps {
  event: Event
  muted?: boolean
}

export function EventCard({ event, muted = false }: EventCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,74,143,0.12)]',
        muted && 'opacity-80',
      )}
    >
      {event.image ? (
        <img
          src={event.image}
          alt=""
          role="presentation"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-thread-yellow/15" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-6">
        {event.organization && (
          <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-thread-red">
            {event.organization}
          </span>
        )}
        <h3 className="font-display text-xl font-bold text-trust-blue transition-colors duration-300 group-hover:text-thread-red">
          {event.title}
        </h3>
        <p className="flex items-center gap-2 font-body text-sm text-stitch-gray">
          <Calendar size={16} strokeWidth={1.75} />
          {formatDate(event.date)}
        </p>
        <p className="line-clamp-2 font-body leading-relaxed text-fabric-dark">
          {event.excerpt ?? event.description}
        </p>
        <Link
          to={`/events/${event.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
        >
          Read Story
          <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  )
}
