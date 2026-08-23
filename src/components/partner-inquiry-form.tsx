import { useState } from "react";
import { z } from "zod";
import { useLocale, useT, type Locale } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

export type PartnerKind = "hotel" | "driver" | "travel_agency";

type Copy = {
  organization: string;
  location: string;
  website: string;
  registration: string;
  capacity: string;
  details: string;
  submit: string;
};

const COPY: Record<Locale, Record<PartnerKind, Copy>> = {
  en: {
    hotel: {
      organization: "Hotel or property name",
      location: "Property location",
      website: "Website (optional)",
      registration: "Property type (optional)",
      capacity: "Rooms and expected transfers per month",
      details: "Tell us about your guests and transfer needs",
      submit: "Request a hotel partnership",
    },
    driver: {
      organization: "Driver or company name",
      location: "Base city and service area",
      website: "Website (optional)",
      registration: "Professional licence or registration",
      capacity: "Vehicle, seats and luggage capacity",
      details: "Experience, languages and availability",
      submit: "Submit driver interest",
    },
    travel_agency: {
      organization: "Travel agency name",
      location: "Countries and destinations served",
      website: "Agency website (optional)",
      registration: "Registration or IATA number (optional)",
      capacity: "Estimated transfer bookings per month",
      details: "Tell us about your clients, groups and transfer needs",
      submit: "Request an agency partnership",
    },
  },
  el: {
    hotel: {
      organization: "Όνομα ξενοδοχείου ή καταλύματος",
      location: "Τοποθεσία καταλύματος",
      website: "Ιστοσελίδα (προαιρετικά)",
      registration: "Τύπος καταλύματος (προαιρετικά)",
      capacity: "Δωμάτια και αναμενόμενες μεταφορές ανά μήνα",
      details: "Πείτε μας για τους επισκέπτες και τις ανάγκες μεταφοράς",
      submit: "Αίτημα συνεργασίας ξενοδοχείου",
    },
    driver: {
      organization: "Όνομα οδηγού ή εταιρείας",
      location: "Έδρα και περιοχή εξυπηρέτησης",
      website: "Ιστοσελίδα (προαιρετικά)",
      registration: "Επαγγελματική άδεια ή αριθμός μητρώου",
      capacity: "Όχημα, θέσεις και χωρητικότητα αποσκευών",
      details: "Εμπειρία, γλώσσες και διαθεσιμότητα",
      submit: "Υποβολή ενδιαφέροντος οδηγού",
    },
    travel_agency: {
      organization: "Όνομα ταξιδιωτικού γραφείου",
      location: "Χώρες και προορισμοί εξυπηρέτησης",
      website: "Ιστοσελίδα γραφείου (προαιρετικά)",
      registration: "Αριθμός μητρώου ή IATA (προαιρετικά)",
      capacity: "Εκτιμώμενες κρατήσεις μεταφοράς ανά μήνα",
      details: "Πείτε μας για πελάτες, γκρουπ και ανάγκες μεταφοράς",
      submit: "Αίτημα συνεργασίας γραφείου",
    },
  },
  de: {
    hotel: {
      organization: "Name des Hotels oder der Unterkunft",
      location: "Standort der Unterkunft",
      website: "Website (optional)",
      registration: "Art der Unterkunft (optional)",
      capacity: "Zimmer und erwartete Transfers pro Monat",
      details: "Gästeprofil und Transferbedarf",
      submit: "Hotelpartnerschaft anfragen",
    },
    driver: {
      organization: "Name des Fahrers oder Unternehmens",
      location: "Standort und Einsatzgebiet",
      website: "Website (optional)",
      registration: "Gewerbliche Lizenz oder Registrierung",
      capacity: "Fahrzeug, Sitzplätze und Gepäckkapazität",
      details: "Erfahrung, Sprachen und Verfügbarkeit",
      submit: "Fahrerinteresse senden",
    },
    travel_agency: {
      organization: "Name des Reisebüros",
      location: "Bediente Länder und Reiseziele",
      website: "Agentur-Website (optional)",
      registration: "Registrierungs- oder IATA-Nummer (optional)",
      capacity: "Geschätzte Transferbuchungen pro Monat",
      details: "Kunden, Gruppen und Transferbedarf",
      submit: "Agenturpartnerschaft anfragen",
    },
  },
  fr: {
    hotel: {
      organization: "Nom de l’hôtel ou de l’hébergement",
      location: "Lieu de l’établissement",
      website: "Site web (facultatif)",
      registration: "Type d’établissement (facultatif)",
      capacity: "Chambres et transferts prévus par mois",
      details: "Décrivez vos clients et vos besoins de transfert",
      submit: "Demander un partenariat hôtelier",
    },
    driver: {
      organization: "Nom du chauffeur ou de l’entreprise",
      location: "Ville de base et zone desservie",
      website: "Site web (facultatif)",
      registration: "Licence professionnelle ou immatriculation",
      capacity: "Véhicule, sièges et capacité bagages",
      details: "Expérience, langues et disponibilités",
      submit: "Envoyer ma candidature chauffeur",
    },
    travel_agency: {
      organization: "Nom de l’agence de voyages",
      location: "Pays et destinations desservis",
      website: "Site de l’agence (facultatif)",
      registration: "Numéro d’immatriculation ou IATA (facultatif)",
      capacity: "Réservations de transferts estimées par mois",
      details: "Décrivez vos clients, groupes et besoins",
      submit: "Demander un partenariat agence",
    },
  },
  it: {
    hotel: {
      organization: "Nome dell’hotel o struttura",
      location: "Località della struttura",
      website: "Sito web (facoltativo)",
      registration: "Tipo di struttura (facoltativo)",
      capacity: "Camere e transfer previsti al mese",
      details: "Ospiti e necessità di transfer",
      submit: "Richiedi partnership hotel",
    },
    driver: {
      organization: "Nome autista o azienda",
      location: "Città base e area operativa",
      website: "Sito web (facoltativo)",
      registration: "Licenza professionale o registrazione",
      capacity: "Veicolo, posti e bagagli",
      details: "Esperienza, lingue e disponibilità",
      submit: "Invia interesse autista",
    },
    travel_agency: {
      organization: "Nome agenzia di viaggi",
      location: "Paesi e destinazioni serviti",
      website: "Sito agenzia (facoltativo)",
      registration: "Registrazione o numero IATA (facoltativo)",
      capacity: "Transfer stimati al mese",
      details: "Clienti, gruppi e necessità di transfer",
      submit: "Richiedi partnership agenzia",
    },
  },
  nl: {
    hotel: {
      organization: "Naam hotel of accommodatie",
      location: "Locatie accommodatie",
      website: "Website (optioneel)",
      registration: "Type accommodatie (optioneel)",
      capacity: "Kamers en verwachte transfers per maand",
      details: "Gasten en transferbehoeften",
      submit: "Hotelpartnerschap aanvragen",
    },
    driver: {
      organization: "Naam chauffeur of bedrijf",
      location: "Standplaats en werkgebied",
      website: "Website (optioneel)",
      registration: "Beroepsvergunning of registratie",
      capacity: "Voertuig, zitplaatsen en bagage",
      details: "Ervaring, talen en beschikbaarheid",
      submit: "Interesse als chauffeur indienen",
    },
    travel_agency: {
      organization: "Naam reisbureau",
      location: "Landen en bestemmingen",
      website: "Website reisbureau (optioneel)",
      registration: "Registratie- of IATA-nummer (optioneel)",
      capacity: "Geschatte transfers per maand",
      details: "Klanten, groepen en transferbehoeften",
      submit: "Reisbureaupartnerschap aanvragen",
    },
  },
  es: {
    hotel: {
      organization: "Nombre del hotel o alojamiento",
      location: "Ubicación del alojamiento",
      website: "Web (opcional)",
      registration: "Tipo de alojamiento (opcional)",
      capacity: "Habitaciones y traslados previstos al mes",
      details: "Huéspedes y necesidades de traslado",
      submit: "Solicitar colaboración hotelera",
    },
    driver: {
      organization: "Nombre del conductor o empresa",
      location: "Ciudad base y área de servicio",
      website: "Web (opcional)",
      registration: "Licencia profesional o registro",
      capacity: "Vehículo, plazas y equipaje",
      details: "Experiencia, idiomas y disponibilidad",
      submit: "Enviar interés como conductor",
    },
    travel_agency: {
      organization: "Nombre de la agencia de viajes",
      location: "Países y destinos atendidos",
      website: "Web de la agencia (opcional)",
      registration: "Registro o número IATA (opcional)",
      capacity: "Traslados estimados al mes",
      details: "Clientes, grupos y necesidades de traslado",
      submit: "Solicitar colaboración con agencia",
    },
  },
};

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  location: "",
  website: "",
  registration: "",
  capacity: "",
  details: "",
};

