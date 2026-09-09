"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { CloseIcon } from "@/components/ui/icons";
import { OriginIcon, QualityIcon, CoffeeIcon } from "./AliadosIcons";

/** Vitrina: las 4 imágenes del café, todas visibles (sin scroll lateral). */
type VitrineItem = {
  src: string;
  alt: string;
  caption: string;
};

const VITRINE_ITEMS: VitrineItem[] = [
  { src: "/images/showcase/1.png", alt: "Café especial — origen", caption: "Origen" },
  { src: "/images/showcase/2.png", alt: "Café premium — proceso", caption: "Proceso" },
  { src: "/images/showcase/cofee.png", alt: "Café artesanal — taza", caption: "Artesanal" },
  { src: "/images/showcase/coffee-2.png", alt: "Café tostado — grano", caption: "Tostado" },
];

const BENEFITS = [
  { title: "Café de origen", text: "Semillas seleccionadas de fincas responsables.", icon: OriginIcon },
  { title: "Calidad superior", text: "Procesamiento artesanal con estándares premium.", icon: QualityIcon },
  { title: "Pasión y tradición", text: "Cada taza cuenta una historia de dedicación.", icon: CoffeeIcon },
] as const;

/**
 * AliadosModal — componente cliente.
 * Trigger + modal-flotante premium estilo vitrina glassmorphism (chocolate/latte).
 * Al abrir, las imágenes "caen" en stagger hasta armar la vitrina (GSAP,
 * solo transform/opacity) con respeto a prefers-reduced-motion.
 * Focus trap, cierre por ESC/overlay/X, bloqueo de scroll y devolución de foco.
 */
