import type { Leader } from "../../lib/cms/domain";
import { threadHex, type ThreadColor } from "../../lib/assets";
import { EmbroideredAccent } from "../EmbroideredAccent";
import { InitialsAvatar } from "./InitialsAvatar";
import { CmsRichText } from "../../lib/cms/public";

interface OfficerCardProps {
  leader: Leader;
  color?: ThreadColor;
}

export function OfficerCard({ leader, color = "blue" }: OfficerCardProps) {
  return (
    <div
      className="group relative flex flex-col items-center gap-3 rounded-2xl border-t-[3px] bg-linen-white px-5 py-6 text-center shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,74,143,0.14)]"
      style={{ borderTopColor: threadHex[color] }}
    >
      <EmbroideredAccent
        color={color}
        index={0}
        size={20}
        opacity={70}
        className="pointer-events-none absolute right-2 top-2"
      />
      {leader.image ? (
        <img
          src={leader.image}
          alt={leader.imageAlt || leader.name}
          className="h-16 w-16 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <InitialsAvatar name={leader.name} color={color} />
      )}
      <div>
        <p className="font-display text-base font-bold text-trust-blue">
          {leader.name}
        </p>
        <p className="mt-1 font-body text-sm text-stitch-gray">{leader.role}</p>
        {leader.team && (
          <p className="mt-1 font-body text-[11px] font-medium uppercase tracking-wide text-stitch-gray/70">
            {leader.team}
          </p>
        )}
      </div>
      {leader.bio && (
        <CmsRichText
          value={leader.bio}
          className="font-body text-sm leading-relaxed text-fabric-dark"
        />
      )}
    </div>
  );
}
