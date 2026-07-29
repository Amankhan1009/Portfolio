import { ArrowUpRight, FileText, GitBranch, Mail, Network } from "lucide-react";

import { siteConfig } from "@/config/site";

/** Contact section — a clear final call to action and useful links. */
export function Contact() {
  return (
    <>
      <section
        id="contact"
        className="border-border scroll-mt-16 border-t px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-h2 mt-2 font-semibold tracking-tight">
            Let&apos;s work together
          </h2>
          <p className="text-foreground-muted mt-5 max-w-2xl text-lg leading-relaxed">
            {siteConfig.contactMessage}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="border-border bg-card hover:border-border-hover hover:bg-card-hover group rounded-lg border p-6 transition-colors"
            >
              <Mail className="text-accent mb-5" size={22} strokeWidth={1.7} />
              <p className="text-foreground-subtle font-mono text-xs tracking-wide uppercase">
                Email
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-foreground text-sm break-all">
                  {siteConfig.email}
                </span>
                <ArrowUpRight
                  className="text-foreground-subtle group-hover:text-foreground shrink-0 transition-colors"
                  size={18}
                />
              </div>
            </a>

            <div className="border-border bg-card rounded-lg border p-6">
              <p className="text-foreground-subtle font-mono text-xs tracking-wide uppercase">
                Availability
              </p>
              <p className="text-foreground mt-3 text-sm leading-relaxed">
                {siteConfig.availability}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="border-border text-foreground-muted hover:border-border-hover hover:text-foreground inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors"
            >
              <GitBranch size={17} /> GitHub
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="border-border text-foreground-muted hover:border-border-hover hover:text-foreground inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors"
            >
              <Network size={17} /> LinkedIn
            </a>
            <a
              href={siteConfig.links.resume}
              download
              className="bg-accent text-accent-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm transition-colors"
            >
              <FileText size={17} /> Download Resume
            </a>
          </div>
        </div>
      </section>

      <footer className="border-border border-t px-6 py-8">
        <div className="text-foreground-subtle mx-auto flex max-w-5xl flex-col gap-2 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>Built with Next.js, TypeScript &amp; Tailwind CSS</span>
        </div>
      </footer>
    </>
  );
}
