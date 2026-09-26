import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useCmsCopy } from "../../lib/cms/public";
import { Link } from "react-router-dom";
import { Mail, ExternalLink } from "lucide-react";
import { EmbroideredAccent } from "../EmbroideredAccent";
import { ThreadDivider } from "../ThreadDivider";

export function Footer() {
  const siteConfig = useSiteSettings();
  const navItems = siteConfig.navigation;
  const siteLogo = siteConfig.logo;
  const copy = useCmsCopy("settings", "Footer");
  const year = new Date().getFullYear();
  const { facebook, instagram } = siteConfig.socialLinks;

  return (
    <footer className="relative border-t border-dashed border-stitch-gray/40 bg-linen-white">
      <ThreadDivider
        flowerColor="blue"
        className="absolute left-1/2 top-0 w-48 -translate-x-1/2 -translate-y-1/2 bg-linen-white px-4"
      />
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 font-display text-lg font-black text-trust-blue">
            <img src={siteLogo} alt="" className="h-8 w-8" />
            {siteConfig.name}
          </span>
          <EmbroideredAccent color="blue" index={0} size={40} />
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">
            {copy.text1}
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="font-body text-fabric-dark transition-colors hover:text-thread-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">
            {copy.text2}
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red"
              >
                <Mail size={18} strokeWidth={1.75} />
                {copy.text3}
              </a>
            </li>
            {facebook && (
              <li>
                <a
                  href={facebook}
                  className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red"
                >
                  <ExternalLink size={18} strokeWidth={1.75} />
                  {copy.text4}
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <a
                  href={instagram}
                  className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red"
                >
                  <ExternalLink size={18} strokeWidth={1.75} />
                  {copy.text5}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-dashed border-stitch-gray/40">
        <p className="mx-auto max-w-[1200px] px-6 py-6 text-center font-body text-sm text-stitch-gray">
          {`© ${year} ${siteConfig.fullName}. All Rights Reserved.`}
        </p>
      </div>
    </footer>
  );
}
