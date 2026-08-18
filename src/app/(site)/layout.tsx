import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageLoader } from "@/components/site/PageLoader";
import { getCompany } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompany();
  return (
    <>
      <PageLoader />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer company={company} />
    </>
  );
}
