import Image from "next/image";
import Link from "next/link";
import { HOURS, ROUTES, SOCIALS } from "@/lib/constants";
import LegalModals from "@/components/legal-modals.client";
import {
  BoxCheckIcon,
  InstagramIcon,
  ShieldIcon,
  SproutIcon,
  TikTokIcon,
} from "@/components/ui/icons";

/**
 * Global footer (ft-R1–R6; design D7). Server component — everything renders
 * in the initial HTML (ft-R2, cc-R1). All contact data comes from
 * `lib/constants.ts` (ft-R6): social handles, hours, WhatsApp number. The
 * Bogotá coverage link is suppressed while `ROUTES.domiciliosBogota` is null
 * (D7) so the site never publishes a dead link (ft-R3).
 */

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
} as const;

/**
 * Trust badges (user direction): the footer column that used to repeat the
 * main nav now reassures with brand/eco signals instead — security seal and
 * sustainable packaging/sourcing. Pure static copy, no links.
 */
const TRUST_BADGES: { label: string; icon: typeof ShieldIcon }[] = [
  { label: "Sitio seguro para tus transacciones", icon: ShieldIcon },
  { label: "Empaques 100% amigables con el planeta", icon: BoxCheckIcon },
  { label: "Materiales de origen responsable", icon: SproutIcon },
];

/** Tiny ghost glyph for the developer credit — floats gently next to the
 *  "by Brik" signature (see `.ghost-float` in globals.css). Decorative. */
function GhostIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 11.5A6 6 0 0 1 18 11.5V20l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2v-8.5Z" />
      <path d="M9.5 10h.01" />
      <path d="M14.5 10h.01" />
    </svg>
  );
}

export default function SiteFooter() {
  const coverageHref = ROUTES.domiciliosBogota;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--theme-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand + business hours (ft-R2) */}
          <div>
            <p className="font-display text-xl text-mar-brown">
              Detalles Maranatha
            </p>
            <p className="mt-3 font-sans text-sm text-mar-brown/70">
              {HOURS.days} · {HOURS.time}
            </p>
          </div>

          {/* Trust signals (user direction) — replaces the repeated main-nav
              mini-sitemap with brand/eco reassurance, ft-R1. */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
              Nuestro compromiso
            </p>
            <p className="mt-4 font-display text-lg leading-snug text-mar-brown">
              Un pequeño detalle con mucho cariño.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {TRUST_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <li
                    key={badge.label}
                    className="flex items-start gap-2.5 font-sans text-sm text-mar-brown/80"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-mar-gold" />
                    <span>{badge.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Social links — new tab, no referrer leak (ft-R1); pushed to the
              right edge on desktop, centered on mobile. */}
          <div className="text-center md:text-right">
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
              Síguenos
            </p>
            <div className="mt-4 flex justify-center gap-3 md:justify-end">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                if (!Icon) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-mar-brown/15 text-mar-brown/70 transition-colors hover:border-mar-brown hover:text-mar-brown"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coming-soon teaser (user direction) — strategic spot above the
            legal line: announces that more modules are coming to the site for
            the Maranatha business, in cursive with little "detalle" motifs. */}
        <div className="mx-auto mt-14 max-w-xl text-center">
          <p className="font-display text-lg text-mar-brown">
            Próximamente: más funcionalidades para Maranatha
          </p>
          <p className="mt-3 flex items-center justify-center gap-2.5 font-script text-xl leading-snug text-mar-brown/80 md:text-2xl">
            <Image
              src="/placeholders/gift.svg"
              alt=""
              width={24}
              height={24}
              loading="lazy"
              aria-hidden
              className="h-5 w-5 shrink-0 object-contain opacity-70"
            />
            <span>
              Nuevos módulos para el sitio web y el negocio están en camino.
              ¡Muy pronto!
            </span>
            <Image
              src="/placeholders/flower.svg"
              alt=""
              width={24}
              height={24}
              loading="lazy"
              aria-hidden
              className="h-5 w-5 shrink-0 object-contain opacity-70"
            />
          </p>
        </div>

        {/* Legal line (ft-R5) + conditional coverage link (ft-R3/D7).
            Centered and stacked on every breakpoint so the footer always
            finishes with an organized, centered block. */}
        <div className="mt-12 flex flex-col items-center gap-3 pt-6">
          <p className="text-center font-sans text-xs text-mar-brown/60">
            © {year} Detalles Maranatha · Todos los derechos reservados
          </p>
          {coverageHref && (
            <Link
              href={coverageHref}
              className="font-sans text-xs text-mar-brown/70 underline underline-offset-4 hover:text-mar-brown"
            >
              Domicilios en Bogotá
            </Link>
          )}

          {/* Pilares legales (Condiciones de Threads / Privacidad / Cookies).
              Los textos abren en un modal con scroll interno; la página queda
              fija detrás (useScrollLock) y se adapta al modo oscuro. */}
          <LegalModals />
        </div>

        {/* Developer credit (user direction) — short, small, centered at the
            very end with a tiny floating ghost; links to the developer
            portfolio in a new tab. */}
        <p className="mt-6 flex items-center justify-center gap-1.5 font-sans text-xs text-mar-brown/60">
          Diseñado y Desarrollado{" "}
          <a
            href="https://brikpaul569-cmd.github.io/BrikOficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-mar-gold underline-offset-4 transition-colors hover:text-mar-brown hover:underline"
          >
            by Brik
          </a>
          <GhostIcon className="ghost-float size-3.5" />
        </p>
      </div>
    </footer>
  );
}
