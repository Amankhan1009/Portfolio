import { siteConfig } from "@/config/site";

/**
 * Skills section — categorized pill/badge grid sourced from site config.
 *
 * Deliberately flat and quiet (no proficiency bars/levels): matches the
 * plain-badge language already established by the Hero's role pills, and
 * keeps the focus on breadth of the stack rather than a subjective ranking.
 */
export function Skills() {
  return (
    <section
      id="skills"
      className="border-border scroll-mt-16 border-t px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-h2 mt-2 font-semibold tracking-tight">Skills</h2>

        <div className="mt-10 flex flex-col gap-8">
          {siteConfig.skills.map((group) => (
            <div
              key={group.category}
              className="border-border bg-card rounded-lg border p-6"
            >
              <h3 className="text-foreground-subtle font-mono text-xs tracking-wide uppercase">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border-border hover:border-border-hover hover:bg-card-hover text-foreground-muted rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
