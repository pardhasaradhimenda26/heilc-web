import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import ContactForm from "@/components/features/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, BUSINESS_LOCATION } from "@/lib/site";
import {
  baseGraphNodes,
  breadcrumbSchema,
  graph,
  webPageSchema,
} from "@/lib/schema";

const title = "Contact HEILC";
const description =
  "Talk to the engineers who would do the work. Tell us the problem, the data you already have and the constraint — we reply within one business day.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/contact",
});

const expectations = [
  {
    heading: "What happens next",
    body: "You get a reply within one business day from someone technical, not an account manager. If the answer to your question is short, it will be in that reply rather than in a meeting invitation.",
  },
  {
    heading: "What to include",
    body: "The decision the software has to support, whatever data already exists, and the constraint you are working against — a date, a budget, a compliance requirement. That is enough for us to say whether there is a project here.",
  },
  {
    heading: "What we will not do",
    body: "Quote a number before we understand the scope, or tell you AI is the answer when a query or a rules engine would do it better and cheaper.",
  },
];

export default function ContactPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/contact", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— GET IN TOUCH"
        title="Talk to the people who would build it"
        lead="No qualification funnel and no discovery-call theatre. Describe the problem and we will tell you honestly whether we are the right team for it."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-8 pb-28 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Details */}
        <div>
          <ul className="space-y-6 mb-14 list-none">
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-teal" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-white/55 text-xs mb-0.5">Email</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-white text-sm hover:text-teal transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-teal" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-white/55 text-xs mb-0.5">Based in</span>
                <span className="text-white text-sm">
                  {BUSINESS_LOCATION.addressLocality}, {BUSINESS_LOCATION.addressRegion},
                  India — working with clients worldwide
                </span>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-teal" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-white/55 text-xs mb-0.5">Response time</span>
                <span className="text-white text-sm">
                  Within one business day ({BUSINESS_LOCATION.timezone})
                </span>
              </span>
            </li>
          </ul>

          <div className="space-y-8">
            {expectations.map((item) => (
              <div key={item.heading}>
                <h2 className="text-white text-base font-semibold mb-2">
                  {item.heading}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/60 text-sm leading-relaxed mt-10">
            Looking for something specific first? Browse{" "}
            <Link href="/services" className="text-teal underline underline-offset-2 hover:text-white">
              our services
            </Link>
            ,{" "}
            <Link href="/case-studies" className="text-teal underline underline-offset-2 hover:text-white">
              the case studies
            </Link>{" "}
            or{" "}
            <Link href="/faq" className="text-teal underline underline-offset-2 hover:text-white">
              the FAQ
            </Link>
            .
          </p>
        </div>

        {/* Form */}
        <div>
          <h2 className="sr-only">Contact form</h2>
          <ContactForm idPrefix="contact-page" />
        </div>
      </div>
    </PageShell>
  );
}
