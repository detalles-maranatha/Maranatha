"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { CloseIcon } from "@/components/ui/icons";
import { useScrollLock } from "@/hooks/use-scroll-lock";

/** Documentos legales — contenido editable (copy neutral, español neutro). */
type LegalSection = {
  heading: string;
  body: string;
};

type LegalDoc = {
  id: "threads" | "privacy" | "cookies";
  label: string;
  title: string;
  intro?: string;
  sections: LegalSection[];
};

const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "threads",
    label: "Condiciones de Threads",
    title: "Condiciones de Threads",
    intro:
      "Estas condiciones regulan el uso de la tienda en línea y los servicios de Detalles Maranatha. Al navegar o comprar en el sitio aceptás estas condiciones en su totalidad.",
    sections: [
      {
        heading: "Uso del sitio",
        body: "El contenido del sitio (textos, imágenes, precios y disponibilidad) puede cambiar sin previo aviso. Durante el lanzamiento el catálogo puede no reflejar el stock completo del taller.",
      },
      {
        heading: "Pedidos y pagos",
        body: "Los pedidos se confirman cuando el pago o el acuerdo de compra queda registrado. Nos comunicaremos por WhatsApp para coordinar la entrega o el retiro del detalle.",
      },
      {
        heading: "Entregas",
        body: "Los tiempos de entrega dependen de la zona de domicilio y de la temporada. El costo y la cobertura se informan antes de confirmar el pedido.",
      },
      {
        heading: "Devoluciones y garantías",
        body: "Cada detalle se elabora a mano y puede tener pequeñas variaciones que lo hacen único. Ante un problema con tu pedido, escribinos y lo resolvemos directamente.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Las marcas, textos y diseños de este sitio pertenecen a Detalles Maranatha. No pueden ser usados, copiados ni distribuidos sin autorización.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Política de privacidad",
    title: "Política de privacidad",
    intro:
      "En Detalles Maranatha nos tomamos en serio la protección de tus datos. Esta política explica qué información recopilamos y cómo la usamos.",
    sections: [
      {
        heading: "Datos que recopilamos",
        body: "Recopilamos únicamente los datos necesarios para atender tu pedido: nombre, teléfono, dirección de entrega y el detalle que querés encargar.",
      },
      {
        heading: "Uso de los datos",
        body: "Usamos tus datos para procesar pedidos, coordinar entregas por WhatsApp y responder consultas. No usamos tus datos para publicidad sin tu consentimiento.",
      },
      {
        heading: "Compartir información",
        body: "No vendemos ni alquilamos tus datos personales. Solo los compartimos con terceros estrictamente necesarios para la entrega (por ejemplo, el servicio de domicilio).",
      },
      {
        heading: "Tus derechos",
        body: "Podés pedir acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp o por los canales de contacto del sitio.",
      },
      {
        heading: "Contacto",
        body: "Para cualquier consulta de privacidad, escribinos por WhatsApp o usá el formulario de contacto de la página.",
      },
    ],
  },
  {
    id: "cookies",
    label: "Política de cookies",
    title: "Política de cookies",
    intro:
      "Usamos cookies propias y de terceros para que el sitio funcione, recordar tus preferencias y medir el rendimiento de la tienda.",
    sections: [
      {
        heading: "Qué son las cookies",
        body: "Las cookies son pequeños archivos que se guardan en tu dispositivo al visitar un sitio web. Permiten que el sitio recuerde información entre visitas.",
      },
      {
        heading: "Cookies que usamos",
        body: "Cookies técnicas (necesarias para el funcionamiento), de preferencias (como el tema claro/oscuro) y de análisis (para entender cómo se usa el sitio).",
      },
      {
        heading: "Cookies de terceros",
        body: "Algunas herramientas de medición o redes sociales pueden instalar sus propias cookies cuando interactuás con ellas dentro del sitio.",
      },
      {
        heading: "Cómo gestionarlas",
        body: "Podés borrar o bloquear las cookies desde la configuración de tu navegador. Si las bloqueás, algunas funciones del sitio pueden no funcionar bien.",
      },
      {
        heading: "Contacto",
        body: "Si tenés dudas sobre esta política, escribinos por WhatsApp o por los canales de contacto del sitio.",
      },
    ],
  },
];

/**
 * LegalModals — pilares legales del footer.
 * Renderiza los tres botones-link (Condiciones de Threads, Política de
 * privacidad, Política de cookies) y un modal por documento seleccionado.
 * Se adapta al modo oscuro vía tokens de tema (--theme-bg / --theme-accent /
 * mar-*) y fija el scroll de la página mientras está abierto (la página NO
 * se mueve detrás; el contenido legal scrollea dentro del panel).
 */
