"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CascadeReveal from "@/components/cascade-reveal";
import Section from "@/components/ui/section";
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

/** Search-magnifier icon — floating hint shown on image hover. */
function MagnifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/* Responsive sizes for a single product image inside a 4-col grid card. */
const PRODUCT_IMG_SIZES = "160px";

/**
 * Single-image tile: fixed aspect-[3/4], group hover zoom + floating
 * magnifier, clickable to open the lightbox.
 */
function SingleImage({
  img,
  firstInGrid,
  onOpen,
}: {
  img: ShowcaseImage;
  firstInGrid: boolean;
  onOpen: (img: ShowcaseImage) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(img)}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-pink-50 text-left aspect-[3/4] shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a94e]/60"
      aria-label={`Ampliar imagen: ${img.alt}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={PRODUCT_IMG_SIZES}
        loading={firstInGrid ? "eager" : "lazy"}
        priority={firstInGrid}
      />
      {/* Floating magnifier — center, appears on hover */}
      <span className="pointer-events-none absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/50 p-1.5 text-[#8b5a5a] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <MagnifyIcon className="h-full w-full" />
      </span>
    </button>
  );
}

/**
 * Image block. One image renders as a single portrait tile; when the item
 * carries more than one image (the limpiapipas collage) it renders as a
 * 2-col mini-collage: first image spans both columns on top, the two others
 * sit side by side below. Only the first visible image in the whole grid may
 * take `priority` (LCP); everything else stays lazy. Every tile is clickable
 * and opens the lightbox.
 *
 * Fixed aspect ratios (3/4, 4/3, square) guarantee photos keep their
 * proportion regardless of how tall the card grows from the text — no
 * stretching/cropping.
 */
function ProductImages({
  images,
  firstInGrid,
  onOpen,
}: {
  images: ShowcaseImage[];
  firstInGrid: boolean;
  onOpen: (img: ShowcaseImage) => void;
}) {
  if (images.length <= 1) {
    return <SingleImage img={images[0]} firstInGrid={firstInGrid} onOpen={onOpen} />;
  }

  // Mini-collage (limpiapipas: 3 images) — no odd gaps.
  const [top, mid, bottom] = images;
  return (
    <div className="grid w-full grid-cols-2 gap-1.5">
      <button
        type="button"
        onClick={() => onOpen(top)}
        className="group relative col-span-2 block w-full cursor-pointer overflow-hidden rounded-sm bg-pink-50 text-left aspect-[4/3] shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a94e]/60"
        aria-label={`Ampliar imagen: ${top.alt}`}
      >
        <Image
          src={top.src}
          alt={top.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={PRODUCT_IMG_SIZES}
          loading={firstInGrid ? "eager" : "lazy"}
          priority={firstInGrid}
        />
        <span className="pointer-events-none absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/50 p-1.5 text-[#8b5a5a] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <MagnifyIcon className="h-full w-full" />
        </span>
      </button>
      {[mid, bottom].map((img) => (
        <button
          key={img.src}
          type="button"
          onClick={() => onOpen(img)}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-sm bg-pink-50 text-left aspect-square shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a94e]/60"
          aria-label={`Ampliar imagen: ${img.alt}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="80px"
          />
          <span className="pointer-events-none absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/50 p-1.5 text-[#8b5a5a] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <MagnifyIcon className="h-full w-full" />
          </span>
        </button>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  firstInGrid,
  onOpen,
}: {
  product: ShowcaseItem;
  firstInGrid: boolean;
  onOpen: (img: ShowcaseImage) => void;
}) {
  return (
    <article
      data-cascade
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#f3e5e5] bg-white p-3 sm:p-3.5 md:p-4"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Title — full width, centered, on top */}
      <h3 className="mb-4 w-full text-center font-serif text-lg text-[#8b5a5a]">
        {product.title}
      </h3>

      {/* Body — image left, list right */}
      <div className="flex flex-1 flex-row items-start gap-4">
        {/* Image container — ~38% / capped width, frees space for the text */}
        <div className="flex w-[38%] max-w-[110px] flex-shrink-0 flex-col gap-1.5">
          <ProductImages
            images={product.images}
            firstInGrid={firstInGrid}
            onOpen={onOpen}
          />
        </div>

        {/* Materials list — right side, min-w-0 so it can shrink & wrap */}
        <ul className="flex min-w-0 flex-1 flex-col gap-2 py-1 text-[10.5px] leading-[1.25] tracking-tight text-gray-700 sm:text-[11px]">
          {product.materials.map((material, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="select-none font-bold text-[#dca4a4]">•</span>
              <span className="break-normal">{material}</span>
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
 * Lightbox — full-screen preview modal
 * ──────────────────────────────────────────────────────────── */

function Lightbox({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  // Close with the Escape key.
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa de imagen"
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
      >
        ✕
      </button>
      <div
        className="relative max-w-3xl cursor-zoom-out"
        onClick={onClose}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={1200}
          className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
        />
      </div>
    </div>
  );
}

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

/* ──────────────────────────────────────────────────────────────
 * CTACard — "Sorprende con amor"
 * ──────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
 * CTACard — "Sorprende con amor"
 * ──────────────────────────────────────────────────────────── */

/** Small filled heart — used in the divider. */
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.1 5 6.3 5c2 0 3.6 1.2 4.7 2.9h2C14.1 6.2 15.7 5 17.7 5c3.2 0 5.3 3 3.8 6.8C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

/**
 * Decorative roses arrangement — drawn as vector (no photo available for the
 * CTA). Sits absolutely in the bottom-right corner and reads as a floral
 * bouquet emerging from the corner without covering the text. Pure decoration
 * (aria-hidden, pointer-events-none), inherits currentColor for the petals
 * and a soft green for the leaves.
 */
function RosesArrangement(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      pointerEvents="none"
      className="w-full h-full"
      {...props}
    >
      {/* Leaves */}
      <g stroke="#a8c3a0" strokeWidth={2} strokeLinecap="round">
        <path d="M150 190 C120 160 70 150 40 130" />
        <path d="M148 168 C120 158 88 132 68 112" />
        <path d="M122 150 C100 146 66 120 52 96" />
      </g>
      {/* Rose 1 (top-left of arrangement) */}
      <g>
        <circle cx="92" cy="88" r="24" fill="#d67a7a" />
        <path
          d="M92 74 c9 0 16 7 16 15 c0 9-7 15-16 15 c-9 0-16-6-16-15 c0-8 7-15 16-15z"
          fill="#c86d6d"
        />
        <path d="M88 66 c-2-6 0-10 4-10 c3 0 5 5 4 10z" fill="#a8c3a0" />
      </g>
      {/* Rose 2 (lower, slightly overlapping) */}
      <g>
        <circle cx="120" cy="118" r="20" fill="#e08282" />
        <path
          d="M120 106 c8 0 14 5 14 12 c0 8-6 12-14 12 c-8 0-14-4-14-12 c0-7 6-12 14-12z"
          fill="#d67a7a"
        />
        <path d="M108 138 c-3-4-2-8 1-8 c3 0 4 4 1 8z" fill="#a8c3a0" />
      </g>
      {/* Rosebud / small accent flower */}
      <g>
        <circle cx="70" cy="130" r="14" fill="#eebdbd" />
        <path d="M70 118 c6 0 10 4 10 12 c0 6-4 10-10 10 s-10-4-10-10 c0-8 4-12 10-12z" fill="#d99aa4" />
      </g>
      <path d="M156 186 c-4-7-2-13 2-13 c4 0 6 6 2 13z" fill="#a8c3a0" />
      {/* Stems */}
      <g stroke="#8fae88" strokeWidth={2.5} strokeLinecap="round">
        <path d="M150 196 C140 150 120 108 100 92" />
        <path d="M155 196 C152 160 134 132 124 120" />
        <path d="M80 200 C84 168 76 148 70 142" />
      </g>
    </svg>
  );
}

function CTACard() {
  return (
    <article
      data-cascade
      className="relative flex h-full flex-col overflow-hidden bg-[#fdf6f6] p-5 md:p-6"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Decorative roses — bottom-right, out of interaction & text flow */}
      <div className="pointer-events-none absolute -bottom-4 -right-4 z-0 h-[70%] w-[55%] overflow-hidden rounded-tl-3xl opacity-90 md:w-[60%]">
        <RosesArrangement className="h-full w-full" />
      </div>

      {/* Text content — loaded toward left/top, above the roses */}
      <div className="relative z-10 flex w-full max-w-[65%] flex-col sm:max-w-[70%]">
        <h3 className="mb-3 font-serif italic text-2xl leading-snug text-[#d67a7a]">
          {SHOWCASE_CTA.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          {SHOWCASE_CTA.subtitle}
        </p>

        {/* Divider with a heart in the middle */}
        <div className="mb-4 flex items-center gap-2 text-[#eebdbd]">
          <hr className="flex-1 border-[#eebdbd]" />
          <HeartIcon className="h-4 w-4 fill-current" />
          <hr className="flex-1 border-[#eebdbd]" />
        </div>

        <p className="font-serif italic text-lg leading-snug text-[#c86d6d]">
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

  // Lightbox state — currently active image (or null when closed).
  const [activeImage, setActiveImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const openLightbox = (img: ShowcaseImage) =>
    setActiveImage({ src: img.src, alt: img.alt });

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
        <header
          className="py-10 text-center md:py-12"
          data-showcase-title
        >
          {/* Title flanked by soft paste hearts */}
          <div className="inline-flex items-center gap-3">
            <HeartIcon className="h-5 w-5 text-[#dca4a4]" aria-hidden="true" />
            <h2 className="font-serif text-[#8b5a5a] text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Detalles que enamoran
            </h2>
            <HeartIcon className="h-5 w-5 text-[#dca4a4]" aria-hidden="true" />
          </div>

          {/* Subtitle */}
          <p className="mt-2 mb-8 text-center font-sans text-sm font-normal tracking-wide text-[#8b5a5a]/80 md:mb-10 md:text-base">
            Regalos únicos para cada ocasión
          </p>
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
                  onOpen={openLightbox}
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

      {/* Lightbox — rendered outside the cards */}
      <Lightbox image={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  );
}