export function PartnerInquiryForm({ kind }: { kind: PartnerKind }) {
  const t = useT();
  const copy = COPY[useLocale()][kind];
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const schema = z.object({
    name: z.string().trim().min(2, t.forms.validationName).max(100),
    email: z.string().trim().email(t.forms.validationEmail).max(255),
    phone: z.string().trim().max(30).optional(),
    organization: z.string().trim().min(2, t.forms.validationMessage).max(150),
    location: z.string().trim().min(2, t.forms.validationMessage).max(200),
    website: z.string().trim().max(300).optional(),
    registration: z.string().trim().max(150).optional(),
    capacity: z.string().trim().min(2, t.forms.validationMessage).max(250),
    details: z.string().trim().min(10, t.forms.validationMessage).max(2000),
  });

  const set = (key: keyof typeof EMPTY, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[issue.path.join(".")] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setState("sending");
    const data = parsed.data;
    const message = [
      `${copy.location}: ${data.location}`,
      data.website ? `${copy.website}: ${data.website}` : null,
      data.registration ? `${copy.registration}: ${data.registration}` : null,
      `${copy.capacity}: ${data.capacity}`,
      `${copy.details}: ${data.details}`,
    ]
      .filter(Boolean)
      .join("\n");
    const { error } = await supabase.from("contact_messages").insert({
      topic: kind,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.organization,
      message,
    });
    if (error) {
      setState("error");
      return;
    }
    setValues(EMPTY);
    setState("sent");
  };

  if (state === "sent")
    return (
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground" role="status">
        <div className="text-xs uppercase tracking-widest text-accent">{t.forms.messageSent}</div>
        <div className="mt-2 font-display text-2xl">{t.forms.thankYou}</div>
        <p className="mt-3 text-sm text-primary-foreground/80">{t.forms.replyHours}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-accent underline underline-offset-4"
        >
          {t.forms.sendAnother}
        </button>
      </div>
    );

  const input =
    "w-full rounded-[10px] border border-border bg-transparent px-[13px] py-[11px] text-[15px] outline-none focus:border-accent";
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.forms.name} error={errors.name}>
          <input
            autoComplete="name"
            className={input}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label={t.forms.email} error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            className={input}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.forms.phoneOptional} error={errors.phone}>
          <input
            type="tel"
            autoComplete="tel"
            className={input}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label={copy.organization} error={errors.organization}>
          <input
            autoComplete="organization"
            className={input}
            value={values.organization}
            onChange={(e) => set("organization", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={copy.location} error={errors.location}>
          <input
            className={input}
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </Field>
        <Field label={copy.website} error={errors.website}>
          <input
            type="url"
            inputMode="url"
            className={input}
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={copy.registration} error={errors.registration}>
          <input
            className={input}
            value={values.registration}
            onChange={(e) => set("registration", e.target.value)}
          />
        </Field>
        <Field label={copy.capacity} error={errors.capacity}>
          <input
            className={input}
            value={values.capacity}
            onChange={(e) => set("capacity", e.target.value)}
          />
        </Field>
      </div>
      <Field label={copy.details} error={errors.details}>
        <textarea
          className={`${input} min-h-32`}
          value={values.details}
          onChange={(e) => set("details", e.target.value)}
        />
      </Field>
      {state === "error" && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {t.auth.unexpectedError}
        </div>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {state === "sending" ? t.forms.sending : copy.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
      {label}
      <span className="mt-1 block normal-case tracking-normal text-foreground">{children}</span>
      {error && (
        <span className="mt-1 block text-xs normal-case tracking-normal text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
