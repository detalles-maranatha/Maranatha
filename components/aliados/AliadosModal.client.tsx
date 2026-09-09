"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { CloseIcon } from "@/components/ui/icons";
import { CoffeeIcon, OriginIcon, QualityIcon } from "./AliadosIcons";

/** Carrusel: items con src de imágenes y opcional caption. */
type CarouselItem = {
  src: string;
  alt: string;
  caption?: string;
};

const CAROUSEL_ITEMS: CarouselItem[] = [
  { src: "/images/showcase/1.png", alt: "Café especial — origen", caption: "Origen" },
  { src: "/images/showcase/2.png", alt: "Café premium — proceso", caption: "Proceso" },
  { src: "/images/showcase/cofee.png", alt: "Café artesanal — taza", caption: "Artesanal" },
  { src: "/images/showcase/coffee 2.png", alt: "Café tostado — grano", caption: "Tostado" },
];

/**
 * AliadosModal — componente cliente.
 * Contiene el trigger y el modal flotante con carrusel CSS snap,
 * focus trap, cierre por ESC/overlay/X, bloqueo de scroll,
 * animaciones GSAP y respecto a prefers-reduced-motion.
 */
export default function AliadosModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollLockRef = useRef<{ html: string; body: string } | null>(null);
  const reducedMotionRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isOpenState = isOpen;

  const getReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const lockScroll = useCallback(() => {
    const html = document.documentElement;
    const body = document.body;
    scrollLockRef.current = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    const prev = scrollLockRef.current;
    if (!prev) return;
    document.documentElement.style.overflow = prev.html;
    document.body.style.overflow = prev.body;
    scrollLockRef.current = null;
  }, []);

  const openModal = useCallback(() => {
    if (isOpenState) return;
    reducedMotionRef.current = getReducedMotion();
    lockScroll();
    setIsOpen(true);
  }, [isOpenState, getReducedMotion, lockScroll]);

  const closeModal = useCallback(() => {
    if (!isOpenState) return;
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const reduce = reducedMotionRef.current;

    const finish = () => {
      unlockScroll();
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    if (!overlay || !modal) {
      finish();
      return;
    }

    if (reduce) {
      gsap.to([overlay, modal], {
        autoAlpha: 0,
        duration: 0.15,
        ease: "power2.out",
        onComplete: finish,
      });
      return;
    }

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(modal, {
          y: 30,
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power3.inOut",
          onComplete: finish,
        });
      },
    });
  }, [isOpenState, unlockScroll]);

  // Animación de apertura GSAP.
  useEffect(() => {
    if (!isOpenState) return;
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) return;

    const reduce = reducedMotionRef.current;

    // Reset a estado cerrado antes de animar.
    gsap.set([modal, overlay], { clearProps: "all" });
    gsap.set(overlay, { autoAlpha: 0 });

    if (reduce) {
      gsap.to([overlay, modal], {
        autoAlpha: 1,
        duration: 0.15,
        ease: "power2.out",
      });
      closeBtnRef.current?.focus();
      return;
    }

    // Overlay: fade in.
    gsap.to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });

    // Modal: slide up + fade in + scale.
    gsap.fromTo(
      modal,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.05 }
    );

    // Delayed focus after animation begins.
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 200);
    return () => clearTimeout(timer);
  }, [isOpenState]);

  // ESC y focus trap.
  useEffect(() => {
    if (!isOpenState) return;
    const overlay = overlayRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeModal();
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpenState, closeModal]);

  // Cleanup al desmontar.
  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    return () => {
      unlockScroll();
      gsap.killTweensOf([overlay, modal]);
    };
  }, [unlockScroll]);

  // Navegación carrusel.
  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const slide = container.children[index] as HTMLElement;
      if (!slide) return;
      const scrollLeft = slide.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setActiveIndex(index);
    },
    []
  );

  // Scroll snap: detectar slide activo.
  const onScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slides = container.children;
    const scrollLeft = container.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      const dist = Math.abs(scrollLeft - (slide.offsetLeft - container.offsetLeft + slide.offsetWidth / 2));
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setActiveIndex(closest);
  }, []);

  // Indicadores: cantidad dinámica.
  const indicators = [0, 1, 2, 3];

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mar-brown,#2B1710)] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--color-mar-card,#FFFDF9)] transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
        aria-haspopup="dialog"
        aria-expanded={isOpenState}
      >
        <span>Ver aliados</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal overlay */}
      {isOpenState && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="aliados-modal-title"
          aria-describedby="aliados-modal-desc"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          onClick={(e) => {
            if (e.target === overlayRef.current) closeModal();
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--color-mar-brown,#2B1710)]/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <div
            ref={modalRef}
            className="relative z-[1] w-full max-w-4xl origin-top rounded-2xl border border-[var(--color-mar-gold,#D9A94E)]/30 bg-[var(--color-mood-contacto,#F6EFE7)]/95 px-6 py-8 shadow-[0_8px_40px_-16px_rgba(43,23,16,0.3)] backdrop-blur-md md:px-10 md:py-10"
          >
            {/* Close */}
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Cerrar"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-mar-brown,#2B1710)]/10 text-[var(--color-mar-brown,#2B1710)] transition-transform duration-300 hover:bg-[var(--color-mar-brown,#2B1710)]/20 motion-safe:hover:-translate-y-0.5"
            >
              <CloseIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <h3
                id="aliados-modal-title"
                className="font-display text-2xl leading-tight text-[var(--color-mar-brown,#2B1710)] md:text-4xl"
              >
                Nuestras Marcas de Café
              </h3>
              <p
                id="aliados-modal-desc"
                className="mt-3 text-sm text-[var(--color-mar-brown)]/70 md:text-base"
              >
                Construimos cada detalle junto a aliados que comparten
                nuestro cuidado por lo hecho a mano y por el planeta.
              </p>
            </div>

            {/* Carrusel */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                onScroll={onScroll}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {CAROUSEL_ITEMS.map((item, index) => (
                  <div
                    key={item.src}
                    className="min-w-[80vw] snap-start sm:min-w-[60vw] md:min-w-[45vw]"
                  >
                    <div className="overflow-hidden rounded-xl bg-[var(--color-mar-card,#FFFDF9)] shadow-lg transition-transform duration-300">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(min-width:768px) 45vw, 80vw"
                          className="object-cover"
                          loading={index < 2 ? "eager" : "lazy"}
                        />
                      </div>
                      {item.caption && (
                        <div className="px-4 py-3 text-center font-sans text-xs font-semibold uppercase tracking-widest text-[var(--color-mar-brown)]/80">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  aria-label="Anterior"
                  onClick={() =>
                    scrollToIndex(
                      activeIndex > 0 ? activeIndex - 1 : CAROUSEL_ITEMS.length - 1
                    )
                  }
                  className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-mar-brown)]/20 text-[var(--color-mar-brown)] transition-colors hover:border-[var(--color-mar-brown)]/50 hover:bg-[var(--color-mar-brown)]/5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2" role="tablist" aria-label="Slide">
                  {indicators.map((i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => scrollToIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "w-6 bg-[var(--color-mar-gold,#D9A94E)]"
                          : "w-2 bg-[var(--color-mar-brown)]/20"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Siguiente"
                  onClick={() =>
                    scrollToIndex(
                      activeIndex < CAROUSEL_ITEMS.length - 1
                        ? activeIndex + 1
                        : 0
                    )
                  }
                  className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-mar-brown)]/20 text-[var(--color-mar-brown)] transition-colors hover:border-[var(--color-mar-brown)]/50 hover:bg-[var(--color-mar-brown)]/5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Franja de íconos */}
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-mar-gold,#D9A94E)]/15 text-[var(--color-mar-gold,#D9A94E)]">
                  <OriginIcon className="size-6" />
                </div>
                <h4 className="font-display text-sm font-semibold text-[var(--color-mar-brown)] md:text-base">
                  Café de origen
                </h4>
                <p className="text-xs text-[var(--color-mar-brown)]/60">
                  Semillas seleccionadas de fincas responsables.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-mar-gold,#D9A94E)]/15 text-[var(--color-mar-gold,#D9A94E)]">
                  <QualityIcon className="size-6" />
                </div>
                <h4 className="font-display text-sm font-semibold text-[var(--color-mar-brown)] md:text-base">
                  Calidad superior
                </h4>
                <p className="text-xs text-[var(--color-mar-brown)]/60">
                  Procesamiento artesanal con estándares premium.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-mar-gold,#D9A94E)]/15 text-[var(--color-mar-gold,#D9A94E)]">
                  <CoffeeIcon className="size-6" />
                </div>
                <h4 className="font-display text-sm font-semibold text-[var(--color-mar-brown)] md:text-base">
                  Pasión y tradición
                </h4>
                <p className="text-xs text-[var(--color-mar-brown)]/60">
                  Cada taza cuenta una historia de dedicación.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/catalogo"
                onClick={closeModal}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mar-gold,#D9A94E)] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--color-mar-brown,#2B1710)] transition-transform duration-300 hover:bg-[var(--color-mar-gold,#D9A94E)]/90 motion-safe:hover:-translate-y-0.5"
              >
                Conocer el café
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
