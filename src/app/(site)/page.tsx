import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Stats } from "@/components/site/Stats";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Portfolio } from "@/components/site/Portfolio";
import { PricingSection } from "@/components/site/PricingSection";
import { Testimonials } from "@/components/site/Testimonials";
import { CTA } from "@/components/site/CTA";
import {
  getHero,
  getServices,
  getStats,
  getProjects,
  getPricing,
  getTestimonials,
} from "@/lib/data";

// Keep the homepage fresh with live admin edits (revalidate hourly / on demand).
export const revalidate = 60;

export default async function HomePage() {
  const [hero, services, stats, projects, pricing, testimonials] =
    await Promise.all([
      getHero(),
      getServices(),
      getStats(),
      getProjects(),
      getPricing(),
      getTestimonials(),
    ]);

  return (
    <>
      <Hero hero={hero} />
      <Services services={services} />
      <Stats stats={stats} />
      <WhyChooseUs />
      <Portfolio projects={projects.slice(0, 6)} />
      <PricingSection plans={pricing} />
      <Testimonials items={testimonials} />
      <CTA />
    </>
  );
}
