"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CascadeReveal from "@/components/cascade-reveal";
import Section from "@/components/ui/section";
import DetailDoodle from "@/components/ui/detail-doodle";
import {
  SHOWCASE_ITEMS,
  SHOWCASE_CTA,
  type ShowcaseItem,
  type ShowcaseImage,
} from "@/components/home/mock-showcase";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
 * Inline SVG icons — thin, subtle strokes (rose gold / soft pink)
 * matching the original poster. No icon library.
 * ──────────────────────────────────────────────────────────── */

const iconBase = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: "false",
  className: "size-5",
} as const;

/** Medallion with a heart — "Hecho con amor". */
function RibbonHeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7.8 8.6c-.9 0-1.7.8-1.7 1.7 0 .8.5 1.6 1.2 2.4.15.18.33.18.5 0 .7-.8 1.2-1.6 1.2-2.4 0-.9-.8-1.7-1.2-1.7z" />
    </svg>
  );
}

/** Symmetric flower — "Materiales de calidad". */
function FlowerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 6.5c1.4 0 2.4-1 2.4-2.2S13.4 2 12 2s-2.4 1.1-2.4 2.3S10.6 6.5 12 6.5z" />
      <path d="M17.9 9.5c-1.3-.6-2.6-.2-3 1 .4.6.2 1.2-.4 1.6-.9-.1-1.6.3-1.9 1.2.7 1.5 2.4 2 3.9 1.3.9-.5 1.5-1.7 1.5-2.7s-.5-1.6-1-2.4z" />
      <path d="M17.9 14.4c1.3.6 2.6.2 3-1-.4-.6-.2-1.2.4-1.6.9.1 1.6-.3 1.9-1.2-.7-1.5-2.4-2-3.9-1.3-.9.5-1.5 1.7-1.4 2.8 0 1 .5 1.7 1 2.3z" />
    </svg>
  );
}

/** Gift box — "Detalles únicos". */
function GiftBoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
      <path d="M12 9v11" />
      <path d="M4 9l1.5-3h13L20 9" />
      <path d="M9 6c0-1.5 1.2-2.5 3-2.5s3 1 3 2.5-1.2 2.5-3 2.5-3-1-3-2.5z" />
    </svg>
  );
}

/** Stylized heart — "Para toda ocasión". */
function HeartOutlineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19.5 11.7c0-2.6-2.2-4.7-4.8-4.7-1.2 0-2.3.5-2.7 1.4-.4-.9-1.5-1.4-2.7-1.4-2.6 0-4.8 2.1-4.8 4.7 0 3.6 4.6 6.8 7 8.4.3.2.7.2 1 0 2.4-1.6 7-4.8 7-8.4z" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
 * ProductCard
 * ──────────────────────────────────────────────────────────── */

/* Responsive sizes for a single product image inside a 4-col grid card. */
const PRODUCT_IMG_SIZES = "150px";

/** Thin leaf sprig — footer decorative accent (bottom-right corner). */
function MiniLeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 20V11" />
      <path d="M12 11c-3 0-5-2-5-5 3 0 5 2 5 5z" />
      <path d="M12 14c2.6 0 4.5-1.8 4.5-4.2C13.6 9.8 12 11.6 12 14z" />
    </svg>
  );
}

/**
 * Image block. One image renders as a single portrait tile; when the item
 * carries more than one image (the limpiapipas collage) it renders as a
 * 2-col mini-collage: first image spans both columns on top, the two others
 * sit side by side below. Only the first visible image in the whole grid may
 * take `priority` (LCP); everything else stays lazy.
 *
 * Fixed aspect ratios (4/5, 4/3, square) guarantee photos keep their
 * proportion regardless of how tall the card grows from the text — no
 * stretching/cropping.
 */
function ProductImages({
  images,
  firstInGrid,
}: {
  images: ShowcaseImage[];
  firstInGrid: boolean;
}) {
  if (images.length <= 1) {
    const img = images[0];
    return (
      <div className="relative w-full overflow-hidden rounded-md bg-pink-50 aspect-[4/5]">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover"
          sizes={PRODUCT_IMG_SIZES}
          loading={firstInGrid ? "eager" : "lazy"}
          priority={firstInGrid}
        />
      </div>
    );
  }

  // Mini-collage (limpiapipas: 3 images) — no odd gaps.
  const [top, mid, bottom] = images;
  return (
    <div className="grid w-full grid-cols-2 gap-1.5">
      <div className="relative col-span-2 overflow-hidden rounded-sm bg-pink-50 aspect-[4/3]">
        <Image
          src={top.src}
          alt={top.alt}
          fill
          className="object-cover"
          sizes={PRODUCT_IMG_SIZES}
          loading={firstInGrid ? "eager" : "lazy"}
          priority={firstInGrid}
        />
      </div>
      <div className="relative overflow-hidden rounded-sm bg-pink-50 aspect-square">
        <Image
          src={mid.src}
          alt={mid.alt}
          fill
          className="object-cover"
          sizes="75px"
        />
      </div>
      <div className="relative overflow-hidden rounded-sm bg-pink-50 aspect-square">
        <Image
          src={bottom.src}
          alt={bottom.alt}
          fill
          className="object-cover"
          sizes="75px"
        />
      </div>
    </div>
  );
}

