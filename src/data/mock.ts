import type { Event, Leader } from '../lib/contentful/types'

function leader(id: string, name: string, role: string, office: string, team?: string): Leader {
  return {
    id,
    name,
    role,
    office,
    team,
    image: '',
    bio: '',
  }
}

export const mockLeaders: Leader[] = [
  leader('chair-exec-sec', 'Aubrey Mae L. Tomong', 'Executive Secretary', 'Office of the Chairperson'),
  leader('chair-under-internal', 'Gina M. Salamuddin', 'Undersecretary for Internal Affairs', 'Office of the Chairperson'),
  leader('chair-under-external', 'Ryle Xyrex L. Jumawan', 'Undersecretary for External Affairs', 'Office of the Chairperson'),
  leader('chair-legal', 'Marc Justin E. Casino', 'Chief Legal and Policy Adviser', 'Office of the Chairperson'),

  leader('secgen-secgen', 'Ken S. Ordeniza', 'Secretary General', 'Office of the Secretary-General'),
  leader('secgen-transparency', 'Jhan Drei T. Araña', 'Undersecretary for Transparency', 'Office of the Secretary-General'),
  leader('secgen-social-action', 'Nolram Carpio', 'Undersecretary for Social Action and Advocacy', 'Office of the Secretary-General'),

  leader('comms-head', 'Jamea Roushiana S. Rajah', 'Communications Head', 'Office of Communications'),
  leader('comms-social-media', 'Kristel Ricalde', 'Social Media Handler', 'Office of Communications'),
  leader('comms-content-1', 'Erika Sheena Lim', 'Content Manager', 'Office of Communications'),
  leader('comms-content-2', 'Khameela Jzanna M. Kasim', 'Content Manager', 'Office of Communications'),

  leader(
    'creatives-head',
    'Leo Leireen C. Magpantay',
    'Creatives Head',
    'Office of Creatives and Branding',
    'Creatives and Branding',
  ),
  leader(
    'creatives-assoc',
    'Mico R. Morales',
    'Creatives Associate',
    'Office of Creatives and Branding',
    'Creatives and Branding',
  ),
  leader(
    'docu-head',
    'Roy Lorenz C. Jaculan',
    'Documentations Head',
    'Office of Creatives and Branding',
    'Documentation and Videography',
  ),

  leader('finance-head', 'David Isidore D.R. De Leon', 'Finance Head', 'Office of Finance'),
  leader('treasurer', 'Louise Anne O. Sieras', 'Treasurer', 'Office of Finance'),
  leader('finance-subsidy', 'John Paul Miranda', 'Subsidy Officer', 'Office of Finance'),
  leader('finance-associate', 'Queenie M. Raciles', 'Finance Associate', 'Office of Finance'),
]

function story(fields: Omit<Event, 'id' | 'isFeatured' | 'isFlagship'> & { isFeatured?: boolean; isFlagship?: boolean }): Event {
  return { id: fields.slug, isFeatured: false, isFlagship: false, ...fields }
}

/**
 * Event Highlights content — COA-Z's curated newsroom, editorially selected by
 * COA-Z administrators. Hardcoded per organization submissions pending a CMS.
 */
