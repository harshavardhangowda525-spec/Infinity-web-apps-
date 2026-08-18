import type { Metadata } from "next";
import { PageBanner } from "@/components/site/PageBanner";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Infinity Web & Apps collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageBanner eyebrow="Legal" title="Privacy Policy" />
      <section className="section pt-4">
        <div className="container-x prose-legal mx-auto max-w-3xl space-y-6 text-ink-900/75">
          <p className="text-sm text-ink-900/50">Last updated: {new Date().getFullYear()}</p>

          <Block title="1. Introduction">
            Infinity Web &amp; Apps (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
            your privacy. This policy explains what information we collect when
            you use our website and how we handle it.
          </Block>
          <Block title="2. Information we collect">
            When you submit our contact form we collect the details you provide —
            such as your name, business name, phone number, email, business type,
            required service, budget and message. We also store the date and time
            of your submission.
          </Block>
          <Block title="3. How we use your information">
            We use the information you provide solely to respond to your enquiry,
            provide our services, and communicate with you about your project. We
            do not sell your personal information.
          </Block>
          <Block title="4. Data storage & security">
            Your data is stored securely in a managed PostgreSQL database with
            row-level security and encrypted connections. Access is restricted to
            authorised administrators only.
          </Block>
          <Block title="5. Your rights">
            You may request access to, correction of, or deletion of your personal
            data at any time by contacting us.
          </Block>
          <Block title="6. Contact">
            For any privacy questions, please reach us through our contact page.
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