function ProductCard({
  product,
  firstInGrid,
}: {
  product: ShowcaseItem;
  firstInGrid: boolean;
}) {
  return (
    <article
      data-cascade
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#f3e5e5] bg-white p-4 md:p-5"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Title — full width, centered, on top */}
      <h3 className="mb-4 w-full text-center font-serif text-lg text-[#8b5a5a]">
        {product.title}
      </h3>

      {/* Body — image left, list right */}
      <div className="flex flex-1 flex-row items-start gap-4">
        {/* Image container — fixed width to avoid stretching */}
        <div className="relative flex w-[45%] max-w-[140px] flex-shrink-0 flex-col gap-1.5">
          <ProductImages images={product.images} firstInGrid={firstInGrid} />
        </div>

        {/* Materials list — right side */}
        <ul className="flex flex-1 flex-col gap-1.5 text-[11px] leading-snug text-gray-600 md:text-xs">
          {product.materials.map((material, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-0.5 text-[#dca4a4]">•</span>
              <span className="break-words">{material}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer — full width, pushed to bottom with mt-auto */}
      <div className="relative mt-5 flex w-full flex-col items-center justify-center border-t border-[#fef0f0] pt-3 text-center">
        <span className="px-2 font-serif italic text-[#c86d6d] text-xs md:text-sm">
          {product.phrase}
        </span>
        <MiniLeafIcon className="absolute bottom-0 right-0 h-4 w-4 text-[#dca4a4] opacity-50" />
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
 * CTACard — "Sorprende con amor"
 * ──────────────────────────────────────────────────────────── */

function CTACard() {
  return (
    <article
      data-cascade
      className="relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-lg border border-[#f3e5e5] p-5 md:p-6 transition-colors duration-300"
      style={{
        willChange: "transform, opacity",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 18%, var(--theme-bg)), var(--theme-bg))",
      }}
    >
      {/* Fine rose/leaf doodle — bottom-right, decorative, out of interaction */}
      <DetailDoodle
        variant="flower"
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 size-14 text-[var(--theme-accent)] opacity-30"
      />

      <div className="flex flex-col items-center text-center">
        <h3 className="font-serif italic text-[#c86d6d] text-2xl font-medium leading-snug md:text-3xl">
          {SHOWCASE_CTA.title}
        </h3>
        <p className="mt-3 font-sans text-sm text-[#8b5a5a] leading-relaxed">
          {SHOWCASE_CTA.subtitle}
        </p>
        <p className="mt-2 font-serif italic text-xs text-[#c86d6d] md:text-sm">
          {SHOWCASE_CTA.highlight}
        </p>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
 * BottomFeatureBar — 4 evenly distributed features
 * ──────────────────────────────────────────────────────────── */

const BOTTOM_FEATURES = [
  { id: "amor", label: "Hecho con amor", Icon: RibbonHeartIcon },
  { id: "calidad", label: "Materiales de calidad", Icon: FlowerIcon },
  { id: "unicos", label: "Detalles únicos", Icon: GiftBoxIcon },
  { id: "ocasion", label: "Para toda ocasión", Icon: HeartOutlineIcon },
] as const;

function BottomFeatureBar(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`grid grid-cols-2 gap-4 pt-8 md:grid-cols-4 md:gap-6 ${
        props.className ?? ""
      }`}
    >
      {BOTTOM_FEATURES.map(({ id, label, Icon }) => (
        <div
          key={id}
          className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3"
        >
          <Icon className="size-6 text-[#c86d6d]" aria-hidden="true" />
          <span className="font-serif text-sm text-[#8b5a5a] md:text-base">
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
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
        <header className="mb-10 text-center md:mb-14" data-showcase-title>
          <h2 className="font-serif text-[#8b5a5a] text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Detalles que enamoran
          </h2>
        </header>

        {/* Grid: 1 col mobile / 2 tablet / 4 desktop -> 4x2 = 7 + 1 CTA */}
        <CascadeReveal>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4"
            role="list"
            aria-label="Productos destacados"
          >
            {SHOWCASE_ITEMS.map((product, index) => (
              <div key={product.id} role="listitem">
                <ProductCard
                  product={product}
                  firstInGrid={index === 0}
                />
              </div>
            ))}
            <div role="listitem">
              <CTACard />
            </div>
          </div>
        </CascadeReveal>

        {/* Bottom Feature Bar */}
        <BottomFeatureBar data-feature-bar />
      </Section>
    </div>
  );
}