export const mockEvents: Event[] = [
  story({
    slug: '50th-jjc-national-convention-cebu',
    title: "Exploring Cebu, Embracing Leadership | 50th JJC Philippines National Convention",
    date: '2026-07-28',
    organization: 'Junior Jaycees Chamber - AdZU',
    excerpt:
      "The third day of the 50th JJC Philippines National Convention paired Cebu's cultural heritage with a formal induction ceremony for incoming national officers.",
    description:
      "The third day of the 50th JJC Philippines National Convention brought together the best of Cebu's cultural heritage and the enduring spirit of leadership, giving delegates a meaningful experience both inside and outside the convention halls.",
    body: [
      "The third day of the 50th JJC Philippines National Convention brought together the best of Cebu's cultural heritage and the enduring spirit of leadership, giving delegates a meaningful experience both inside and outside the convention halls.",
      "Delegates toured some of Cebu City's most iconic landmarks, including the University of San Carlos, El Fuerte de San Pedro Museum, Puso Village, and the breathtaking Temple of Leah. Each destination offered a glimpse into the city's rich history, traditions, and vibrant local culture.",
      'The day concluded with the JJC Philippines National Induction Ceremony, where the National President and Area Vice President for Visayas were formally inducted into office. The evening also recognized outstanding members and chapters through the presentation of special awards, celebrating excellence, service, and leadership across the organization.',
    ],
    credit: 'Caption by JJC Thamara Arrieta · Layout by JJC Sheena Burahan',
    socialLinks: {
      facebook: 'https://www.facebook.com/jjcateneo',
      instagram: 'https://www.instagram.com/jjcadzu/',
      email: 'jjcateneo@gmail.com',
    },
    image: '/jjc.jpeg',
    isFeatured: true,
    isFlagship: true,
  }),
  story({
    slug: 'picpa-grand-cups-2026',
    title: 'Event Highlights | PICPA Grand Cups',
    date: '2026-07-25',
    organization: 'JPIA - Ateneo de Zamboanga University',
    excerpt:
      "Ten Ateneans represented JPIA-AdZU at PICPA ZAMBASULTA's Fundamentals of Accounting and All Aboard Grand Cups.",
    description:
      'The Philippine Institute of Certified Public Accountants – ZAMBASULTA Chapter organized two academic competitions at the PICPA House, Veterans Avenue, Zamboanga City.',
    body: [
      'Last July 25, 2026, the Philippine Institute of Certified Public Accountants – ZAMBASULTA Chapter organized two academic competitions, the Fundamentals of Accounting Grand Cup and the All Aboard Grand Cup, at the PICPA House, Veterans Avenue, Zamboanga City.',
      'Ten Ateneans participated in the event: five competed in the Fundamentals of Accounting Grand Cup, and the other five competed in the All Aboard Grand Cup.',
      "JPIA-AdZU extends its warmest congratulations to all participants and champions. Let's continue to illuminate with JPIAn spirit.",
    ],
    image: '/jpia.jpeg',
  }),
  story({
    slug: 'anyam-tourism-startup-challenge',
    title: '"Anyam" Represents Region IX and AdZU at the National Tourism Start-up Challenge',
    date: '2026-05-11',
    organization: 'SITEAO',
    excerpt:
      '"Anyam" advanced from Regional Winner to the national Tourism Start-up Challenge finals, earning AdZU a ₱250,000 grant.',
    description:
      '"Anyam," the Regional Winner of the Tourism Start-up Challenge, advanced to the national level competition held on May 11–12, 2026, in Quezon City.',
    body: [
      'As tourism continues to create opportunities for innovative and forward-thinking Filipino youth, "Anyam," the Regional Winner of the Tourism Start-up Challenge, advanced to the national level competition held on May 11–12, 2026, in Quezon City. The initiative, a collaboration among the Department of Tourism (DOT), the Tourism Infrastructure and Enterprise Zone Authority (TIEZA), and the Commission on Higher Education (CHED), awarded a total of ₱19.25 million to 17 Higher Education Institutions from Luzon, Visayas, and Mindanao.',
      'The Tourism Start-up Challenge is an annual nationwide competition that gathers students from HEIs with innovative tourism-related projects, providing them the opportunity to compete for funding under the Higher Education Development Fund. Emerging as the regional winner, "Anyam" proudly represented Region IX and Ateneo de Zamboanga University at the national selection, where the team showcased its innovative tourism initiative alongside fellow regional winners from across the Philippines. The AdZU team, in recognition of its achievement as regional winner, was awarded a ₱250,000 grant.',
      'Congratulations to the following Bachelor of Science in Computer Science students who participated in the event: Gabrielle Tatel, Adrian Ranier Fabian, Donald Lee Novo, John Marco Antonio Yu, Jon Orillineda, Resham Qhaleed Kadiri, and Kenneth Clyde Que. Mr. Andrae Manguilimotan, a member of the Computer Science Department, coached the team.',
      'Representing both the University and Region IX at the national level reflects the team\'s dedication, creativity, and commitment to innovation. The Computer Science Department and the College of Science, Information Technology, and Engineering proudly commend the team for their accomplishment and for bringing regional pride to the national stage.',
    ],
    image: '/siteao.jpg',
  }),
]
