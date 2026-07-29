"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Fixed top navigation.
 * - Transparent over the hero, picks up a blurred background once the
 *   page scrolls past a small threshold.
 * - Tracks which section is in view with IntersectionObserver and
 *   underlines the matching link.
 * - Collapses into a slide-down sheet on small screens.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#about");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = siteConfig.nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-border bg-background/80 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="text-foreground font-mono text-sm font-medium tracking-tight"
        >
          {siteConfig.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
          <span className="text-foreground-muted">.dev</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "relative py-1 text-sm transition-colors",
                  activeHref === item.href
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {item.label}
                {activeHref === item.href && (
                  <span className="bg-accent absolute inset-x-0 -bottom-[1px] h-px" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={siteConfig.links.resume}
            download
            className="bg-accent text-accent-foreground hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Resume
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-foreground rounded-md p-2 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-border bg-background/95 border-t backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-2 py-2.5 text-sm transition-colors",
                    activeHref === item.href
                      ? "text-foreground"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={siteConfig.links.resume}
                download
                className="bg-accent text-accent-foreground hover:bg-accent-hover block rounded-md px-4 py-2.5 text-center text-sm font-medium transition-colors"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
