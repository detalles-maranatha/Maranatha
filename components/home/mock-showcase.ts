/**
 * Showcase data — real poster copy + real image paths (public/images/showcase).
 *
 * All source images are PNG. Images are server-side data so the component stays
 * presentational; alts are descriptive Spanish (SEO) for crawlers and AT.
 * "Flores con Limpiapipas" deliberately carries three images rendered as a
 * mini-collage.
 */

export interface ShowcaseImage {
  src: string;
  alt: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  /** One image normally, three for the limpiapipas collage. */
  images: ShowcaseImage[];
  materials: string[];
  phrase: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "detalle-gato",
    title: "Detalle de gato",
    images: [
      {
        src: "/images/showcase/detalle-gato.png",
        alt: "Detalle de gato con peluche, chocolates y 5 rosas eternas de listón envueltas en papel coreano",
      },
    ],
    materials: [
      "Papel Coreano.",
      "Cartón corrugado.",
      "Papel seda.",
      "Flores eternas de listón.",
      "Chocolates.",
      "Peluche de 10 cm.",
      "Listón día de las madres - Temporal.",
      "Pepitas adhesivas.",
      "Cuenta con 5 rosas.",
    ],
    phrase: "¡Un detalle tierno y lleno de amor!",
  },
  {
    id: "ramo-rosas",
    title: "Ramo de rosas",
    images: [
      {
        src: "/images/showcase/ramo-rosas.png",
        alt: "Ramo con 7 rosas eternas de listón y una dalia envuelto en papel coreano y crepé",
      },
    ],
    materials: [
      "Papel Coreano.",
      "Flores eternas de listón.",
      "Pepitas adhesivas.",
      "Papel crepe.",
      "Palos de pincho.",
      "Tiene 7 rosas y una Dalia.",
    ],
    phrase: "Belleza que habla por ti",
  },
  {
    id: "rosas-liston",
    title: "Rosas de listón",
    images: [
      {
        src: "/images/showcase/rosas-liston.png",
        alt: "Rosas individuales de listón envueltas en papel coreano con cinta",
      },
    ],
    materials: ["Papel Coreano.", "Palos de pincho.", "Cinta.", "Flores individuales."],
    phrase: "Elegancia en cada detalle",
  },
  {
    id: "flores-limpiapipas",
    title: "Flores con Limpiapipas",
    images: [
      {
        src: "/images/showcase/limpiapipas-1.png",
        alt: "Ramo de flores de limpiapipas de colores con papel coreano y cinta de listón",
      },
      {
        src: "/images/showcase/limpiapipas-2.png",
        alt: "Detalle de flores de limpiapipas de diferentes colores con papel seda",
      },
      {
        src: "/images/showcase/limpiapipas-3.png",
        alt: "Variedad de flores de limpiapipas con palos de pincho y cinta verde",
      },
    ],
    materials: [
      "Diferentes flores realizadas con limpiapipas de diferentes colores",
      "Papel Coreano",
      "Papel seda",
      "Palos de pincho",
      "Cinta verde",
      "Cinta de listón",
      "Los ramos contienen de 2 a 4 flores.",
    ],
    phrase: "Creatividad que florece",
  },
  {
    id: "osito-flores",
    title: "Osito de Flores",
    images: [
      {
        src: "/images/showcase/osito-flores.png",
        alt: "Osito de flores con 24 rosas eternas de listón rojas y amarillas, chocolates y papel seda",
      },
    ],
    materials: [
      "Cuenta con 24 rosas eternas de listón entre rojo y amarillo.",
      "Pepitas adhesivas.",
      "Chocolates.",
      "Cartón corrugado.",
      "Papel seda.",
    ],
    phrase: "Un abrazo que dura para siempre!",
  },
  {
    id: "oso-panda",
    title: "Oso panda",
    images: [
      {
        src: "/images/showcase/oso-panda.png",
        alt: "Oso panda con 5 rosas rosadas de listón, chocolates y bolsa transparente decorativa",
      },
    ],
    materials: [
      "5 rosas rosadas de listón",
      "Papel seda",
      "Chocolates",
      "Cartón corrugado",
      "Bolsa transparente decorativa",
      "Palitos de pincho",
    ],
    phrase: "Dulzura que conquista",
  },
  {
    id: "unicornio",
    title: "Unicornio",
    images: [
      {
        src: "/images/showcase/unicornio.png",
        alt: "Unicornio con 6 rosas de listón, chocolates y bolsa transparente decorativa",
      },
    ],
    materials: [
      "Bolsa transparente decorativa",
      "Chocolates",
      "Papel seda",
      "6 rosas de listón",
      "Cartón corrugado",
    ],
    phrase: "Magia y ternura en un solo regalo",
  },
];

/** CTA card ("Sorprende con amor") content — no dedicated photo. */
export const SHOWCASE_CTA = {
  id: "sorprende-amor",
  title: "Sorprende con amor",
  subtitle: "Cada detalle está hecho para crear momentos inolvidables.",
  highlight: "¡Elige tu favorito y haz feliz a alguien especial!",
};
