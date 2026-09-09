import type { CSSProperties, ReactNode } from "react";

/**
 * Section shell (ds-R3). Applies a mood via `--section-mood` on the section
 * container; children consume it as `bg-[var(--section-mood)]` (hero-R5).
 * Default padding + max-width follow the ~60% negative-space rule.
 *
 * The taller ecosystem extends the mood set with the workshop moods
 * (eco-E5). `sheet={false}` renders a full-bleed band instead of the frosted
 * parchment leaf — the taller world is borderless and frame-less, so its
 * sections float directly on the pastel background.
 */

export type SectionMood =
  | "hero"
  | "nosotros"
  | "catalogo-sage"
  | "catalogo-gold"
  | "galeria"
  | "contacto"
  | "taller-hero"
  | "taller-talleres"
  | "taller-aprende";

export type SectionProps = {
  children: ReactNode;
  mood?: SectionMood;
  id?: string;
  className?: string;
  innerClassName?: string;
  /** Render a full-bleed band instead of the frosted parchment sheet. */
  sheet?: boolean;
};

const MOOD_VARS: Record<SectionMood, string> = {
  hero: "var(--mood-hero)",
  nosotros: "var(--mood-nosotros)",
  "catalogo-sage": "var(--mood-catalogo-sage)",
  "catalogo-gold": "var(--mood-catalogo-gold)",
  galeria: "var(--mood-galeria)",
  contacto: "var(--mood-contacto)",
  "taller-hero": "var(--mood-taller-hero)",
  "taller-talleres": "var(--mood-taller-talleres)",
  "taller-aprende": "var(--mood-taller-aprende)",
};

export default function Section({
  children,
  mood,
  id,
  className = "",
  innerClassName = "",
  sheet = true,
}: SectionProps) {
  const style = mood
    ? ({ "--section-mood": MOOD_VARS[mood] } as CSSProperties)
    : undefined;

  /**
   * Parchment sheet (user direction): every non-hero section renders as a
   * separate frosted-paper leaf (see `.sheet-parchment` in globals.css).
   * Skipped on the hero moods so the full-bleed background keeps the raw mood;
   * skipped too when `sheet={false}` (taller bands). Sheets carry their own
   * vertical rhythm so each reads as a divided page, like the COSECHAS
   * reference.
   */
  const isHeroMood = mood === "hero" || mood === "taller-hero";
  // La hoja DEBE flotar con respiro lateral: con `w-full max-w-6xl` toca los
  // bordes del viewport en <=~1330px y las muescas se leen como "marco".
  // Ancho min(72rem, 100% - respiro) + mx-auto: centrada y SIN overflow en
  // cualquier viewport (w-full + márgenes fijos desbordaría por la derecha).
  const sheetClass =
    !isHeroMood && sheet
      ? "sheet-parchment mx-auto my-4 w-[min(72rem,calc(100%-2rem))] sm:w-[min(72rem,calc(100%-3rem))] md:my-8"
      : "";

  return (
    <section id={id} style={style} className={className}>
      <div
        className={`${sheetClass ? sheetClass + " " : "mx-auto w-full max-w-6xl "}px-6 py-16 md:px-10 md:py-20 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
