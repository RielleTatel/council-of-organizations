import type { ThreadColor } from '../lib/assets'

export interface ClusterMeta {
  slug: string
  name: string
  color: ThreadColor
  description: string
}

export const clusters: ClusterMeta[] = [
  {
    slug: 'student-government',
    name: 'Student Government',
    color: 'gold',
    description:
      'The supreme student government of the university, representing and advocating for the interests of the student body.',
  },
  {
    slug: 'academic-organizations',
    name: 'Academic Organizations',
    color: 'teal',
    description:
      'The official academic-home organizations for each degree program, supporting professional growth, academic excellence, and collaboration within the discipline.',
  },
  {
    slug: 'academic-cluster',
    name: 'Academic Cluster',
    color: 'blue',
    description:
      'Co-curricular academic organizations from fields including Business, STEM, and the Humanities and Social Sciences, fostering intellectual development, critical thinking, and career formation.',
  },
  {
    slug: 'culture-arts-multimedia',
    name: 'Culture, Arts, and Multimedia',
    color: 'pink',
    description:
      'Organizations centered on arts (theater, music, dance), multimedia (technology-driven creative expression), and culture (preservation and promotion of heritage and subcultures).',
  },
  {
    slug: 'publications-communications',
    name: 'Publications and Communications',
    color: 'yellow',
    description:
      'Media-related organizations including publications, broadcasting groups, and communications entities. A platform for disseminating information, news, and content through print, digital, and broadcast channels.',
  },
  {
    slug: 'socio-civic-political',
    name: 'Socio-Civic and Political',
    color: 'red',
    description:
      'Organizations dedicated to fostering social responsibility, civic engagement, and political awareness through community service projects, advocacy campaigns, and educational events.',
  },
  {
    slug: 'wellness-environmental',
    name: 'Wellness and Environmental',
    color: 'green',
    description:
      'Organizations promoting holistic well-being, healthy lifestyles, sports development, and environmental stewardship, advancing physical health, sportsmanship, emergency response, and care for the environment.',
  },
  {
    slug: 'faith-formation',
    name: 'Faith and Formation',
    color: 'purple',
    description:
      'Structured groups that organize and propagate beliefs, rituals, and practices associated with a particular faith, fostering community, worship, and moral guidance, including volunteerism and community service.',
  },
]

export function clusterBySlug(slug: string): ClusterMeta | undefined {
  return clusters.find((c) => c.slug === slug)
}
