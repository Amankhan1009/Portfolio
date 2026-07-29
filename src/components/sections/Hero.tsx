"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Brand marks aren't in lucide's icon set — inline as small SVGs instead. */
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

/**
 * Hero section — the page's thesis statement.
 *
 * Signature moment: a soft accent-colored glow that follows the cursor
 * behind the headline (desktop only, disabled under prefers-reduced-motion),
 * paired with the three role badges auto-cycling a highlighted state so the
 * "AI Engineer → Platform Engineer → DevOps Engineer" identity reads at a
 * glance without a typewriter effect.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [activeRole, setActiveRole] = useState(0);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(glowY, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      glowX.set(e.clientX - rect.left);
      glowY.set(e.clientY - rect.top);
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reducedMotion, glowX, glowY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((i) => (i + 1) % siteConfig.roles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%)`,
          }}
        />
      )}

      {/* Ambient center glow, always present, gives the section depth even
          before the cursor moves / on touch devices */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <h1 className="text-display leading-[1.05] font-semibold tracking-tight">
          {siteConfig.name}
        </h1>

        <p className="text-foreground-muted max-w-xl text-lg">
          {siteConfig.tagline}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {siteConfig.roles.map((role, i) => (
            <span
              key={role}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors duration-500",
                i === activeRole
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-card text-foreground-muted",
              )}
            >
              {role}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="bg-accent text-accent-foreground hover:bg-accent-hover rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="border-border text-foreground hover:border-border-hover hover:bg-card rounded-md border px-6 py-3 text-sm font-medium transition-colors"
          >
            Get in Touch
          </a>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="text-foreground-subtle hover:text-foreground-muted absolute bottom-8 left-1/2 -translate-x-1/2 transition-colors motion-safe:animate-bounce"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