export default function LegalModals() {
  const [activeId, setActiveId] = useState<LegalDoc["id"] | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotionRef = useRef(false);

  const isOpen = activeId !== null;
  useScrollLock(isOpen);

  const activeDoc = LEGAL_DOCS.find((doc) => doc.id === activeId) ?? null;

  const openDoc = useCallback((docId: LegalDoc["id"] | null) => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setActiveId(docId);
  }, []);

  const close = useCallback(() => {
    if (activeId === null) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const reduce = reducedMotionRef.current;

    const finish = () => {
      setActiveId(null);
      lastTriggerRef.current?.focus();
    };

    if (!overlay || !panel) {
      finish();
      return;
    }

    gsap.killTweensOf([overlay, panel]);

    if (reduce) {
      gsap.to([overlay, panel], {
        autoAlpha: 0,
        duration: 0.15,
        ease: "power2.out",
        onComplete: finish,
      });
      return;
    }

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(panel, {
          y: 16,
          opacity: 0,
          scale: 0.98,
          duration: 0.22,
          ease: "power3.inOut",
          onComplete: finish,
        });
      },
    });
  }, [activeId]);

  // Apertura: overlay fade + panel sube suavemente.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const reduce = reducedMotionRef.current;
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(panel, { y: 24, opacity: 0, scale: 0.98 });

    if (reduce) {
      gsap.to([overlay, panel], {
        autoAlpha: 1,
        duration: 0.15,
        ease: "power2.out",
      });
      closeBtnRef.current?.focus();
      return;
    }

    gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });
    gsap.to(panel, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.32,
      ease: "power3.out",
    });
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 260);
    return () => clearTimeout(timer);
  }, [isOpen, activeId]);

  // ESC + focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
        )
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
  }, [isOpen, close]);

  return (
    <>
      {/* Triggers del footer (botones estilo link) */}
      <ul className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {LEGAL_DOCS.map((doc, index) => (
          <li key={doc.id} className="flex items-center gap-2">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="text-mar-brown/40"
              >
                ·
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                lastTriggerRef.current = e.currentTarget;
                openDoc(doc.id);
              }}
              className="font-sans text-xs text-mar-brown/70 underline underline-offset-4 transition-colors hover:text-mar-brown"
            >
              {doc.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal legal — Portal a document.body: mismo motivo que el modal de
          aliados, el overlay fixed SIEMPRE cubre la pantalla completa. */}
      {activeDoc &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            aria-describedby="legal-modal-desc"
            className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center p-3 md:p-8"
            onClick={(e) => {
              if (e.target === overlayRef.current) close();
            }}
          >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Panel — tokens de tema: se adapta a modo oscuro */}
          <div
            ref={panelRef}
            className="relative z-[1] flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--theme-accent)]/25 bg-[var(--theme-bg)] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.55)]"
          >
            {/* Resplandor superior (decorativo) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--theme-accent)]/15 to-transparent"
            />

            {/* Cerrar */}
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Cerrar"
              onClick={close}
              className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-mar-brown/15 text-mar-brown/70 backdrop-blur-md transition-colors hover:border-mar-brown hover:text-mar-brown"
            >
              <CloseIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="relative px-6 pb-4 pt-12 md:px-8">
              <h3
                id="legal-modal-title"
                className="pr-10 font-display text-2xl leading-tight text-mar-brown md:text-3xl"
              >
                {activeDoc.title}
              </h3>
              {activeDoc.intro && (
                <p
                  id="legal-modal-desc"
                  className="mt-3 font-sans text-sm leading-relaxed text-mar-brown/70"
                >
                  {activeDoc.intro}
                </p>
              )}
            </div>

            {/* Cuerpo — scroll interno, la página no se mueve */}
            <div data-lenis-prevent className="relative overflow-y-auto overscroll-contain touch-pan-y px-6 pb-8 pt-2 md:px-8">
              <div className="flex flex-col gap-6">
                {activeDoc.sections.map((section) => (
                  <section key={section.heading}>
                    <h4 className="font-display text-base font-semibold text-mar-brown">
                      {section.heading}
                    </h4>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-mar-brown/75">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
              <p className="mt-8 border-t border-mar-brown/10 pt-4 text-center font-sans text-xs text-mar-brown/50">
                © {new Date().getFullYear()} Detalles Maranatha
              </p>
            </div>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}