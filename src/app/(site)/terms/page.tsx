import type { Metadata } from "next";
import { PageBanner } from "@/components/site/PageBanner";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing the use of the Infinity Web & Apps website and services.",
};

export default function TermsPage() {
  return (
    <>
      <PageBanner eyebrow="Legal" title="Terms & Conditions" />
      <section className="section pt-4">
        <div className="container-x mx-auto max-w-3xl space-y-6 text-ink-900/75">
          <p className="text-sm text-ink-900/50">Last updated: {new Date().getFullYear()}</p>

          <Block title="1. Acceptance of terms">
            By accessing and using this website you agree to be bound by these
            Terms &amp; Conditions. If you do not agree, please do not use the
            site.
          </Block>
          <Block title="2. Services">
            Infinity Web &amp; Apps provides website development, mobile app
            development, digital growth and custom business solutions. The scope,
            price and timeline of any engagement are agreed in a separate written
            proposal.
          </Block>
          <Block title="3. Quotes & pricing">
            Prices shown on this website are indicative starting prices. Final
            pricing depends on your specific requirements and will be confirmed in
            a formal quote.
          </Block>
          <Block title="4. Intellectual property">
            All content on this website — including text, graphics, logos and
            code — is the property of Infinity Web &amp; Apps unless otherwise
            stated, and may not be reused without permission.
          </Block>
          <Block title="5. Limitation of liability">
            We provide this website on an &ldquo;as is&rdquo; basis and are not
            liable for any indirect or consequential loss arising from its use.
          </Block>
          <Block title="6. Governing law">
            These terms are governed by the laws of India. Any disputes will be
            subject to the exclusive jurisdiction of the courts of India.
          </Block>
          <Block title="7. Contact">
            Questions about these terms? Reach us through our contact page.
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
