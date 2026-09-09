import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const iconBase: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-6",
};

/** Granos de café — representación visual del origen. */
export function OriginIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="9" cy="10" r="3" />
      <circle cx="15" cy="12" r="2.5" />
      <path d="M12 4v2" />
      <path d="M7 6h10" />
      <path d="M9 14c-2 0-4 1.5-4 3v1" />
      <path d="M15 15c2 0 4 1.5 4 3v1" />
    </svg>
  );
}

/** Escudo con check — sello de calidad superior. */
export function QualityIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3l7 2.7v5.1c0 4.4-3 7.4-7 9.2-4-1.8-7-4.8-7-9.2V5.7L12 3z" />
      <path d="M9 11.8l2.1 2.1 4.1-4.2" />
    </svg>
  );
}

/** Taza de café con vapor — pasión y tradición. */
export function CoffeeIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M17 8h-6a4 4 0 00-4 4v4h10V9a2 2 0 00-2-2z" />
      <path d="M12 2v4" />
      <path d="M10 14h4" />
      <path d="M8 18h8" />
      <path d="M17 18a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
}
