import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});

export function ContactForm({
  topic,
  showCompany = false,
  submitLabel = "Send message",
  placeholder,
}: {
  topic: "general" | "hotel" | "driver";
  showCompany?: boolean;
  submitLabel?: string;
  placeholder?: string;
}) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    const { error } = await supabase.from("contact_messages").insert({
      topic,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      message: parsed.data.message,
    });
    if (error) {
      setErrorMsg(error.message);
      setState("error");
      return;
    }
    setState("sent");
    setValues({ name: "", email: "", phone: "", company: "", message: "" });
  };

  if (state === "sent") {
    return (
      <div className="rounded-2xl bg-primary text-primary-foreground p-8">
        <div className="text-xs uppercase tracking-widest text-accent">Message sent</div>
        <div className="mt-2 font-serif text-2xl">Thank you.</div>
        <p className="mt-3 text-primary-foreground/80 text-sm">
          We reply within a few hours during Crete business hours (08:00 – 22:00 EET).
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-sm underline underline-offset-4 text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input className="cf-input" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" className="cf-input" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone (optional)" error={errors.phone}>
          <input className="cf-input" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
        </Field>
        {showCompany && (
          <Field label="Hotel / company (optional)" error={errors.company}>
            <input className="cf-input" value={values.company} onChange={(e) => setValues({ ...values, company: e.target.value })} />
          </Field>
        )}
      </div>
      <Field label="Message" error={errors.message}>
        <textarea
          className="cf-input min-h-32"
          placeholder={placeholder}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
        />
      </Field>
      {state === "error" && errorMsg && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{errorMsg}</div>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-accent px-6 py-3 text-accent-foreground text-sm hover:opacity-90 disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : submitLabel}
      </button>

      <style>{`
        .cf-input {
          width: 100%;
          background: transparent;
          border: 1px solid oklch(0.88 0.01 85);
          border-radius: 10px;
          padding: 11px 13px;
          font-size: 15px;
          outline: none;
        }
        .cf-input:focus { border-color: oklch(0.58 0.14 42); }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
