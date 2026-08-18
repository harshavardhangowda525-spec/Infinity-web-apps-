import type { Metadata } from "next";
import { PageBanner } from "@/components/site/PageBanner";
import { Services } from "@/components/site/Services";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { CTA } from "@/components/site/CTA";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, mobile apps, digital growth and custom business solutions from Infinity Web & Apps.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Everything you need to grow online"
        subtitle="We design and build modern digital products — and stay with you to help them succeed."
      />
      <Services services={services} showAll />
      <WhyChooseUs />
      <CTA />
    </>
  );
}
