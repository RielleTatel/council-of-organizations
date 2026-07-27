import type { ThreadColor } from '../lib/assets'

export interface ClusterMeta {
  slug: string
  name: string
  color: ThreadColor
  description: string
}

export const clusters: ClusterMeta[] = [
  {
    slug: 'culture-arts-multimedia',
    name: 'Culture, Arts, and Multimedia',
    color: 'pink',
    description:
      'Organizations centered on arts (theater, music, dance), multimedia (technology-driven creative expression), and culture (preservation and promotion of heritage and subcultures).',
  },
  {
    slug: 'faith-formation',
    name: 'Faith and Formation',
    color: 'purple',
    description:
      'Structured groups that organize and propagate beliefs, rituals, and practices associated with a particular faith, fostering community, worship, and moral guidance, including volunteerism and community service.',
  },
  {
    slug: 'socio-civic-political',
    name: 'Socio-Civic and Political',
    color: 'red',
    description:
      'Organizations dedicated to fostering social responsibility, civic engagement, and political awareness through community service projects, advocacy campaigns, and educational events.',
  },
  {
    slug: 'academics',
    name: 'Academics',
    color: 'blue',
    description:
      'Academic organizations from fields including Accountancy, Business and Management, STEM, and the Humanities and Social Sciences. Fosters intellectual development, critical thinking, and career formation.',
  },
  {
    slug: 'wellness-environmental',
    name: 'Wellness and Environmental',
    color: 'green',
    description:
      'Organizations promoting holistic well-being, healthy lifestyles, sports development, and environmental stewardship, advancing physical health, sportsmanship, emergency response, and care for the environment.',
  },
  {
    slug: 'publications-communications',
    name: 'Publications and Communications',
    color: 'yellow',
    description:
      'Media-related organizations including publications, broadcasting groups, and communications entities. A platform for disseminating information, news, and content through print, digital, and broadcast channels.',
  },
]

export function clusterBySlug(slug: string): ClusterMeta | undefined {
  return clusters.find((c) => c.slug === slug)
}
