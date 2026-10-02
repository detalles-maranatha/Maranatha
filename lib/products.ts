/**
 * Catalog data layer (cc-R1): all product content is server-side data so a
 * headless CMS can slot in later without touching the pages.
 *
 * Prices are kept twice on purpose: numeric `price` feeds Schema.org offers
 * (product page JSON-LD) and display `priceLabel` covers the Colombian
 * price-first UX ("$45.000"). `coverage` holds Bogotá zone slugs from day one
 * (Brief 03 §1.3) resolved through lib/zones.ts; only zones with real
 * coverage exist. Images reuse the placeholder SVGs until real photos arrive.
 */

/** Occasion taxonomy (brief §11): slug + Spanish label + long-tail SEO
 *  description (used by /ocasiones/[ocasion] pages and UI chips). */
export type Occasion = {
  slug: string;
  label: string;
  /** Long-tail meta description for the occasion page (Brief 02 §8.1). */
  description: string;
};

export const OCCASIONS: Occasion[] = [
  {
    slug: "san-valentin",
    label: "San Valentín",
    description:
      "Ramos de rosas de listón y arreglos florales hechos a mano para San Valentín en Bogotá. Flores eternas que no se marchitan, a domicilio el mismo día. Pide por WhatsApp.",
  },
  {
    slug: "cumpleanos",
    label: "Cumpleaños",
    description:
      "Detalles de cumpleaños en Bogotá: bouquets de limpiapipas, canastas con peluche y flores de listón hechas a mano. Regala algo único hoy, pídelo por WhatsApp.",
  },
  {
    slug: "amor-y-amistad",
    label: "Amor y Amistad",
    description:
      "Regalos para el Día de Amor y Amistad en Bogotá: ramos de rosas de satín, bouquets artesanales y arreglos con peluche. Envíos a domicilio, pide por WhatsApp.",
  },
  {
    slug: "dia-de-la-madre",
    label: "Día de la Madre",
    description:
      "Detalles para el Día de la Madre en Bogotá: arreglos con peluche, canastas de café Cerquera y ramos de listón hechos a mano. Sorpréndela con un regalo único, pide por WhatsApp.",
  },
  {
    slug: "aniversarios",
    label: "Aniversarios",
    description:
      "Ramos de rosas de listón y canastas de regalo para aniversarios en Bogotá. Detalles hechos a mano que celebran el amor, a domicilio por WhatsApp.",
  },
  {
    slug: "condolencias",
    label: "Condolencias",
    description:
      "Arreglos de condolencia en Bogotá: ramos de rosas de satín blancas hechos a mano con respeto y discreción. Coordina la entrega directamente por WhatsApp.",
  },
  {
    slug: "navidad",
    label: "Navidad",
    description:
      "Canastas navideñas y detalles de regalo en Bogotá: flores en tonos rojos y dorados, café Cerquera y sorpresas para toda la familia. Pide por WhatsApp.",
  },
  {
    slug: "agradecimiento",
    label: "Agradecimiento",
    description:
      "Detalles para agradecer en Bogotá: mini ramos, bouquets de limpiapipas y canastas de café Cerquera. Un gesto hecho a mano que se recuerda, pide por WhatsApp.",
  },
  {
    slug: "recien-nacido",
    label: "Recién nacido",
    description:
      "Regalos para recién nacido en Bogotá: canastas con peluche de conejito y flores hechas a mano. El detalle perfecto para dar la bienvenida, pide por WhatsApp.",
  },
];

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  /** Numeric COP value used by Schema.org offers (product JSON-LD). */
  price: number;
  /** Display price string for the Colombian price-first UX ("$45.000"). */
  priceLabel: string;
  /** Optional price clarification, e.g. "precio según peluche". */
  priceNote?: string;
  description: string;
  images: ProductImage[];
  /** Occasion slugs (see OCCASIONS for labels). */
  occasion: string[];
  available: boolean;
  featured?: boolean;
  /** Bogotá zone slugs resolved through lib/zones.ts (Brief 03 §1.3). */
  coverage: string[];
  /** Sensible reason shown when `available` is false. */
  unavailableNote?: string;
};

