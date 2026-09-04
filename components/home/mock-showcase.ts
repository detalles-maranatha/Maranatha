/**
 * Showcase data — real poster copy + exact image paths.
 *
 * Each item maps to an image under /public/images/showcase/ (added by the
 * owner: detalle-gato.jpg, ramo-rosas.jpg, rosas-liston.jpg,
 * flores-limpiapipas.jpg, osito-flores.jpg, oso-panda.jpg, unicornio.jpg,
 * cta-rosas.jpg).
 */

export interface ShowcaseItem {
  id: string;
  title: string;
  image: string;
  materials: string[];
  phrase: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "detalle-gato",
    title: "Detalle de gato",
    image: "/images/showcase/detalle-gato.jpg",
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
    image: "/images/showcase/ramo-rosas.jpg",
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
    image: "/images/showcase/rosas-liston.jpg",
    materials: ["Papel Coreano.", "Palos de pincho.", "Cinta.", "Flores individuales."],
    phrase: "Elegancia en cada detalle",
  },
  {
    id: "flores-limpiapipas",
    title: "Flores con Limpiapipas",
    image: "/images/showcase/flores-limpiapipas.jpg",
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
    image: "/images/showcase/osito-flores.jpg",
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
    image: "/images/showcase/oso-panda.jpg",
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
    image: "/images/showcase/unicornio.jpg",
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

/** CTA card ("Sorprende con amor") content. */
export const SHOWCASE_CTA = {
  id: "sorprende-amor",
  title: "Sorprende con amor",
  subtitle: "Cada detalle está hecho para crear momentos inolvidables.",
  highlight: "¡Elige tu favorito y haz feliz a alguien especial!",
  image: "/images/showcase/cta-rosas.jpg",
};
