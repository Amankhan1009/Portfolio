import { siteConfig } from "@/config/site";

/** Experience section — a concise timeline sourced from the site config. */
export function Experience() {
  return (
    <section
      id="experience"
      className="border-border scroll-mt-16 border-t px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-h2 mt-2 font-semibold tracking-tight">
          Experience
        </h2>

        <div className="mt-10 flex flex-col gap-10">
          {siteConfig.experience.map((item) => (
            <article
              key={`${item.company}-${item.role}`}
              className="border-border border-l-2 pl-6 md:pl-8"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <h3 className="text-h3 font-semibold tracking-tight">
                  {item.company}
                  <span className="text-foreground-muted font-normal">
                    {" — "}
                    {item.role}
                  </span>
                </h3>
                <p className="text-foreground-subtle shrink-0 font-mono text-sm">
                  {item.dates}
                </p>
              </div>

              <ul className="text-foreground-muted mt-5 flex list-disc flex-col gap-3 pl-5 text-base leading-relaxed">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
