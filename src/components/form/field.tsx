import type { ReactNode } from "react";

/** Label + control + error, matching the booking wizard's form idiom. */
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}

/** The `.input` styles used by book.tsx / contact-form.tsx — render once per page. */
export function InputStyles() {
  return (
    <style>{`
      .input {
        width: 100%;
        min-height: 46px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 15px;
        line-height: 1.3;
        outline: none;
      }
      select.input {
        appearance: none;
        -webkit-appearance: none;
        padding-right: 36px;
      }
      .input:focus { border-color: var(--accent); }
    `}</style>
  );
}
