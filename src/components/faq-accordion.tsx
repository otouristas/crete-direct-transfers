import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqGroup } from "@/data/faqs";

export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="font-serif text-xl text-primary mb-4">{group.title}</h3>
          <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/60 overflow-hidden">
            {group.items.map((item, i) => {
              const id = `${group.title}-${i}`;
              const isOpen = open === id;
              return (
                <div key={id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-muted/40 transition"
                  >
                    <span className="font-medium text-foreground pr-4">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-accent" : "text-muted-foreground"}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