export type Category = {
  slug: string;
  label: string;
  description: string;
  /** Section mood applied to the category page (SectionMood subset). */
  mood: "catalogo-sage" | "catalogo-gold";
  /** Long-tail SEO title for the category page (template appends the brand). */
  metaTitle: string;
  /** Unique long-tail meta description (Brief 02 §8.1). */
  metaDescription: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "flores-liston",
    label: "Flores de listón",
    description:
      "Ramos de rosas de satín hechos a mano: clásicos, elegantes y duraderos para regalar en cualquier ocasión.",
    mood: "catalogo-gold",
    metaTitle: "Ramos de rosas de listón a domicilio en Bogotá",
    metaDescription:
      "Ramos de rosas de listón hechos a mano en Bogotá desde $15.000 COP. Flores de satín a domicilio por WhatsApp, ideales para San Valentín y aniversarios.",
  },
  {
    slug: "flores-limpiapipas",
    label: "Flores de limpiapipas",
    description:
      "Bouquets artesanales pequeños y coloridos, hechos a mano con limpiapipas. Flores que no se marchitan.",
    mood: "catalogo-sage",
    metaTitle: "Bouquets de limpiapipas artesanales en Bogotá",
    metaDescription:
      "Bouquets de limpiapipas hechos a mano en Bogotá entre $25.000 y $35.000 COP. Flores duraderas, perfectas para cumpleaños y detalles.",
  },
  {
    slug: "arreglos-peluche",
    label: "Arreglos con peluche",
    description:
      "Canastas temáticas con peluche y flores: conejito, dinosaurio, unicornio y más. Regalos con ternura.",
    mood: "catalogo-gold",
    metaTitle: "Arreglos con peluche y flores en Bogotá",
    metaDescription:
      "Canastas temáticas con peluche y flores a domicilio en Bogotá: conejito, dinosaurio y unicornio. Precio variable según el peluche. Pide por WhatsApp.",
  },
  {
    slug: "canastas-detalles",
    label: "Canastas y detalles",
    description:
      "Canastas de café Cerquera, nuestra marca propia, y canastas de regalo para consentir y agradecer.",
    mood: "catalogo-sage",
    metaTitle: "Canastas de café y regalo a domicilio en Bogotá",
    metaDescription:
      "Canastas de café Cerquera y canastas de regalo personalizadas a domicilio en Bogotá. Detalles para agradecer, celebrar o consentir, pedidos por WhatsApp.",
  },
];

/** Launch coverage zones (Brief 03 §1.1); must all exist in lib/zones.ts. */
const BOGOTA_COVERAGE = [
  "bogota",
  "bogota-norte",
  "bogota-centro",
  "bogota-sur",
];

