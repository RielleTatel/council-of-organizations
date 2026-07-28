import type { ThreadColor } from '../lib/assets'

export interface Milestone {
  number: string
  title: string
  date?: string
  body: string[]
  bullets?: string[]
  ctaLabel: string
  ctaHref: string
  color: ThreadColor
}

export const milestones: Milestone[] = [
  {
    number: '01',
    title: 'A New Beginning',
    date: 'August 18, 2026',
    body: [
      'Every school year welcomes hundreds of new Atenistas ready to begin their college journey. Recruitment Week marks the start of countless friendships, opportunities, and unforgettable experiences.',
      'Students are invited to explore the vibrant student organization community that makes campus life meaningful beyond the classroom.',
    ],
    ctaLabel: 'Learn About COA-Z',
    ctaHref: '/about',
    color: 'red',
  },
  {
    number: '02',
    title: 'Opening Ceremony',
    date: 'August 19, 2026',
    body: [
      "Recruitment Week officially begins with an opening program introducing COA-Z, its accredited organizations, and this year's theme.",
      'Student leaders, university administrators, and organization representatives welcome the Ateneo community and celebrate the diversity of student involvement.',
    ],
    ctaLabel: 'View Program Schedule',
    ctaHref: '/events',
    color: 'blue',
  },
  {
    number: '03',
    title: 'Organization Fair',
    date: 'August 20–22, 2026',
    body: [
      'Walk through rows of interactive organization booths and meet passionate student leaders from every accredited organization.',
    ],
    bullets: [
      'Academic Organizations',
      'Culture, Arts & Multimedia',
      'Faith & Formation',
      'Publications & Communications',
      'Socio-Civic & Political',
      'Wellness & Environmental',
    ],
    ctaLabel: 'Browse Organizations',
    ctaHref: '/organizations',
    color: 'green',
  },
  {
    number: '04',
    title: 'Interactive Booth Challenges',
    body: [
      'Throughout the fair, organizations prepare engaging games, workshops, live demonstrations, performances, and mini competitions.',
    ],
    bullets: [
      'Win exclusive merchandise',
      'Participate in interactive activities',
      'Meet organization officers',
      "Experience each organization's culture firsthand",
    ],
    ctaLabel: 'See Event Gallery',
    ctaHref: '/#gallery',
    color: 'yellow',
  },
  {
    number: '05',
    title: 'Leadership Talks & Showcases',
    body: [
      'Selected organizations host short talks, panel discussions, performances, and exhibitions showcasing their projects and impact within the Ateneo community.',
    ],
    bullets: [
      'Leadership opportunities',
      'Community service',
      'Research initiatives',
      'Creative projects',
      'Advocacy campaigns',
    ],
    ctaLabel: 'View Featured Organizations',
    ctaHref: '/organizations',
    color: 'pink',
  },
  {
    number: '06',
    title: 'Membership Registration',
    body: [
      'Found the organization that matches your passion? Students may officially register their interest through organization sign-up booths or digital registration forms provided during Recruitment Week.',
      'Organization officers are available to answer questions and guide prospective members through the application process.',
    ],
    ctaLabel: 'Register Interest',
    ctaHref: '/organizations',
    color: 'purple',
  },
  {
    number: '07',
    title: 'Welcome to the COA-Z Community',
    body: [
      'Recruitment Week concludes, but your journey is only beginning.',
      'By joining an accredited organization, you become part of a community dedicated to leadership, service, collaboration, and personal growth. Every project, event, and initiative begins with students willing to make a difference.',
      'Welcome to the COA-Z family.',
    ],
    ctaLabel: 'Explore All Organizations',
    ctaHref: '/organizations',
    color: 'red',
  },
]

export const faqs = [
  {
    question: 'Who can participate in Recruitment Week?',
    answer:
      'All Ateneo de Zamboanga University students are encouraged to participate, especially incoming freshmen and transferees looking to become involved in campus life.',
  },
  {
    question: 'Do I need to join an organization during RecWeek?',
    answer:
      'No. Recruitment Week provides an opportunity to explore organizations, meet their members, and make informed decisions before joining.',
  },
  {
    question: 'Can I join multiple organizations?',
    answer:
      'Yes. Students may join multiple accredited organizations, provided they can actively participate and fulfill the responsibilities of each organization.',
  },
  {
    question: 'Is there a membership fee?',
    answer: 'Membership requirements and fees, if any, are determined by each individual organization.',
  },
]
