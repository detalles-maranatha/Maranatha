import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import ParallaxFloat from "@/components/parallax-float";
import AliadosModal from "./AliadosModal.client";

/**
 * AliadosSection — server component (SSG).
 * Renderiza el texto del bloque "Marcas que confían en nosotros"
 * en el servidor; delega toda interactividad (modal, carrusel,
 * animaciones) al cliente via AliadosModal.client.tsx.
 *
 * NOTA: renombrar `coffee 2.png` → `coffee-2.png` en public/images/
 * para evitar problemas con imports y next/image.
 */

export default function AliadosSection() {
  return (
    <Section mood="contacto" id="aliados" className="relative" sheet={false}>
      <Watermark
        src="/placeholders/flower.svg"
        className="right-6 top-8 w-20 md:w-28"
      />
      <Watermark
        src="/placeholders/ribbon.svg"
        className="bottom-8 left-6 w-16 md:w-24"
        opacity={0.12}
      />

      {/* Texto: flota sobre el fondo con parallax. */}
      <div className="max-w-2xl">
        <ParallaxFloat speed={0.15} float>
          <h2 className="font-display text-3xl leading-tight text-[var(--color-mar-brown)] md:text-5xl">
            Marcas que confían en nosotros
          </h2>
        </ParallaxFloat>

        <ParallaxFloat speed={0.2} float>
          <p className="mt-4 text-[var(--color-mar-brown)]/70 md:text-lg">
            Construimos cada detalle junto a aliados que comparten nuestro
            cuidado por lo hecho a mano y por el planeta.
          </p>
        </ParallaxFloat>
      </div>

      {/* CTA que abre el modal premium. */}
      <div className="mt-8">
        <ParallaxFloat speed={0.25} float>
          <AliadosModal />
        </ParallaxFloat>
      </div>

      <Watermark
        src="/placeholders/gift.svg"
        className="bottom-10 left-6 md:bottom-12 md:left-10"
        opacity={0.08}
      />
    </Section>
  );
}
