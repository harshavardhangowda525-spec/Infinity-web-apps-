import type { Metadata } from "next";
import { PageBanner } from "@/components/site/PageBanner";
import { Portfolio } from "@/components/site/Portfolio";
import { CTA } from "@/components/site/CTA";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A portfolio of websites, mobile apps and business tools built by Infinity Web & Apps.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageBanner
        eyebrow="Portfolio"
        title="Work we're proud to show off"
        subtitle="Browse a selection of the digital products we've crafted for our clients."
      />
      <Portfolio projects={projects} heading={false} />
      <CTA />
    </>
  );
}
