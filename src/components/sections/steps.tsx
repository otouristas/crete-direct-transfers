import { useT } from "@/i18n";

export function Steps() {
  const t = useT();
  const steps = [
    { title: t.steps.step1Title, body: t.steps.step1Body },
    { title: t.steps.step2Title, body: t.steps.step2Body },
    { title: t.steps.step3Title, body: t.steps.step3Body },
  ];
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-6">
      {steps.map((step, i) => (
        <div key={step.title} className="relative">
          {i < steps.length - 1 && (
            <div className="absolute left-full top-6 hidden h-px w-6 -translate-x-3 bg-border md:block" />
          )}
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-display text-primary-foreground">
            {i + 1}
          </span>
          <h3 className="mt-4 text-lg font-display text-primary">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
