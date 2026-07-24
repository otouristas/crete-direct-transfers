import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

export type InpageNavItem = {
  id: string;
  label: string;
  cta?: boolean;
};

export function InpageNav({ items }: { items: InpageNavItem[] }) {
  const t = useT();
  const [activeId, setActiveId] = useState(items.find((i) => !i.cta)?.id ?? items[0]?.id ?? "");
  const underlineRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target?.id;
        if (id) setActiveId(id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const link = linkRefs.current.get(activeId);
    const underline = underlineRef.current;
    const nav = navRef.current;
    const wrapper = wrapperRef.current;
    if (!underline || !nav) return;

    const activeItem = items.find((i) => i.id === activeId);
    if (!link || activeItem?.cta) {
      underline.style.width = "0px";
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - navRect.left + nav.scrollLeft;
    underline.style.width = `${linkRect.width}px`;
    underline.style.transform = `translateX(${left}px)`;

    if (wrapper) {
      const wrapRect = wrapper.getBoundingClientRect();
      const target = link.offsetLeft - wrapRect.width / 2 + link.offsetWidth / 2;
      wrapper.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [activeId, items]);

  return (
    <nav
      className="sticky top-16 z-[30] border-y border-border bg-background/95 shadow-sm backdrop-blur transition-shadow"
      aria-label={t.inpageNav.ariaLabel}
      id="inpage-nav-bar"
    >
      <div className="mx-auto flex flex-col gap-2 px-4 py-3 text-sm sm:px-6 sm:py-4 lg:max-w-7xl">
        <div
          ref={wrapperRef}
          className="inpage-hide-scroll relative -mx-4 mt-1 overflow-x-auto px-4"
        >
          <ul ref={navRef} className="relative flex min-w-max gap-2 sm:gap-3">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const isCta = Boolean(item.cta);
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    ref={(el) => {
                      if (el) linkRefs.current.set(item.id, el);
                      else linkRefs.current.delete(item.id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative inline-flex items-center rounded-full px-3 py-2 font-medium transition focus:outline-none focus-visible:ring-2 sm:px-4",
                      isCta
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary"
                        : isActive
                          ? "font-bold text-highlight focus-visible:ring-highlight"
                          : "text-slate-600 hover:text-highlight focus-visible:ring-highlight",
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      {isCta && <Zap className="h-3 w-3 opacity-90" aria-hidden />}
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
            <span
              ref={underlineRef}
              id="inpage-active-underline"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-highlight transition-all duration-300"
              aria-hidden
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}
