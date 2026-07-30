/**
 * Adapts the real organization roster (src/data/organizations.ts, matching
 * the official OSA Clusters of Organizations for AY 2026-2027) into the
 * app's Organization shape. The source data's 8-group taxonomy (Student
 * Government, Academic Organizations, Academic Cluster, Culture/Arts/
 * Multimedia, Publications and Communications, Socio-Civic and Political,
 * Wellness and Environmental, Faith and Formation) folds into the app's
 * 6-cluster taxonomy from docs/content.md by merging "Student Government"
 * into Socio-Civic and Political, and both "Academic Organizations" and
 * "Academic Cluster" into a single Academics cluster.
 */
import { organizations as rawOrganizations, type Organization as RawOrganization } from '../data/organizations'
import { clusterBySlug, type ClusterMeta } from '../config/clusters'
import type { Organization } from './contentful/types'

const clusterByOrgId: Record<string, ClusterMeta['slug']> = {
  // Student Government
  'el-consejo-atenista': 'socio-civic-political',

  // Academic Organizations
  'accountancy-academic-organization': 'academics',
  'education-academic-organization': 'academics',
  siteao: 'academics',
  'nursing-academic-organization': 'academics',
  'liberal-arts-academic-organization': 'academics',
  'management-academic-organization': 'academics',

  // Academic Cluster
  'society-of-ateneo-scholars': 'academics',
  'adzu-ignatian-civil-engineering-students-organization': 'academics',
  'the-ateneo-communicators': 'academics',
  'ateneo-psych-icare': 'academics',
  'samahang-pilosopiya-ng-ateneo': 'academics',
  'ateneo-biological-society': 'academics',
  aicg: 'academics',
  'jieep-adzu': 'academics',
  jpia: 'academics',
  'international-studies-organization': 'academics',
  'jma-adzu': 'academics',

  // Culture, Arts and Multimedia
  'ateneo-music-club': 'culture-arts-multimedia',
  'ateneo-art-company': 'culture-arts-multimedia',
  'ateneo-blue-vigors': 'culture-arts-multimedia',
  'ateneo-de-zamboanga-university-glee-club': 'culture-arts-multimedia',
  'teatro-ateneo-de-zamboanga': 'culture-arts-multimedia',
  'ateneo-eagle-pep-squad': 'culture-arts-multimedia',

  // Publications and Communications
  'ateneo-debate-union': 'publications-communications',
  'the-beacon-publications': 'publications-communications',

  // Socio-Civic and Political
  'rotaract-club-adzu': 'socio-civic-political',
  'la-liga-historia-zamboanguena': 'socio-civic-political',
  'ateneo-pride-network': 'socio-civic-political',
  'el-fuente-ph': 'socio-civic-political',
  ipadz: 'socio-civic-political',
  sadaqah: 'socio-civic-political',
  'usad-adzu': 'socio-civic-political',
  'junior-jaycees-chamber-adzu': 'socio-civic-political',

  // Wellness and Environmental
  'the-ecowatch-organization': 'wellness-environmental',
  'fable-adzu': 'wellness-environmental',
  'adzu-judo-club': 'wellness-environmental',
  'ateneo-peers-circle': 'wellness-environmental',

  // Faith and Formation
  'ateneo-liturgical-society': 'faith-formation',
  'ateneo-lectors-society': 'faith-formation',
  'ateneo-catechetical-instruction-league': 'faith-formation',
  'christian-life-community-adzu': 'faith-formation',
  'cfc-youth-for-christ-adzu': 'faith-formation',
  'muslim-students-association-adzu': 'faith-formation',
  'psalm-adzu': 'faith-formation',
  'society-of-the-knights-of-ignatius': 'faith-formation',
  'salt-community': 'faith-formation',
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
