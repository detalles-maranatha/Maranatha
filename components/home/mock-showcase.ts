/**
 * Mock data for FeaturedShowcase — plug-and-play, no lib/products.ts dependency.
 * Matches the 7 product cards + 1 CTA card from the reference image.
 */

export type ShowcaseProduct = {
  id: string;
  title: string;
  materials: string[];
  phrase: string;
  decorationIcon: "heart" | "leaf" | "flower";
};

export type ShowcaseCTA = {
  id: string;
  title: string;
  description: string;
  hearts: string;
  imageAlt: string;
};

export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: "ramo-rosas",
    title: "Ramo de Rosas",
    materials: [
      "Rosas de satín premium",
      "Tallo forrado en cinta",
      "Moño dorado artesanal",
      "Tarjeta personalizada",
    ],
    phrase: "¡Un detalle clásico que nunca falla!",
    decorationIcon: "heart",
  },
  {
    id: "osito-flores",
    title: "Osito de Flores",
    materials: [
      "Peluche conejito suave",
      "Flores de listón variadas",
      "Canasta decorativa",
      "Lazo de organza",
    ],
    phrase: "¡Ternura que abraza el alma!",
    decorationIcon: "leaf",
  },
  {
    id: "unicornio-magico",
    title: "Unicornio Mágico",
    materials: [
      "Peluche unicornio pastel",
      "Ramo de flores limpiapipas",
      "Detalles en tonos lila/rosa",
      "Estrella decorativa",
    ],
    phrase: "¡La magia existe y la regalas!",
    decorationIcon: "flower",
  },
  {
    id: "canasta-cafe",
    title: "Canasta Café Cerquera",
    materials: [
      "Café de origen Cerquera",
      "Galletas artesanales",
      "Taza cerámica incluida",
      "Tarjeta escrita a mano",
    ],
    phrase: "¡Para los amantes del buen café!",
    decorationIcon: "heart",
  },
  {
    id: "bouquet-girasoles",
    title: "Bouquet Girasoles",
    materials: [
      "Girasoles de limpiapipas",
      "Hojas verdes realistas",
      "Jarrón de papel kraft",
      "Lazo de yute natural",
    ],
    phrase: "¡Luz y alegría en cada pétalo!",
    decorationIcon: "leaf",
  },
  {
    id: "canasta-dinosaurio",
    title: "Canasta Dinosaurio",
    materials: [
      "Peluche dinosaurio tierno",
      "Flores de satín colores",
      "Base de canasta rústica",
      "Detalles jurásicos",
    ],
    phrase: "¡Un rugido de cariño puro!",
    decorationIcon: "flower",
  },
  {
    id: "arreglo-oso",
    title: "Arreglo con Oso",
    materials: [
      "Peluche osito clásico",
      "Rosas de satín crema/rosa",
      "Caja rígida premium",
      "Moño de terciopelo",
    ],
    phrase: "¡El abrazo que se queda para siempre!",
    decorationIcon: "heart",
  },
];

export const SHOWCASE_CTA: ShowcaseCTA = {
  id: "sorprende-amor",
  title: "Sorprende con amor",
  description:
    "Cada detalle nace en nuestro taller con manos que cuidan cada pétalo, cada puntada, cada lazo. No vendemos regalos: creamos momentos que se quedan en el corazón.",
  hearts: "♥ ♡ ♥ ♡ ♥",
  imageAlt: "Ramo de rosas artesanal en tonos pastel",
};