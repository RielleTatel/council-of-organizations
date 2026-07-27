/**
 * Adapts the real organization roster (src/data/organizations.ts, sourced
 * from actual accredited orgs) into the app's Organization shape.
 *
 * The source data uses its own 8-category taxonomy (Academic, Business,
 * Sports and Recreation, Student Government, ...), which does not map
 * 1:1 onto the 6-cluster taxonomy from docs/content.md. This module
 * assigns each organization to the cluster it fits best by individual
 * judgment, not a bulk category rename: several "Sports and Recreation"
 * entries are actually performance/arts groups (dance, cheer, music,
 * theater) and are placed under Culture, Arts, and Multimedia; a few
 * "Socio-Civic and Political" entries are wellness-focused (peer
 * counseling, disaster response) and are placed under Wellness and
 * Environmental; professional/business orgs are folded into Academics,
 * which explicitly covers "Business and Management" per content.md.
 */
import { organizations as rawOrganizations, type Organization as RawOrganization } from '../data/organizations'
import { clusterBySlug, type ClusterMeta } from '../config/clusters'
import type { Organization } from './contentful/types'

const clusterByOrgId: Record<string, ClusterMeta['slug']> = {
  'el-consejo-atenista': 'socio-civic-political',
  'accountancy-academic-organization': 'academics',
  'education-academic-organization': 'academics',
  siteao: 'academics',
  'nursing-academic-organization': 'academics',
  'liberal-arts-academic-organization': 'academics',
  'jieep-adzu': 'academics',
  'samahang-pilosopiya-ng-ateneo': 'academics',
  'information-security-students-organization': 'academics',
  fabricreate: 'academics',
  'international-studies-organization': 'academics',
  bionics: 'academics',
  aicg: 'academics',
  'adzu-ignatian-civil-engineering-students-organization': 'academics',
  'ateneo-biological-society': 'academics',
  'ateneo-debate-union': 'publications-communications',
  'foundation-of-ateneo-student-tutors': 'socio-civic-political',
  'gdg-on-campus-blue-eagle': 'academics',
  'management-academic-organization': 'academics',
  jpia: 'academics',
  'jma-adzu': 'academics',
  'legal-management-society': 'academics',
  'developing-entrepreneur-ateneo-league': 'academics',
  'junior-jaycees-chamber-adzu': 'socio-civic-political',
  'ateneo-blue-vigors': 'culture-arts-multimedia',
  'ateneo-eagle-pep-squad': 'culture-arts-multimedia',
  'ateneo-music-club': 'culture-arts-multimedia',
  'teatro-ateneo-de-zamboanga': 'culture-arts-multimedia',
  'ateneo-art-company': 'culture-arts-multimedia',
  imaje: 'culture-arts-multimedia',
  coaz: 'publications-communications',
  'la-liga-historia-zamboanguena': 'culture-arts-multimedia',
  'association-of-bse-centennial-scholars': 'academics',
  'society-of-ateneo-scholars': 'academics',
  'the-beacon-publications': 'publications-communications',
  sinag: 'socio-civic-political',
  sadaqah: 'socio-civic-political',
  'el-fuente-ph': 'socio-civic-political',
  'adzu-red-cross-council': 'wellness-environmental',
  'laz-bellezas': 'socio-civic-political',
  stand: 'socio-civic-political',
  ipadz: 'socio-civic-political',
  'solidarity-of-leaders': 'socio-civic-political',
  'ateneo-peers-circle': 'wellness-environmental',
  'usad-adzu': 'socio-civic-political',
  yahra: 'socio-civic-political',
  'ateneo-catechetical-instruction-league': 'faith-formation',
  'ateneo-lectors-society': 'faith-formation',
  'ateneo-liturgical-society': 'faith-formation',
  'cfc-youth-for-christ-adzu': 'faith-formation',
  'christian-life-community-adzu': 'faith-formation',
  'every-nation-campus-adzu': 'faith-formation',
  'muslim-students-association-adzu': 'faith-formation',
  'psalm-adzu': 'faith-formation',
  'society-of-the-knights-of-ignatius': 'faith-formation',
  'the-ecowatch-organization': 'wellness-environmental',
  safepaws: 'wellness-environmental',
}

function adapt(raw: RawOrganization): Organization {
  const clusterSlug = clusterByOrgId[raw.id]
  if (!clusterSlug) {
    throw new Error(`No cluster mapping for organization id "${raw.id}". Add it to clusterByOrgId.`)
  }
  const cluster = clusterBySlug(clusterSlug)
  if (!cluster) {
    throw new Error(`Unknown cluster slug "${clusterSlug}" mapped from organization id "${raw.id}".`)
  }

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.id,
    cluster: { id: cluster.slug, name: cluster.name, slug: cluster.slug },
    description: raw.description,
    logo: raw.logo,
    officers: [],
    link: raw.link,
  }
}

export const realOrganizations: Organization[] = rawOrganizations.map(adapt)
