import copy from "./copy.json";
import arrays from "./bootstrap-arrays.json";
import { realOrganizations } from "../organizationsSource";
import { mockEvents, mockLeaders } from "../../data/mock";
import { milestones, faqs } from "../../data/recweek";
import { clusters } from "../../config/clusters";
import { offices, buklodCommittee } from "../../config/leadership";
import { siteConfig } from "../../config/site";
import { navItems } from "../../config/navigation";
import { siteLogo, orgFairLogo, type ThreadColor } from "../assets";
import { defaultSeo } from "../../config/seo";

export type EntryKind =
  | "organization"
  | "story"
  | "leadership"
  | "recweek"
  | "home"
  | "about"
  | "settings"
  | "clusters";
export type Document = Record<string, unknown>;
export interface PublishedEntry {
  entry_id: string;
  kind: EntryKind;
  slug: string;
  document: Document;
  published_at?: string;
}
export interface CopyItem {
  title: string;
  body: string;
  color: ThreadColor;
}
export const singletonDefaults = {
  leadership: {
    members: mockLeaders.map((leader) => ({
      ...leader,
      team: leader.team ?? "",
    })),
    offices,
    buklodCommittee,
    copy: copy.leadership,
  },
  recweek: {
    name: "Dia de Colores | RecWeek OrgFair 2026",
    startDate: "2026-08-03",
    endDate: "2026-08-07",
    dateLabel: "August 3–7, 2026",
    location: "Ateneo de Zamboanga University",
    logo: orgFairLogo,
    headlineLines: [
      "Discover Organizations.",
      "Meet New People.",
      "Find Your Community.",
    ],
    audienceLabel: "Open to All Students",
    milestones: milestones.map((item) => ({
      ...item,
      bulletsLabel: item.bulletsLabel ?? "",
      bullets: item.bullets ?? [],
      cta: item.cta ?? { label: "", href: "" },
    })),
    faqs,
    copy: copy.recweek,
  },
  home: {
    purposes: arrays.home.PURPOSES as CopyItem[],
    gallery: arrays.gallery.GALLERY_FILES.map((file, i) => ({
      src: `/gallery/${file}`,
      alt: `COA-Z community moment ${i + 1}`,
    })),
    studentsCount: "6000+",
    statisticsLabels: [
      "Accredited Organizations",
      "Organization Clusters",
      "Executive Officers",
      "Students",
    ],
    copy: copy.home,
  },
  about: {
    functions: arrays.about.FUNCTIONS as CopyItem[],
    principles: arrays.about.PRINCIPLES as CopyItem[],
    copy: copy.about,
  },
  settings: {
    name: siteConfig.name,
    fullName: siteConfig.fullName,
    description: siteConfig.description,
    email: siteConfig.email,
    logo: siteLogo,
    socialLinks: siteConfig.socialLinks,
    navigation: navItems,
    seo: defaultSeo,
    copy: copy.settings,
  },
  clusters: { items: clusters },
};
export type SingletonKind = keyof typeof singletonDefaults;
const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export const bootstrapEntries: PublishedEntry[] = [
  ...realOrganizations.map((org) => ({
    entry_id: `organization-${org.id}`,
    kind: "organization" as const,
    slug: org.slug,
    document: { ...org, descriptionHtml: "" },
  })),
  ...mockEvents.map((story) => ({
    entry_id: `story-${story.id}`,
    kind: "story" as const,
    slug: story.slug,
    document: {
      ...story,
      excerpt: story.excerpt ?? "",
      credit: story.credit ?? "",
      organization: story.organization ?? "",
      bodyHtml: (story.body ?? [story.description])
        .map((p) => `<p>${escape(p)}</p>`)
        .join(""),
      socialLinks: story.socialLinks ?? {
        facebook: "",
        instagram: "",
        email: "",
      },
    },
  })),
  ...Object.entries(singletonDefaults).map(([kind, document]) => ({
    entry_id: kind,
    kind: kind as EntryKind,
    slug: kind,
    document: document as unknown as Document,
  })),
];
export const kindLabels: Record<EntryKind, string> = {
  organization: "Organizations",
  story: "Event stories",
  leadership: "Leadership",
  recweek: "Recruitment Week",
  home: "Homepage",
  about: "About",
  settings: "Site settings",
  clusters: "Clusters",
};
export function blankDocument(
  kind: "organization" | "story",
  slug: string,
): Document {
  const id = crypto.randomUUID();
  if (kind === "organization")
    return {
      id,
      name: "New organization",
      slug,
      cluster: {
        id: clusters[0].slug,
        name: clusters[0].name,
        slug: clusters[0].slug,
      },
      description: "",
      descriptionHtml: "",
      logo: "",
      officers: [],
      link: "",
    };
  return {
    id,
    title: "New story",
    slug,
    date: new Date().toISOString().slice(0, 10),
    description: "",
    excerpt: "",
    image: "",
    body: [],
    bodyHtml: "",
    isFeatured: false,
    isFlagship: false,
    organization: "",
    credit: "",
    socialLinks: { facebook: "", instagram: "", email: "" },
  };
}
