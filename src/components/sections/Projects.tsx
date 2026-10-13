import { ArrowUpRight, Container, GitBranch } from "lucide-react";

import { siteConfig } from "@/config/site";

type Project = {
  name: string;
  description: string;
  tags: readonly string[];
  github?: string;
  demo?: string;
  docker?: string;
};

/** Projects section — a compact, data-driven showcase of selected work. */
export function Projects() {
  const projects = siteConfig.projects as readonly Project[];

  return (
    <section
      id="projects"
      className="border-border scroll-mt-16 border-t px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-h2 mt-2 font-semibold tracking-tight">Projects</h2>
        <p className="text-foreground-muted mt-4 max-w-2xl text-lg leading-relaxed">
          A selection of AI systems, developer tools, and machine-learning
          applications built with a focus on useful, production-minded software.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="border-border bg-card hover:border-border-hover hover:bg-card-hover flex h-full flex-col rounded-lg border p-6 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-h3 font-semibold tracking-tight">
                  {project.name}
                </h3>
                <div className="text-foreground-subtle flex shrink-0 gap-2">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.name} on GitHub`}
                      className="hover:text-foreground transition-colors"
                    >
                      <GitBranch size={18} strokeWidth={1.7} />
                    </a>
                  ) : null}
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.name} demo`}
                      className="hover:text-foreground transition-colors"
                    >
                      <ArrowUpRight size={19} strokeWidth={1.7} />
                    </a>
                  ) : null}
                  {project.docker ? (
                    <a
                      href={project.docker}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.name} Docker image`}
                      className="hover:text-foreground transition-colors"
                    >
                      <Container size={19} strokeWidth={1.7} />
                    </a>
                  ) : null}
                </div>
              </div>

              <p className="text-foreground-muted mt-4 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-border text-foreground-subtle rounded-full border px-2.5 py-1 font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
