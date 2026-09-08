import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DeferredOverlays from "@/components/features/DeferredOverlays";
import type { Crumb } from "@/lib/schema";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-white/60">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-white/70">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-teal transition-colors">
                  {crumb.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, lead, crumbs, children }: PageHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto px-8 pt-36 pb-16">
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <p className="section-label mb-5">{eyebrow}</p>
      <h1
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(40px,6.5vw,84px)",
          lineHeight: 0.98,
        }}
        className="text-white mb-6 max-w-4xl"
      >
        {title}
      </h1>
      <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl">
        {lead}
      </p>
      {children}
    </header>
  );
}

/** Shared chrome for every route other than the homepage. */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-bg min-h-screen">
        {children}
      </main>
      <Footer />
      <DeferredOverlays />
    </>
  );
}
