import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Navigation, ShieldCheck } from "lucide-react";
import { useLocale } from "@/i18n";

const copy = {
  en: [
    "ONE JOURNEY. TWO CONNECTED APPS.",
    "Beautiful arrivals start with a little connection.",
    "One app for your holiday. One for the person getting you there. Explore both sides of a smoother transfer.",
    "Meet the apps",
    "For travelers",
    "For drivers",
  ],
  el: [
    "ΜΙΑ ΔΙΑΔΡΟΜΗ. ΔΥΟ ΕΦΑΡΜΟΓΕΣ.",
    "Κάθε όμορφη άφιξη ξεκινά με μια σύνδεση.",
    "Μια εφαρμογή για το ταξίδι σας. Μια για τον άνθρωπο που σας μεταφέρει. Γνωρίστε και τις δύο πλευρές της διαδρομής.",
    "Γνωρίστε τις εφαρμογές",
    "Για ταξιδιώτες",
    "Για οδηγούς",
  ],
  de: [
    "EINE REISE. ZWEI VERBUNDENE APPS.",
    "Eine schöne Ankunft beginnt mit einer Verbindung.",
    "Eine App für Ihre Reise. Eine für Ihren Fahrer. Entdecken Sie beide Seiten eines entspannten Transfers.",
    "Apps entdecken",
    "Für Reisende",
    "Für Fahrer",
  ],
  fr: [
    "UN TRAJET. DEUX APPS CONNECTÉES.",
    "Une belle arrivée commence par une connexion.",
    "Une application pour votre voyage. Une pour votre chauffeur. Découvrez les deux côtés d’un transfert serein.",
    "Découvrir les apps",
    "Pour les voyageurs",
    "Pour les chauffeurs",
  ],
  it: [
    "UN VIAGGIO. DUE APP CONNESSE.",
    "Un bell’arrivo inizia con una connessione.",
    "Un’app per il tuo viaggio. Una per il tuo autista. Scopri entrambi i lati di un trasferimento sereno.",
    "Scopri le app",
    "Per i viaggiatori",
    "Per gli autisti",
  ],
  es: [
    "UN VIAJE. DOS APPS CONECTADAS.",
    "Una bonita llegada empieza con una conexión.",
    "Una app para tu viaje. Otra para tu conductor. Descubre ambos lados de un traslado tranquilo.",
    "Conoce las apps",
    "Para viajeros",
    "Para conductores",
  ],
  nl: [
    "ÉÉN REIS. TWEE VERBONDEN APPS.",
    "Een mooie aankomst begint met verbinding.",
    "Een app voor je reis. Een voor je chauffeur. Ontdek beide kanten van een ontspannen transfer.",
    "Ontdek de apps",
    "Voor reizigers",
    "Voor chauffeurs",
  ],
};
export function AppsShowcase() {
  const [label, title, body, cta, rider, driver] = copy[useLocale()];
  return (
    <section className="bg-[#EBEDF2] px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[.2em] text-[#404B65]">{label}</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-[#101114]">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#6B7181]">{body}</p>
          <Link
            to="/{-$locale}/apps"
            className="mt-7 inline-flex items-center gap-10 rounded-full bg-[#101114] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#245BEB]"
          >
            {cta}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 py-5">
          <div className="rounded-[1.7rem] border border-[#D7DBE5] bg-white p-5 shadow-xl shadow-[#101114]/5 sm:p-7">
            <Navigation size={22} className="text-[#245BEB]" />
            <p className="mt-8 text-xs text-[#70788E]">01 / TRAVELER</p>
            <h3 className="mt-2 text-lg text-[#101114]">{rider}</h3>
            <div className="mt-5 h-20 overflow-hidden rounded-xl bg-[#E7E9EF]">
              <svg viewBox="0 0 220 90" className="h-full w-full" aria-hidden="true">
                <path
                  d="M0 65L80 22L145 54L220 13M40 0L90 90M160 0L130 90"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                />
                <path
                  d="M35 64L80 42L133 55L184 29"
                  stroke="#245BEB"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="35" cy="64" r="6" fill="#101114" />
                <circle cx="184" cy="29" r="6" fill="#245BEB" />
              </svg>
            </div>
            <Check size={16} className="mt-5 text-[#245BEB]" />
          </div>
          <div className="translate-y-6 rounded-[1.7rem] bg-[#101114] p-5 text-white shadow-xl shadow-[#101114]/10 sm:p-7">
            <Navigation size={22} className="text-[#DDE7FF]" />
            <p className="mt-8 text-xs text-[#969EB4]">02 / DRIVER</p>
            <h3 className="mt-2 text-lg">{driver}</h3>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/15 p-4">
              <ShieldCheck size={25} className="text-[#DDE7FF]" />
              <span className="h-5 w-10 rounded-full bg-[#DDE7FF] p-0.5">
                <span className="ml-auto block h-4 w-4 rounded-full bg-[#101114]" />
              </span>
            </div>
            <p className="mt-6 text-[10px] tracking-widest text-[#ADB5C8]">TRANSFERAROUND</p>
          </div>
        </div>
      </div>
    </section>
  );
}
