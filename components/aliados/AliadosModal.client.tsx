"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { CloseIcon } from "@/components/ui/icons";
import { OriginIcon, QualityIcon, CoffeeIcon } from "./AliadosIcons";
import { useScrollLock } from "@/hooks/use-scroll-lock";

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
  const [selected, setSelected] = useState<number | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  // El fallback visual se resetea en cada handler que cambia de imagen o
  // reabre el modal (openModal / openLarge / prev / next) — sin effects.
  useScrollLock(isOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastCardRef = useRef<number>(0);
  const largeCloseRef = useRef<HTMLButtonElement>(null);
  const largeImageWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);
  // Guard para no robar el foco en la apertura inicial de la vitrina.
  const largeWasOpenRef = useRef(false);

  const getReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const openModal = useCallback(() => {
    if (isOpen) return;
    reducedMotionRef.current = getReducedMotion();
    setImgFailed(false);
    setIsOpen(true);
  }, [isOpen, getReducedMotion]);

  const closeModal = useCallback(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const reduce = reducedMotionRef.current;

    const finish = () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      setSelected(null);
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    // Seguro de cierre: si el compositor/headless retrasa los tweens de GSAP,
    // forzamos finish() igualmente (el flujo normal lo limpia antes).
    let fallbackTimer: number | undefined;
    if (overlay && modal) {
      fallbackTimer = window.setTimeout(finish, 900);
    }

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
  }, [isOpen]);

  // Vista grande: abrir una imagen de la vitrina.
  const openLarge = useCallback((index: number) => {
    lastCardRef.current = index;
    setImgFailed(false);
    setSelected(index);
  }, []);

  // Volver de la vista grande a la vitrina y devolver foco a la tarjeta.
  const exitLarge = useCallback(() => {
    setSelected(null);
  }, []);

  const goPrevLarge = useCallback(() => {
    setImgFailed(false);
    setSelected((s) =>
      s === null ? s : (s - 1 + VITRINE_ITEMS.length) % VITRINE_ITEMS.length
    );
  }, []);

  const goNextLarge = useCallback(() => {
    setImgFailed(false);
    setSelected((s) => (s === null ? s : (s + 1) % VITRINE_ITEMS.length));
  }, []);

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

  // Vista grande: fade + scale suave al abrir/cambiar de imagen.
  useLayoutEffect(() => {
    if (selected === null) return;
    const wrap = largeImageWrapRef.current;
    if (!wrap) return;
    const reduce = reducedMotionRef.current;
    gsap.killTweensOf(wrap);
    gsap.fromTo(
      wrap,
      { opacity: 0, scale: 0.97 },
      reduce
        ? { opacity: 1, duration: 0.1, ease: "power2.out" }
        : { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
    const timer = setTimeout(
      () => largeCloseRef.current?.focus(),
      reduce ? 60 : 220
    );
    return () => clearTimeout(timer);
  }, [selected]);

  // Devolver foco a la tarjeta clickeada al volver de la vista grande.
  // useLayoutEffect: corre justo después del commit del DOM (selected null),
  // sin la carrera del requestAnimationFrame con el render de React.
  useLayoutEffect(() => {
    if (selected !== null) {
      largeWasOpenRef.current = true;
      return;
    }
    if (!largeWasOpenRef.current) return;
    largeWasOpenRef.current = false;
    overlayRef.current
      ?.querySelector<HTMLElement>(`[data-large-index="${lastCardRef.current}"]`)
      ?.focus();
  }, [selected]);

  // ESC y focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (selected !== null) {
          exitLarge();
          return;
        }
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
  }, [isOpen, selected, closeModal, exitLarge]);

  // Cleanup al desmontar.
  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    return () => {
      gsap.killTweensOf([overlay, modal]);
    };
  }, []);

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

      {/* Modal — Portal a document.body: escapa del ancestro con transform
          (ParallaxFloat) que convertiría el overlay `fixed` en relativo al
          wrapper del CTA y dejaría "pedazos" de la página visibles abajo. */}
      {isOpen &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={selected === null ? undefined : "Imagen ampliada"}
            aria-labelledby={selected === null ? "aliados-modal-title" : undefined}
            aria-describedby={selected === null ? "aliados-modal-desc" : undefined}
            // Lenis (detenido por el scroll-lock) hace preventDefault en todo
            // wheel/touch; data-lenis-prevent lo hace salir antes sin bloquear.
            data-lenis-prevent
            className="fixed inset-0 z-[9999] flex overflow-y-auto overscroll-contain touch-pan-y p-3 sm:p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => {
              const t = e.target as HTMLElement;
              if (t === overlayRef.current || t === backdropRef.current) closeModal();
            }}
          >
          {/* Backdrop fijo al viewport: no scrollea junto al overlay */}
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="fixed inset-0 bg-[var(--color-mar-brown,#2B1710)]/60 backdrop-blur-md"
          />

          {/* Panel vitrina glassmorphism: h-auto muestra TODO el contenido; si no
              cabe en pantallas pequeñas, el OVERLAY scrollea (scrollbar oculto). */}
          <div
            ref={modalRef}
            className="relative z-[1] m-auto flex w-full max-w-[980px] flex-col overflow-hidden rounded-3xl border border-white/50 bg-[color-mix(in_srgb,var(--mood-aliados-bg,#F6EFE7)_58%,transparent)] shadow-[0_30px_90px_-30px_rgba(43,23,16,0.55)] backdrop-blur-2xl"
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

            {/* Cerrar (solo en la vitrina; la vista grande tiene su propia X) */}
            {selected === null && (
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Cerrar"
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-[var(--mood-aliados-ink,#2B1710)] backdrop-blur-md transition-transform duration-300 hover:bg-white/35 motion-safe:hover:-translate-y-0.5"
              >
                <CloseIcon className="size-5" />
              </button>
            )}

            {/* Vitrina + beneficios + CTA en flujo: la card crece (h-auto) y el
                OVERLAY scrollea con scrollbar oculto si el contenido no cabe. */}
            {selected === null && (
              <div>
                {/* Header */}
                {selected === null && (
                  <div data-rise className="relative px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-12">
                <h3
                  id="aliados-modal-title"
                  className="font-display text-2xl leading-tight text-[var(--mood-aliados-ink,#2B1710)] sm:text-4xl"
                >
                  Nuestras Marcas de Café
                </h3>
                <p
                  id="aliados-modal-desc"
                  className="mt-2 text-sm leading-relaxed text-[var(--mood-aliados-muted,rgba(43,23,16,0.6))] sm:text-base"
                >
                  Construimos cada detalle junto a aliados que comparten nuestro
                  cuidado por lo hecho a mano y por el planeta.
                </p>
              </div>
            )}

            {/* Vitrina glass: todas las imágenes visibles, sin scroll lateral */}
            {selected === null && (
              <div className="relative grid grid-cols-2 gap-2 px-4 pt-4 sm:gap-2.5 sm:px-6 md:grid-cols-4">
                {VITRINE_ITEMS.map((item, index) => (
                  <figure
                    key={item.src}
                    data-drop
                    className="glass-card overflow-hidden rounded-2xl border border-white/45 shadow-[0_12px_30px_-14px_rgba(43,23,16,0.4)]"
                  >
                    <button
                      type="button"
                      data-large-index={index}
                      onClick={() => openLarge(index)}
                      aria-label={`Ampliar imagen: ${item.alt}`}
                      className="group block w-full cursor-pointer text-left"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(min-width:768px) 22vw, 44vw"
                          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Hint de ampliación */}
                        <span
                          aria-hidden="true"
                          className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-black/25 text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
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
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
                          </svg>
                        </span>
                      </div>
                    </button>
                    <figcaption className="border-t border-white/40 bg-white/15 py-2 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--mood-aliados-ink,#2B1710)]/80 backdrop-blur-sm">
                      {item.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {/* Franja de beneficios */}
            {selected === null && (
              <div className="relative grid gap-3 px-4 pb-1 pt-5 sm:grid-cols-3 sm:px-6">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    data-rise
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/40 bg-white/15 px-2.5 py-4 text-center backdrop-blur-md"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/50 bg-[var(--mood-aliados-gold,#D9B77A)]/20 text-[var(--mood-aliados-gold,#D9B77A)]">
                      <benefit.icon className="size-5" />
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
            )}

            {/* CTA */}
            {selected === null && (
              <div data-rise className="relative px-4 pb-6 pt-4 text-center sm:px-6 sm:pb-7">
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
            )}
              </div>
            )}

            {/* Vista grande: imagen a pantalla completa dentro del panel */}
            {selected !== null && (
              <div className="relative z-[6] flex w-full flex-col">
                {/* X de la vista grande */}
                <button
                  ref={largeCloseRef}
                  type="button"
                  aria-label="Cerrar imagen"
                  onClick={exitLarge}
                  className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-[var(--mood-aliados-ink,#2B1710)] backdrop-blur-md transition-transform duration-300 hover:bg-white/35 motion-safe:hover:-translate-y-0.5"
                >
                  <CloseIcon className="size-5" />
                </button>

                {/* Flechas prev/next */}
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={goPrevLarge}
                  className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-[var(--mood-aliados-ink,#2B1710)] backdrop-blur-md transition-transform duration-300 hover:bg-white/35 motion-safe:hover:-translate-y-[calc(50%+2px)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={goNextLarge}
                  className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-[var(--mood-aliados-ink,#2B1710)] backdrop-blur-md transition-transform duration-300 hover:bg-white/35 motion-safe:hover:-translate-y-[calc(50%+2px)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>

                {/* Header + imagen + dots en flujo: si no caben, el OVERLAY scrollea
                    con scrollbar oculto (X y flechas quedan fijas). */}
                <div>
                {/* Header: título + contador */}
                <div className="px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-12">
                  <p className="font-display text-lg text-[var(--mood-aliados-ink,#2B1710)] md:text-xl">
                    {VITRINE_ITEMS[selected].caption}
                  </p>
                  <p className="mt-1 font-sans text-xs tracking-wide text-[var(--mood-aliados-muted,rgba(43,23,16,0.6))]">
                    {selected + 1} / {VITRINE_ITEMS.length}
                  </p>
                </div>

                {/* Área de imagen: wrapper con ALTURA EXPLÍCITA — el <Image fill>
                    nunca colapsa a height:0 aunque el panel/flex reacomoden. */}
                <div
                  ref={largeImageWrapRef}
                  className="relative mx-auto h-[48dvh] min-h-[240px] max-h-[620px] w-full max-w-[52rem] overflow-hidden rounded-2xl border border-white/40 bg-white/10 shadow-[0_20px_60px_-20px_rgba(43,23,16,0.5)] backdrop-blur-sm sm:h-[60dvh]"
                >
                  {imgFailed ? (
                    <div
                      role="img"
                      aria-label="No se pudo cargar la imagen"
                      className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center"
                    >
                      <span className="font-display text-base text-[var(--mood-aliados-ink,#2B1710)]/70">
                        No se pudo cargar la imagen
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={VITRINE_ITEMS[selected].src}
                      alt={VITRINE_ITEMS[selected].alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 900px"
                      className="object-contain"
                      onError={() => setImgFailed(true)}
                    />
                  )}
                </div>
                <div className="flex justify-center gap-2 pb-4 pt-1">
                  {VITRINE_ITEMS.map((item, index) => (
                    <button
                      key={item.src}
                      type="button"
                      aria-label={`Ir a imagen ${index + 1}`}
                      aria-current={selected === index ? "true" : undefined}
                      onClick={() => openLarge(index)}
                      className={`size-1.5 rounded-full transition-colors duration-300 ${
                        selected === index
                          ? "bg-[var(--mood-aliados-gold,#D9B77A)]"
                          : "bg-[var(--mood-aliados-ink,#2B1710)]/25 hover:bg-[var(--mood-aliados-ink,#2B1710)]/45"
                      }`}
                    />
                  ))}
                </div>
                </div>
              </div>
            )}
          </div>
          </div>,
          document.body
        )}
    </>
  );
}