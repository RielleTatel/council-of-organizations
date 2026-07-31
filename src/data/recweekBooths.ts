import { organizations, type Organization } from './organizations'

export type BoothShape = {
  id: string
  orgId?: string
  acronym: string
  boothNumber?: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export type LandmarkType =
  | 'stage' | 'tent' | 'pond' | 'pathway' | 'church' | 'statue' | 'podium' | 'entrance' | 'divider'

export type Landmark = {
  id: string
  type: LandmarkType
  label?: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export type VenueId = 'bc-lobby-quad' | 'c-lobby-garden' | 'paseo-de-maria'

export type VenueSlug = 'bc' | 'cgarden' | 'paseo'

export type Venue = {
  id: VenueId
  slug: VenueSlug
  label: string
  viewBox: string
  landmarks: Landmark[]
  booths: BoothShape[]
}

const byId = new Map(organizations.map((o) => [o.id, o]))

export function boothOrg(booth: BoothShape): Organization | undefined {
  return booth.orgId ? byId.get(booth.orgId) : undefined
}
export function boothFullName(booth: BoothShape): string | undefined {
  return boothOrg(booth)?.name
}
export function boothHref(booth: BoothShape): string | undefined {
  return boothOrg(booth)?.link
}

export function venueBySlug(slug: string | null): Venue | undefined {
  return venues.find((v) => v.slug === slug)
}

export const venues: Venue[] = [
  {
    id: 'bc-lobby-quad',
    slug: 'bc',
    label: 'BC Lobby & Quad',
    viewBox: '0 0 100 145',
    landmarks: [
      { id: 'bc-tent', type: 'tent', label: 'Tent', x: 9, y: 8, width: 82, height: 40 },
      { id: 'bc-podium', type: 'podium', label: 'Podium', x: 45, y: 42, width: 10, height: 5 },
      { id: 'bc-quad', type: 'entrance', label: 'BC Quad', x: 4, y: 5, width: 92, height: 58 },
      { id: 'bc-statue', type: 'statue', label: 'St. Iggy', x: 38, y: 66, width: 24, height: 9 },
      { id: 'bc-lobby', type: 'entrance', label: 'BC Lobby', x: 12, y: 80, width: 76, height: 60 },
    ],
    booths: [
      { id: 'bc-ecowatch', orgId: 'the-ecowatch-organization', acronym: 'ECO WATCH', x: 11, y: 54, width: 10, height: 7 },
      { id: 'bc-apc', orgId: 'ateneo-peers-circle', acronym: 'APC', x: 21, y: 54, width: 10, height: 7 },
      { id: 'bc-judo', orgId: 'adzu-judo-club', acronym: 'JUDO', x: 68, y: 54, width: 10, height: 7 },
      { id: 'bc-fable', orgId: 'fable-adzu', acronym: 'FABLE', x: 78, y: 54, width: 10, height: 7 },
      { id: 'bc-llhz', orgId: 'la-liga-historia-zamboanguena', acronym: 'LLHZ', x: 15, y: 80, width: 7, height: 14, rotation: 90 },
      { id: 'bc-jjc', orgId: 'junior-jaycees-chamber-adzu', acronym: 'JJC', x: 15, y: 94, width: 7, height: 14, rotation: 90 },
      { id: 'bc-efph', orgId: 'el-fuente-ph', acronym: 'EF Ph', x: 15, y: 110, width: 7, height: 14, rotation: 90 },
      { id: 'bc-ipadz', orgId: 'ipadz', acronym: 'IPAdZ', x: 15, y: 124, width: 7, height: 14, rotation: 90 },
      { id: 'bc-apn', orgId: 'ateneo-pride-network', acronym: 'APN', x: 78, y: 80, width: 7, height: 14, rotation: 90 },
      { id: 'bc-usad', orgId: 'usad-adzu', acronym: 'USAD', x: 78, y: 94, width: 7, height: 14, rotation: 90 },
      { id: 'bc-rotaract', orgId: 'rotaract-club-adzu', acronym: 'ROTARACT', x: 78, y: 110, width: 7, height: 14, rotation: 90 },
      { id: 'bc-sadaqah', orgId: 'sadaqah', acronym: 'SADAQAH', x: 78, y: 124, width: 7, height: 14, rotation: 90 },
    ],
  },
  {
    id: 'c-lobby-garden',
    slug: 'cgarden',
    label: 'C Lobby & Garden',
    viewBox: '0 0 100 170',
    landmarks: [
      { id: 'c-stage', type: 'stage', label: 'Stage', x: 28, y: 6, width: 44, height: 16 },
      { id: 'c-pond', type: 'pond', label: 'Pond', x: 80, y: 8, width: 14, height: 30 },
      { id: 'c-lobby', type: 'entrance', label: 'C - Lobby', x: 6, y: 138, width: 88, height: 28 },
      { id: 'c-divider', type: 'divider', x: 4, y: 79, width: 92, height: 3 },
    ],
    booths: [
      { id: 'c-psych', orgId: 'ateneo-psych-icare', acronym: 'PSYCH iCARE', x: 8, y: 26, width: 7, height: 12, rotation: 90 },
      { id: 'c-alms', acronym: 'ALMS', x: 8, y: 39, width: 7, height: 12, rotation: 90 },
      { id: 'c-fast', orgId: 'foundation-of-ateneo-student-tutors', acronym: 'FAST', x: 8, y: 54, width: 7, height: 12, rotation: 90 },
      { id: 'c-issoa', orgId: 'international-studies-organization', acronym: 'ISSOA', x: 8, y: 67, width: 7, height: 12, rotation: 90 },
      { id: 'c-isoa', orgId: 'international-studies-organization', acronym: 'ISOA', x: 30, y: 68, width: 9, height: 7 },
      { id: 'c-jiecep', orgId: 'jieep-adzu', acronym: 'JIECEP', x: 39, y: 68, width: 9, height: 7 },
      { id: 'c-spa', orgId: 'samahang-pilosopiya-ng-ateneo', acronym: 'SPA', x: 58, y: 68, width: 9, height: 7 },
      { id: 'c-sas', orgId: 'society-of-ateneo-scholars', acronym: 'SAS', x: 67, y: 68, width: 9, height: 7 },
      { id: 'c-aicg', orgId: 'aicg', acronym: 'AICG', x: 8, y: 82, width: 7, height: 12, rotation: 90 },
      { id: 'c-abs', orgId: 'ateneo-biological-society', acronym: 'ABS', x: 8, y: 95, width: 7, height: 12, rotation: 90 },
      { id: 'c-ices', orgId: 'adzu-ignatian-civil-engineering-students-organization', acronym: 'ADZU ICES', x: 8, y: 110, width: 7, height: 12, rotation: 90 },
      { id: 'c-icpep', acronym: 'ICPEP', x: 8, y: 123, width: 7, height: 12, rotation: 90 },
      { id: 'c-nfjpia', orgId: 'jpia', acronym: 'JPIA', x: 85, y: 82, width: 7, height: 12, rotation: 90 },
      { id: 'c-jma', orgId: 'jma-adzu', acronym: 'JMA', x: 85, y: 95, width: 7, height: 12, rotation: 90 },
      { id: 'c-adu', orgId: 'ateneo-debate-union', acronym: 'ADU', x: 40, y: 104, width: 9, height: 7 },
      { id: 'c-beacon', orgId: 'the-beacon-publications', acronym: 'BEACON', x: 49, y: 104, width: 9, height: 7 },
      { id: 'c-glee', orgId: 'ateneo-de-zamboanga-university-glee-club', acronym: 'GLEE CLUB', x: 10, y: 142, width: 9, height: 7, rotation: -20 },
      { id: 'c-abv', orgId: 'ateneo-blue-vigors', acronym: 'ABV', x: 20, y: 150, width: 9, height: 7, rotation: -20 },
      { id: 'c-aepep', orgId: 'ateneo-eagle-pep-squad', acronym: 'AE PEP', x: 40, y: 148, width: 9, height: 7 },
      { id: 'c-amc', orgId: 'ateneo-music-club', acronym: 'AMC', x: 49, y: 148, width: 9, height: 7 },
      { id: 'c-taz', orgId: 'teatro-ateneo-de-zamboanga', acronym: 'TAZ', x: 82, y: 150, width: 9, height: 7, rotation: 20 },
      { id: 'c-artco', orgId: 'ateneo-art-company', acronym: 'ARTCO', x: 72, y: 142, width: 9, height: 7, rotation: 20 },
    ],
  },
  {
    id: 'paseo-de-maria',
    slug: 'paseo',
    label: 'Paseo de Maria',
    viewBox: '0 0 150 100',
    landmarks: [
      { id: 'p-path-h', type: 'pathway', label: 'Pathway', x: 22, y: 38, width: 118, height: 30 },
      { id: 'p-path-v', type: 'pathway', label: 'Path Way', x: 96, y: 8, width: 12, height: 30 },
      { id: 'p-church', type: 'church', label: 'Univ Church', x: 108, y: 78, width: 40, height: 20 },
    ],
    booths: [
      { id: 'p-acil', orgId: 'ateneo-catechetical-instruction-league', acronym: 'ACIL', x: 26, y: 24, width: 10, height: 9 },
      { id: 'p-alecs', orgId: 'ateneo-lectors-society', acronym: 'ALECS', x: 36, y: 24, width: 10, height: 9 },
      { id: 'p-als', orgId: 'ateneo-liturgical-society', acronym: 'ALS', x: 46, y: 24, width: 10, height: 9 },
      { id: 'p-clc', orgId: 'christian-life-community-adzu', acronym: 'CLC', x: 62, y: 24, width: 10, height: 9 },
      { id: 'p-cfc', orgId: 'cfc-youth-for-christ-adzu', acronym: 'CFC', x: 72, y: 24, width: 10, height: 9 },
      { id: 'p-ski', orgId: 'society-of-the-knights-of-ignatius', acronym: 'SKI', x: 82, y: 24, width: 10, height: 9 },
      { id: 'p-msa', orgId: 'muslim-students-association-adzu', acronym: 'MSA', x: 40, y: 72, width: 10, height: 9 },
      { id: 'p-salt', orgId: 'salt-community', acronym: 'SALT', x: 50, y: 72, width: 10, height: 9 },
      { id: 'p-psalm', orgId: 'psalm-adzu', acronym: 'PSALM', x: 60, y: 72, width: 10, height: 9 },
    ],
  },
]