export const PRODUCTS: Product[] = [
  {
    slug: "ramo-rosas-satin-clasico",
    name: "Ramo de rosas de satín clásico",
    category: "flores-liston",
    price: 45000,
    priceLabel: "$45.000",
    description:
      "El clásico de Detalles Maranatha: un ramo de rosas de listón hechas a mano, con tallo forrado en cinta satín y moño dorado. Ideal para decir “te quiero” o celebrar un aniversario. Disponible en rosa, rojo y crema, con entrega a domicilio en Bogotá.",
    images: [
      { src: "/images/showcase/detalleactualizado2.jpg", alt: "Ramo de rosas de satín clásico con detalle actualizado" },
      { src: "/placeholders/ribbon.svg", alt: "Moño dorado del ramo de satín" },
    ],
    occasion: ["san-valentin", "aniversarios", "amor-y-amistad"],
    available: true,
    featured: true,
    coverage: BOGOTA_COVERAGE,
  },
{
    slug: "ramo-rosas-satin-premium",
    name: "Ramo de rosas de satín premium",
    category: "flores-liston",
    price: 65000,
    priceLabel: "$65.000",
    description:
      "Versión ampliada del ramo clásico, con rosas de satín de mayor tamaño y un acabado premium. Incluye tarjeta personalizada y empaque de regalo. Perfecto para sorprender en ocasiones especiales.",
    images: [
      { src: "/images/showcase/detalleactualizado3.jpg", alt: "Ramo de rosas de satín premium con detalle actualizado" },
      { src: "/placeholders/ribbon.svg", alt: "Empaque de regalo del ramo premium" },
    ],
    occasion: ["san-valentin", "aniversarios"],
    available: true,
    featured: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "ramo-rosas-satin-elegante",
    name: "Ramo de rosas de satín elegante",
    category: "flores-liston",
    price: 85000,
    priceLabel: "$85.000",
    description:
      "Nuestro ramo más completo: rosas de satín grandes, cinta dorada y una composición de gran altura. Un detalle de alto impacto para los momentos que merecen ser inolvidables.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Ramo de rosas de satín elegante" },
      { src: "/placeholders/ribbon.svg", alt: "Detalle de cinta dorada del ramo elegante" },
    ],
    occasion: ["san-valentin", "amor-y-amistad"],
    available: true,
    featured: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "ramo-mini-rosas-satin",
    name: "Mini ramo de rosas de satín",
    category: "flores-liston",
    price: 25000,
    priceLabel: "$25.000",
    description:
      "Un detalle pequeño con todo el encanto: tres rosas de satín envueltas en celofán con moño. Ideal para acompañar un regalo, agradecer o alegrar el día sin una gran inversión.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Mini ramo de rosas de satín" },
    ],
    occasion: ["cumpleanos", "agradecimiento"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "ramo-rosas-blancas-condolencia",
    name: "Ramo de rosas de satín blancas",
    category: "flores-liston",
    price: 40000,
    priceLabel: "$40.000",
    description:
      "Arreglo sobrio y respetuoso en rosas de satín blancas, pensado para acompañar en momentos de condolencia. Coordinamos fecha y forma de entrega directamente por WhatsApp.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Ramo de rosas de satín blancas" },
    ]," },
    ],
    occasion: ["condolencias"],
    available: false,
    unavailableNote:
      "Disponible bajo pedido especial. Escríbenos por WhatsApp para coordinar la entrega.",
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "mini-bouquet-limpiapipas",
    name: "Mini bouquet limpiapipas",
    category: "flores-limpiapipas",
    price: 30000,
    priceLabel: "$30.000",
    description:
      "Pequeño bouquet artesanal hecho con flores de limpiapipas, colorido y duradero. El detalle ideal para cumpleaños, detalles de oficina o para dar las gracias con estilo.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Mini bouquet de limpiapipas" },
    ],
    occasion: ["cumpleanos", "agradecimiento"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "bouquet-limpiapipas-girasoles",
    name: "Bouquet limpiapipas girasoles",
    category: "flores-limpiapipas",
    price: 35000,
    priceLabel: "$35.000",
    description:
      "Bouquet de girasoles hechos a mano con limpiapipas: alegres, llamativos y eternos. Un regalo que no se marchita y llena de luz cualquier espacio.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Bouquet de girasoles en limpiapipas" },
    ],
    occasion: ["cumpleanos"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "bouquet-limpiapipas-rosado",
    name: "Bouquet limpiapipas rosado",
    category: "flores-limpiapipas",
    price: 28000,
    priceLabel: "$28.000",
    description:
      "Bouquet artesanal en tonos rosados con flores de limpiapipas. Dulce y delicado, perfecto para Amor y Amistad o para consentir a alguien especial.",
    images: [
      { src: "/placeholders/flower.svg", alt: "Bouquet de limpiapipas rosado" },
    ],
    occasion: ["amor-y-amistad", "cumpleanos"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "canasta-conejito-flores",
    name: "Canasta conejito + flores",
    category: "arreglos-peluche",
    price: 55000,
    priceLabel: "$55.000",
    priceNote: "precio según peluche",
    description:
      "Canasta temática con peluche de conejito acompañado de flores y detalles decorativos. El regalo ideal para recibir un recién nacido o celebrar un cumpleaños con ternura.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta conejito con flores" },
      { src: "/placeholders/ribbon.svg", alt: "Moño de la canasta conejito" },
    ],
    occasion: ["recien-nacido", "cumpleanos"],
    available: true,
    featured: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "canasta-dinosaurio-flores",
    name: "Canasta dinosaurio + flores",
    category: "arreglos-peluche",
    price: 50000,
    priceLabel: "$50.000",
    priceNote: "precio según peluche",
    description:
      "Canasta con peluche de dinosaurio y flores coloridas. Perfecta para sorprender a los pequeños, y a los no tan pequeños, en su cumpleaños.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta dinosaurio con flores" },
    ],
    occasion: ["cumpleanos"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "canasta-unicornio-flores",
    name: "Canasta unicornio + flores",
    category: "arreglos-peluche",
    price: 58000,
    priceLabel: "$58.000",
    priceNote: "precio según peluche",
    description:
      "Canasta temática de unicornio con peluche y flores en tonos pastel. Un detalle mágico para celebrar cumpleaños o conquistar corazones en Amor y Amistad.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta unicornio con flores" },
      { src: "/placeholders/ribbon.svg", alt: "Detalles en tonos pastel de la canasta unicornio" },
    ],
    occasion: ["cumpleanos", "amor-y-amistad"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "arreglo-peluche-oso-flores",
    name: "Arreglo oso + flores",
    category: "arreglos-peluche",
    price: 45000,
    priceLabel: "$45.000",
    priceNote: "precio según peluche",
    description:
      "Arreglo con peluche de osito y flores de satín. Clásico y tierno, ideal para el Día de la Madre, cumpleaños o cualquier muestra de cariño.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Arreglo de oso con flores" },
    ],
    occasion: ["dia-de-la-madre", "cumpleanos"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "canasta-cafe-cerquera-clasica",
    name: "Canasta Café Cerquera clásica",
    category: "canastas-detalles",
    price: 48000,
    priceLabel: "$48.000",
    description:
      "Canasta con café de nuestra marca propia Café Cerquera, acompañada de un detalle dulce y un mensaje personalizado. El regalo perfecto para agradecer, visitar o consentir a un amante del café.",
    images: [
      { src: "/images/showcase/Max_a_a_esta_imagen_dejale.jpeg", alt: "Canasta de Café Cerquera clásica" },
    ],
    occasion: ["agradecimiento", "cumpleanos"],
    available: true,
    featured: true,
    coverage: [...BOGOTA_COVERAGE, "bogota-soacha"],
  },
  {
    slug: "canasta-cafe-cerquera-gourmet",
    name: "Canasta Café Cerquera gourmet",
    category: "canastas-detalles",
    price: 68000,
    priceLabel: "$68.000",
    description:
      "Versión gourmet de nuestra canasta de café: café de origen Cerquera en empaque especial, pasabocones finos y una presentación elegante. Ideal para el Día de la Madre o para regalar a alguien exigente.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta de Café Cerquera gourmet" },
    ],
    occasion: ["dia-de-la-madre", "agradecimiento"],
    available: true,
    coverage: [...BOGOTA_COVERAGE, "bogota-soacha"],
  },
{
    slug: "canasta-regalo-mixta",
    name: "Canasta de regalo mixta",
    category: "canastas-detalles",
    price: 60000,
    priceLabel: "$60.000",
    description:
      "Canasta de regalo con una selección de flores, un detalle dulce y elementos sorpresa que personalizamos según la ocasión. Cuéntanos a quién va dirigida y la armamos a tu gusto.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta de regalo mixta" },
    ],
    occasion: ["cumpleanos", "aniversarios"],
    available: true,
    coverage: BOGOTA_COVERAGE,
  },
  {
    slug: "canasta-navidad-maranatha",
    name: "Canasta de Navidad Maranatha",
    category: "canastas-detalles",
    price: 70000,
    priceLabel: "$70.000",
    description:
      "Canasta navideña con detalles temáticos, dulces y flores en tonos rojos y dorados. El regalo ideal para sorprender en familia o agradecer a colegas durante diciembre.",
    images: [
      { src: "/placeholders/gift.svg", alt: "Canasta de Navidad Maranatha" },
      { src: "/placeholders/ribbon.svg", alt: "Moño navideño de la canasta" },
    ],
    occasion: ["navidad"],
    available: false,
    unavailableNote:
      "Disponible por temporada navideña (noviembre – diciembre).",
    coverage: BOGOTA_COVERAGE,
  },
];

export function getCategories(): Category[] {
  return CATEGORIES;
}

/** Category lookup by slug (catalog and product routes use it as id). */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((product) => product.category === categoryId);
}

/** Products tagged with an occasion slug (drives /ocasiones/[ocasion]). */
export function getProductsByOccasion(slug: string): Product[] {
  return PRODUCTS.filter((product) => product.occasion.includes(slug));
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(
    (candidate) =>
      candidate.category === product.category && candidate.slug !== product.slug
  ).slice(0, limit);
}

/** Pre-filled WhatsApp message for a specific product (brief §13). */
export function productWhatsAppMessage(product: Product): string {
  return `Hola 👋 Me interesa: ${product.name} (${product.priceLabel}). ¿Me das más información?`;
}
