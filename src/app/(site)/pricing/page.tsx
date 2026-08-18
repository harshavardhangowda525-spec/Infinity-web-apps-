import type { Metadata } from "next";
import { PageBanner } from "@/components/site/PageBanner";
import { PricingSection } from "@/components/site/PricingSection";
import { CTA } from "@/components/site/CTA";
import { getPricing } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent starting prices for websites, mobile apps and digital growth services.",
};

export const revalidate = 60;

export default async function PricingPage() {
  const plans = await getPricing();
  return (
    <>
      <PageBanner
        eyebrow="Pricing"
        title="Pricing that scales with you"
        subtitle="Clear starting prices with tailored quotes for every project."
      />
      <PricingSection plans={plans} />
      <CTA />
    </>
  );
}
