"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CascadeReveal from "@/components/cascade-reveal";
import Section from "@/components/ui/section";
import {
  SHOWCASE_PRODUCTS,
  SHOWCASE_CTA,
  type ShowcaseProduct,
  type ShowcaseCTA,
} from "@/components/home/mock-showcase";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
 * Inline SVG Icons — following the project pattern (stroke, currentColor)
 * These are specific to the FeaturedShowcase showcase.
 * ──────────────────────────────────────────────────────────── */

const iconBase = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: "false",
  className: "size-5",
} as const;

function RibbonHeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4.5c-2.5 0-4.5 2-4.5 4.5 0 2.2 1.3 4.1 3.2 6.3.4.5.9.7 1.3.7s.9-.2 1.3-.7c1.9-2.2 3.2-4.1 3.2-6.3C16.5 6.5 14.5 4.5 12 4.5z" />
      <path d="M12 9v5l2 2" strokeWidth={1.8} />
    </svg>
  );
}

function FlowerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
    </svg>
  );
}

function GiftBoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8l6-4 6 4v10l-6 4-6-4V8z" />
      <path d="M10 4v14M4 12h16" />
    </svg>
  );
}

function HeartOutlineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19.5 12.5c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5c0 1.8.8 3.4 2.1 4.5 1.1 1 2.4 1.6 3.4 1.6s2.3-.6 3.4-1.6c1.3-1.1 2.1-2.7 2.1-4.5z" />
    </svg>
  );
}

function MiniHeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="currentColor" stroke="none" viewBox="0 0 20 20" {...props}>
      <path d="M10 15.5c-1.8 0-3.5-1.3-3.5-3S8.2 9.5 10 9.5s3.5 1.3 3.5 3-1.7 3-3.5 3z" />
    </svg>
  );
}

function MiniLeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="currentColor" stroke="none" viewBox="0 0 20 20" {...props}>
      <path d="M10 2c-4 0-6 3.5-6 6.5 0 1.8.7 3.5 2 4.8 1.3 1.3 3 2.1 4.8 2.1 1.8 0 3.5-.7 4.8-2.1 1.3-1.3 2-3 2-4.8C16 5.5 14 2 10 2z" />
    </svg>
  );
}

function MiniFlowerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="currentColor" stroke="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="3" />
      <circle cx="10" cy="4" r="2" />
      <circle cx="16" cy="10" r="2" />
      <circle cx="10" cy="16" r="2" />
      <circle cx="4" cy="10" r="2" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Helper: pick the right mini decoration icon
 * ──────────────────────────────────────────────────────────── */

function DecorationIcon({
  type,
  className,
}: {
  type: "heart" | "leaf" | "flower";
  className?: string;
}) {
  switch (type) {
    case "heart":
      return <MiniHeartIcon className={className ?? "size-4 text-[#d67a7a]"} />;
    case "leaf":
      return <MiniLeafIcon className={className ?? "size-4 text-[#8b5a5a]"} />;
    case "flower":
      return <MiniFlowerIcon className={className ?? "size-4 text-[#d67a7a]"} />;
  }
}

