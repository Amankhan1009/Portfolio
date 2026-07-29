import { siteConfig } from "@/config/site";

/**
 * About section — two columns: a short narrative on the left, and a quiet
 * "quick facts" panel on the right pulling straight from site config so it
 * never drifts out of sync with the rest of the site.
 *
 * Deliberately text-led, no headshot — keeps the engineer-first, Linear/
 * Vercel-inspired tone of the rest of the page.
 */
export function About() {
  const facts: { label: string; value: string }[] = [
    { label: "Education", value: siteConfig.education.degree },
    { label: "Institution", value: siteConfig.education.institution },
    { label: "Location", value: siteConfig.location },
    { label: "Currently Focused On", value: siteConfig.currentlyFocusedOn },
  ];

  return (
    <section
      id="about"
      className="border-border scroll-mt-16 border-t px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-h2 mt-2 font-semibold tracking-tight">About</h2>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <p className="text-foreground-muted text-lg leading-relaxed">
            {siteConfig.bio}
          </p>

          <div className="border-border bg-card h-fit rounded-lg border p-6">
            <dl className="flex flex-col gap-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-foreground-subtle font-mono text-xs tracking-wide uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
