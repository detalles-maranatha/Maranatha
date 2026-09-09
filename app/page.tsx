import HeroHome from "@/components/hero-home";
import ExploraSection from "@/components/explora-section";
import AliadosSection from "@/components/aliados/AliadosSection";
import TestimonialsSection from "@/components/testimonials-section";
import FeaturedShowcase from "@/components/home/featured-showcase";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <ExploraSection />
      <AliadosSection />
      <TestimonialsSection />
      <FeaturedShowcase />
    </main>
  );
}
