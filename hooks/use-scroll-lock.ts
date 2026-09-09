"use client";

import { useLayoutEffect, useRef } from "react";
import { startLenis, stopLenis } from "@/lib/lenis";

/**
 * useScrollLock — bloquea el scroll de la página mientras `locked` es true.
 *
 * Hace TRES cosas para que la página NO se mueva detrás del modal:
 * 1. `stopLenis()` — Lenis scrollea programáticamente y se saltea
 *    `overflow:hidden`; hay que pausar el smooth-scroll (el lock de CSS solo
 *    no alcanza en este sitio).
 * 2. `overflow:hidden` en <html> y <body> — bloquea el scroll nativo.
 * 3. `overscroll-behavior: none` + `touch-action: none` en el body — evita el
 *    chaining hacia la página en desktop y touch (iOS incluido).
 *
 * El contenido del modal scrollea dentro de su propio contenedor
 * (overscroll-contain); solo la página queda fija.
 */
export function useScrollLock(locked: boolean) {
  const savedRef = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
    bodyOverscroll: string;
    bodyTouchAction: string;
  } | null>(null);

  // useLayoutEffect: el lock aplica antes del paint, sin frame de scroll libre.
  useLayoutEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;

    savedRef.current = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    };

    stopLenis();
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";

    return () => {
      const prev = savedRef.current;
      if (!prev) return;
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.touchAction = prev.bodyTouchAction;
      savedRef.current = null;
      startLenis();
    };
  }, [locked]);
}