export default function AliadosModal() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollLockRef = useRef<{ html: string; body: string } | null>(null);
  const reducedMotionRef = useRef(false);

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
    if (isOpen) return;
    reducedMotionRef.current = getReducedMotion();
    lockScroll();
    setIsOpen(true);
  }, [isOpen, getReducedMotion, lockScroll]);

  const closeModal = useCallback(() => {
    if (!isOpen) return;
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

    gsap.killTweensOf([overlay, modal]);

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
          y: 24,
          opacity: 0,
          scale: 0.97,
          duration: 0.28,
          ease: "power3.inOut",
          onComplete: finish,
        });
      },
    });
  }, [isOpen, unlockScroll]);

  // Animación de apertura: las imágenes caen hasta armar la vitrina.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) return;

    const reduce = reducedMotionRef.current;

    // Estado inicial invisible (pre-paint, sin flash).
    const drops = modal.querySelectorAll<HTMLElement>("[data-drop]");
    const rises = modal.querySelectorAll<HTMLElement>("[data-rise]");
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(drops, { y: -84, opacity: 0, scale: 0.9 });
    gsap.set(rises, { y: 18, opacity: 0 });

    if (reduce) {
      gsap.to([overlay, drops, rises], {
        autoAlpha: 1,
        duration: 0.15,
        ease: "power2.out",
      });
      closeBtnRef.current?.focus();
      return;
    }

    // Overlay: fade in.
    gsap.to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });

    // Vitrina: cada imagen cae desde arriba con back.out (asiento suave).
    gsap.to(drops, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "back.out(1.6)",
      stagger: 0.09,
      delay: 0.05,
    });

    // Íconos + CTA suben al final, "armando" la vitrina.
    gsap.to(rises, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
      delay: 0.55,
    });

    // Enfocar el botón cerrar cuando la caída ya empezó.
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // ESC y focus trap.
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, closeModal]);

  // Cleanup al desmontar.
  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    return () => {
      unlockScroll();
      gsap.killTweensOf([overlay, modal]);
    };
  }, [unlockScroll]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mar-brown,#2B1710)] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--color-mar-card,#FFFDF9)] transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
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

      {/* Modal */}
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="aliados-modal-title"
          aria-describedby="aliados-modal-desc"
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-8"
          onClick={(e) => {
            if (e.target === overlayRef.current) closeModal();
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--color-mar-brown,#2B1710)]/60 backdrop-blur-md"
          />

          {/* Panel vitrina glassmorphism */}
          <div
            ref={modalRef}
            className="relative z-[1] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-[color-mix(in_srgb,var(--mood-aliados-bg,#F6EFE7)_58%,transparent)] shadow-[0_30px_90px_-30px_rgba(43,23,16,0.55)] backdrop-blur-2xl"
            // Scoped glass tokens: la vitrina queda latte, no del tema activo.
            style={
              {
                "--glass-bg":
                  "color-mix(in srgb, var(--mood-aliados-bg,#F6EFE7) 45%, transparent)",
                "--glass-highlight": "color-mix(in srgb, #FFFFFF 14%, transparent)",
              } as CSSProperties
            }
          >
            {/* Resplandor dorado superior (decorativo) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--mood-aliados-gold,#D9B77A)]/25 to-transparent"
            />

            {/* Cerrar */}
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Cerrar"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-[var(--mood-aliados-ink,#2B1710)] backdrop-blur-md transition-transform duration-300 hover:bg-white/35 motion-safe:hover:-translate-y-0.5"
            >
              <CloseIcon className="size-5" />
            </button>

            {/* Header */}
            <div data-rise className="relative px-6 pb-2 pt-12 text-center md:px-10 md:pt-14">
              <h3
                id="aliados-modal-title"
                className="font-display text-2xl leading-tight text-[var(--mood-aliados-ink,#2B1710)] md:text-4xl"
              >
                Nuestras Marcas de Café
              </h3>
              <p
                id="aliados-modal-desc"
                className="mt-3 text-sm text-[var(--mood-aliados-muted,rgba(43,23,16,0.6))] md:text-base"
              >
                Construimos cada detalle junto a aliados que comparten nuestro
                cuidado por lo hecho a mano y por el planeta.
              </p>
            </div>

            {/* Vitrina glass: todas las imágenes visibles, sin scroll lateral */}
            <div className="relative grid grid-cols-2 gap-2.5 px-6 pt-6 sm:gap-3 md:grid-cols-4 md:px-8">
              {VITRINE_ITEMS.map((item) => (
                <figure
                  key={item.src}
                  data-drop
                  className="glass-card overflow-hidden rounded-2xl border border-white/45 shadow-[0_12px_30px_-14px_rgba(43,23,16,0.4)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width:768px) 22vw, 44vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="border-t border-white/40 bg-white/15 py-2 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--mood-aliados-ink,#2B1710)]/80 backdrop-blur-sm">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Franja de beneficios */}
            <div className="relative grid gap-4 px-6 pb-2 pt-8 sm:grid-cols-3 md:px-8">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.title}
                  data-rise
                  className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/40 bg-white/15 px-3 py-5 text-center backdrop-blur-md"
                >
                  <span className="inline-flex size-13 items-center justify-center rounded-full border border-white/50 bg-[var(--mood-aliados-gold,#D9B77A)]/20 text-[var(--mood-aliados-gold,#D9B77A)]">
                    <benefit.icon className="size-6" />
                  </span>
                  <h4 className="font-display text-sm font-semibold text-[var(--mood-aliados-ink,#2B1710)] md:text-base">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-[var(--mood-aliados-muted,rgba(43,23,16,0.6))]">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div data-rise className="relative px-6 pb-8 pt-5 text-center md:pb-9">
              <Link
                href="/catalogo"
                onClick={closeModal}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-[var(--color-mar-gold,#D9A94E)]/90 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--color-mar-brown,#2B1710)] shadow-[0_10px_24px_-12px_rgba(217,169,78,0.7)] backdrop-blur-sm transition-transform duration-300 hover:bg-[var(--color-mar-gold,#D9A94E)] motion-safe:hover:-translate-y-0.5"
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