import type { ThreadColor } from '../lib/assets'

export interface Milestone {
  number: string
  title: string
  dateLabel: string
  body: string[]
  bulletsLabel?: string
  bullets?: string[]
  cta?: { label: string; href: string }
  color: ThreadColor
}

export const milestones: Milestone[] = [
  {
    number: '01',
    title: 'Opening Ceremony',
    dateLabel: 'August 11',
    body: [
      "Kick off RecWeek with the official opening ceremony, welcoming students to a week of campus life, organizations, and community engagement.",
    ],
    bulletsLabel: 'Highlights',
    bullets: ['Opening Program', 'Welcome Remarks', 'Introduction to RecWeek', 'Official Opening of Activities'],
    color: 'red',
  },
  {
    number: '02',
    title: 'Organization Fair',
    dateLabel: 'August 11–13',
    body: [
      'Explore booths from accredited student organizations across Ateneo de Zamboanga University.',
      'Discover organizations based on your interests, meet current members, learn about upcoming projects, and find communities you can be part of.',
    ],
    bulletsLabel: 'Locations',
    bullets: ['BC Lobby & Quad', 'C Lobby & Garden', 'Paseo de Maria'],
    cta: { label: 'Explore Booth Locations', href: '/recweek/map' },
    color: 'blue',
  },
  {
    number: '03',
    title: 'Stage Performances',
    dateLabel: 'August 11–13',
    body: [
      'Enjoy live performances throughout the fair featuring various student organizations.',
      'Expect music, dance, cultural presentations, interactive games, and special showcases happening throughout the day.',
    ],
    color: 'green',
  },
  {
    number: '04',
    title: 'Organization Booth Activities',
    dateLabel: 'August 11–13',
    body: [
      'Participate in engaging booth activities prepared by each organization.',
      'Complete challenges, interact with members, and experience firsthand what each organization has to offer.',
    ],
    color: 'yellow',
  },
  {
    number: '05',
    title: 'Featured Programs & Special Activities',
    dateLabel: 'August 12',
    body: [
      'Join scheduled campus activities, organization-led events, and collaborative programs taking place during the second day of RecWeek.',
      'More details and schedules will be announced during the event.',
    ],
    color: 'pink',
  },
  {
    number: '06',
    title: 'Closing Program',
    dateLabel: 'August 13',
    body: [
      "Celebrate the successful conclusion of RecWeek with the closing ceremony.",
      "Reflect on the week's activities, recognize participating organizations, and conclude the event with community celebrations.",
    ],
    bulletsLabel: 'Highlights',
    bullets: ['Closing Remarks', 'Recognition of Participants', 'Final Performances', 'Official Closing'],
    color: 'purple',
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
