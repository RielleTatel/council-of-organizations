import type { Event, Leader } from '../lib/contentful/types'

function leader(id: string, name: string, role: string, office: string): Leader {
  return {
    id,
    name,
    role,
    office,
    image: `https://picsum.photos/seed/coaz-officer-${id}/400/400`,
    bio: '',
  }
}

export const mockLeaders: Leader[] = [
  leader('chair', 'Sofia Margarita del Rosario', 'Chairperson', 'Office of the Chairperson'),
  leader('exec-sec', 'Lorenzo Miguel Aquino', 'Executive Secretary to the Chairperson', 'Office of the Chairperson'),
  leader('under-internal', 'Beatriz Camille Yulo', 'Undersecretary for Internal Affairs', 'Office of the Chairperson'),
  leader('under-external', 'Gabriel Ignacio Lozano', 'Undersecretary for External Affairs', 'Office of the Chairperson'),
  leader('legal', 'Andrea Lucille Panganiban', 'Chief Legal and Policy Adviser', 'Office of the Chairperson'),
  leader('sec-gen', 'Rafael Dominic Suarez', 'Secretary-General', 'Office of the Secretary-General'),
  leader('under-transparency', 'Ma. Angelica Ferrer', 'Undersecretary for Transparency', 'Office of the Secretary-General'),
  leader('comms-head', 'Julia Kristine Mercado', 'Communications Head', 'Office of Communications'),
  leader('social-media', 'Enzo Gabriel Villanueva', 'Social Media Handler', 'Office of Communications'),
  leader('content', 'Nadine Patricia Sison', 'Content Manager', 'Office of Communications'),
  leader('creatives-head', 'Sebastian Kyle Ramos', 'Creatives Head', 'Office of Creatives and Branding'),
  leader('docu-head', 'Alexandra Rose Chua', 'Documentation Head', 'Office of Creatives and Branding'),
  leader('creatives-assoc', 'Miguel Lorenzo Tanjuatco', 'Creatives Associate', 'Office of Creatives and Branding'),
  leader('docu-assoc', 'Chloe Isabelle Ang', 'Documentation Associate', 'Office of Creatives and Branding'),
  leader('finance-head', 'Vincent Carlo Magsino', 'Finance Head', 'Office of Finance'),
  leader('treasurer', 'Katrina Bianca Ocampo', 'Treasurer', 'Office of Finance'),
  leader('subsidy', 'Paolo Martin Guevarra', 'Subsidy Officer', 'Office of Finance'),
]

function event(
  slug: string,
  title: string,
  date: string,
  description: string,
  image: string,
  isFeatured = false,
  isFlagship = false,
): Event {
  return { id: slug, title, slug, date, description, image, isFeatured, isFlagship }
}

export const mockEvents: Event[] = [
  event(
    'org-fair-2026',
    'OrgFair 2026',
    '2026-08-15',
    'The annual organization fair where all accredited COA-Z member organizations welcome new members with booths, performances, and recruitment drives.',
    '/ELEMENTS/OrgFair.png',
    true,
    true,
  ),
  event(
    'leadership-summit',
    'COA-Z Leadership Summit',
    '2026-09-05',
    'A two-day formation summit gathering organization leaders for workshops on governance, collaboration, and Ignatian leadership.',
    'https://picsum.photos/seed/coaz-leadership-summit/800/500',
    true,
  ),
  event(
    'cluster-night',
    'Interwoven: Cluster Night',
    '2026-10-10',
    'A cultural showcase celebrating the six organization clusters through performances, exhibits, and shared advocacies.',
    'https://picsum.photos/seed/coaz-cluster-night/800/500',
  ),
  event(
    'general-assembly',
    'COA-Z General Assembly',
    '2026-06-20',
    'The opening general assembly where member organizations ratified the Council agenda for the academic year.',
    'https://picsum.photos/seed/coaz-general-assembly/800/500',
  ),
  event(
    'service-caravan',
    'Ignatian Service Caravan',
    '2026-05-12',
    'A community service caravan bringing member organizations together for outreach across partner communities in Zamboanga.',
    'https://picsum.photos/seed/coaz-service-caravan/800/500',
  ),
]