/* ──────────────────────────────────────────────────────────────
 * ProductCard — individual product showcase card
 * ──────────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <article
      data-cascade
      className="relative flex flex-col h-full bg-white/60 backdrop-blur-sm rounded-2xl border border-[#f3e5e5] p-5 md:p-6 transition-all duration-300 hover:border-[#d67a7a]/50 hover:shadow-lg hover:shadow-[#d67a7a]/10"
      style={{ willChange: "transform, opacity, box-shadow" }}
    >
      {/* Title — top centered, serif */}
      <header className="mb-4 text-center">
        <h3 className="font-serif text-[#8b5a5a] text-lg md:text-xl font-medium leading-snug">
          {product.title}
        </h3>
      </header>

      {/* Middle section: image placeholder left, materials right */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 flex-1 items-start">
        {/* Image placeholder — left */}
        <div
          className="relative w-full md:w-36 md:flex-shrink-0 aspect-square rounded-xl bg-[#fdf2f5]/60 border border-[#f3e5e5] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span className="font-serif text-[#d67a7a]/60 text-sm text-center px-2">
            Imagen producto
          </span>
        </div>

        {/* Materials list — right */}
        <ul className="flex-1 flex flex-col justify-center gap-2 text-left">
          {product.materials.map((material, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 font-sans text-sm md:text-base text-[#5a4a4a] leading-relaxed"
            >
              {/* Styled bullet point */}
              <span
                className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-[#d67a7a]/70"
                aria-hidden="true"
              />
              <span>{material}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer: thin separator, romantic phrase, mini icon in corner */}
      <footer className="relative pt-3 border-t border-[#f3e5e5]/60">
        <p className="font-serif italic text-[#d67a7a] text-sm md:text-base text-center leading-relaxed pr-8">
          {product.phrase}
        </p>
        <DecorationIcon type={product.decorationIcon} className="absolute bottom-3 right-3 opacity-70" />
      </footer>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
 * CTACard — special "Sorprende con amor" card (last cell)
 * ──────────────────────────────────────────────────────────── */

function CTACard({ cta }: { cta: ShowcaseCTA }) {
  return (
    <article
      data-cascade
      className="relative flex flex-col h-full bg-gradient-to-br from-[#fdf2f5] to-[#fce8ec] rounded-2xl border border-[#f3e5e5] p-5 md:p-6 transition-all duration-300"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Title — large cursive/italic serif */}
      <header className="mb-4 text-center">
        <h3 className="font-serif italic text-[#d67a7a] text-xl md:text-2xl font-medium leading-snug">
          {cta.title}
        </h3>
      </header>

      {/* Description */}
      <div className="flex-1 flex flex-col justify-center mb-4">
        <p className="font-sans text-sm md:text-base text-[#5a4a4a] text-center leading-relaxed mb-4">
          {cta.description}
        </p>

        {/* Heart separator */}
        <div className="flex items-center justify-center gap-1 text-[#d67a7a]/60 font-serif text-lg tracking-wider">
          {cta.hearts.split(" ").map((h, i) => (
            <span key={i} aria-hidden="true">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Image placeholder at bottom */}
      <div
        className="relative w-full aspect-[4/3] rounded-xl bg-[#fdf2f5]/80 border border-[#f3e5e5] flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-serif text-[#d67a7a]/50 text-sm text-center px-2">
          {cta.imageAlt}
        </span>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
 * BottomFeatureBar — 4 evenly distributed feature items
 * ──────────────────────────────────────────────────────────── */

const BOTTOM_FEATURES = [
  { id: "amor", label: "Hecho con amor", Icon: RibbonHeartIcon },
  { id: "calidad", label: "Materiales de calidad", Icon: FlowerIcon },
  { id: "unicos", label: "Detalles únicos", Icon: GiftBoxIcon },
  { id: "ocasion", label: "Para toda ocasión", Icon: HeartOutlineIcon },
] as const;

function BottomFeatureBar({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#f3e5e5]/60 ${
        props.className ?? ""
      }`}
      role="list"
      aria-label="Características de nuestros detalles"
    >
      {BOTTOM_FEATURES.map(({ id, label, Icon }) => (
        <div
          key={id}
          role="listitem"
          className="flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-[#f3e5e5]/50 transition-all duration-300 hover:border-[#d67a7a]/30 hover:bg-white/60"
        >
          <Icon className="text-[#d67a7a] size-6 md:size-7" aria-hidden="true" />
          <span className="font-serif text-[#8b5a5a] text-sm md:text-base leading-snug">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * FeaturedShowcase — main exported component
 * ──────────────────────────────────────────────────────────── */

export default function FeaturedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger entrance animation for the section title
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced-motion: skip animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animate the section title
      gsap.fromTo(
        section.querySelector("[data-showcase-title]"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Animate the bottom feature bar
      gsap.fromTo(
        section.querySelector("[data-feature-bar]"),
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: section,
            start: "bottom 90%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <Section
        mood="nosotros"
        id="detalles-destacados"
        sheet={false}
        className="bg-[var(--mood-nosotros)]"
        innerClassName="relative"
      >
        {/* Section Title */}
        <header className="mb-10 md:mb-14 text-center" data-showcase-title>
          <h2 className="font-serif text-[#8b5a5a] text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
            Detalles que enamoran
          </h2>
        </header>

        {/* Grid: 4x2 on desktop (8 cells = 7 products + 1 CTA) */}
        <CascadeReveal>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            role="list"
            aria-label="Productos destacados"
          >
            {SHOWCASE_PRODUCTS.map((product) => (
              <div key={product.id} role="listitem" className="min-h-[420px] md:min-h-[460px]">
                <ProductCard product={product} />
              </div>
            ))}
            <div role="listitem" className="min-h-[420px] md:min-h-[460px]">
              <CTACard cta={SHOWCASE_CTA} />
            </div>
          </div>
        </CascadeReveal>

        {/* Bottom Feature Bar */}
        <BottomFeatureBar data-feature-bar />
      </Section>
    </div>
  );
}