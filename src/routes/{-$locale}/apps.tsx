import { Logo } from "@/components/logo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  FlaskConical,
  Globe2,
  Loader2,
  MapPin,
  Navigation,
  Plane,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { buildHead } from "@/lib/seo";
import { usePractice } from "@/components/practice/use-practice";
import {
  PRACTICE_ROUTES,
  PRACTICE_VEHICLES,
  practiceFare,
  type PracticeTrip,
} from "../../../packages/mobile-shared/src/practice";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import "@/components/practice/practice.css";

export const Route = createFileRoute("/{-$locale}/apps")({
  head: ({ params }) =>
    buildHead({
      locale: (params.locale ?? "en") as Locale,
      path: "/apps",
      title: "Meet your next smooth arrival | TransferAround",
      description:
        "Explore TransferAround for travelers and drivers. Try a connected practice trip, from booking to arrival.",
      noindex: true,
    }),
  component: AppsPage,
});

const money = (cents: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
const statusLabel = {
  pending: "Finding your driver",
  claimed: "Your driver is confirmed",
  en_route: "Nikos is on the way",
  completed: "You have arrived. Enjoy Crete.",
  cancelled: "Practice trip cancelled",
};

function JourneyMap({ moving = false }: { moving?: boolean }) {
  return (
    <div className="practice-map" aria-label="Illustrated practice route in Crete">
      <svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
        <path
          d="M0 0H400V132C341 136 357 183 310 190C267 197 235 160 197 182C155 206 160 250 90 260H0Z"
          fill="#E8EAEF"
        />
        <g stroke="#fff" strokeWidth="9">
          <path d="M-20 53L420 100M-20 134L340 153M60-20L99 280M160-20L194 280M292-20L238 250" />
          <path d="M0 212L310 0M44 0L310 217" />
        </g>
        <g stroke="#D2D5DE" strokeWidth="1">
          <path d="M-20 53L420 100M-20 134L340 153M60-20L99 280M160-20L194 280M292-20L238 250" />
        </g>
        <path
          d="M284 72L243 89L204 126L157 119L111 166"
          stroke="#101114"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M284 72L243 89L204 126L157 119L111 166"
          stroke="#245BEB"
          strokeWidth="2"
          strokeDasharray="4 7"
          className={moving ? "practice-route-moving" : ""}
        />
        <circle cx="284" cy="72" r="11" fill="#101114" stroke="white" strokeWidth="4" />
        <circle cx="111" cy="166" r="11" fill="#245BEB" stroke="white" strokeWidth="4" />
        <rect
          x={moving ? 176 : 240}
          y={moving ? 105 : 71}
          width="34"
          height="34"
          rx="12"
          fill="white"
          stroke="#101114"
          strokeWidth="2"
        />
        <path d={moving ? "M186 127l7-14 7 14-7-3z" : "M250 93l7-14 7 14-7-3z"} fill="#101114" />
        <text x="302" y="65" fill="#5F6574" fontSize="10" fontFamily="Inter">
          AIRPORT
        </text>
        <text x="45" y="190" fill="#5F6574" fontSize="10" fontFamily="Inter">
          OLD TOWN
        </text>
        <text x="290" y="232" fill="#576589" fontSize="11" fontFamily="Inter" letterSpacing="2">
          SEA OF CRETE
        </text>
      </svg>
      <span className="practice-map-tag">
        <MapPin size={11} /> Crete, Greece <span>Illustrated route</span>
      </span>
    </div>
  );
}

function RouteRail({ from, to }: { from: string; to: string }) {
  return (
    <div className="practice-rail">
      <span className="practice-rail-line" />
      <div>
        <span className="practice-rail-dot" />
        <p>
          <small>Pickup</small>
          {from}
        </p>
      </div>
      <div>
        <MapPin size={15} />
        <p>
          <small>Destination</small>
          {to}
        </p>
      </div>
    </div>
  );
}
function PhoneHeader({ driver = false }: { driver?: boolean }) {
  return (
    <div className="practice-phone-header">
      <span className="practice-wordmark">
        <Logo className="[&>img]:h-7 [&>img]:w-7 [&>span]:text-base" />
      </span>
      {driver && <span className="practice-driver-label">DRIVER</span>}
      <span className="practice-avatar">{driver ? "N" : "A"}</span>
    </div>
  );
}
function PhoneNav({ driver = false }: { driver?: boolean }) {
  return (
    <div className="practice-phone-nav" aria-hidden="true">
      <span className="active">
        <Navigation size={18} />
        {driver ? "Drive" : "Book"}
      </span>
      <span>
        <Car size={18} />
        {driver ? "My jobs" : "My trips"}
      </span>
      <span>
        <Users size={18} />
        Account
      </span>
    </div>
  );
}

function AppsPage() {
  const { state, token, busy, error, act, reconnect } = usePractice();
  const [routeId, setRouteId] = useState<string>(PRACTICE_ROUTES[0].id);
  const [vehicle, setVehicle] = useState<string>("comfort");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"both" | "rider" | "driver">("both");
  const trip = state.trip;
  const active = trip && !["completed", "cancelled"].includes(trip.status);
  const route = PRACTICE_ROUTES.find((r) => r.id === routeId)!;
  const selected = PRACTICE_VEHICLES.find((v) => v.id === vehicle)!;
  const assigned = trip && ["claimed", "en_route", "completed"].includes(trip.status);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="practice-page">
      <section className="practice-intro">
        <div className="practice-eyebrow">
          <span /> TWO APPS. ONE BEAUTIFUL JOURNEY.
        </div>
        <h1>
          A smoother arrival.
          <br />
          <em>On both sides of the ride.</em>
        </h1>
        <p>
          For the traveler ready to switch off. For the driver ready to go.
          <br className="hidden sm:block" /> Meet the two sides of TransferAround, connected in real
          time.
        </p>
        <a className="practice-intro-cta" href="#practice">
          <span>Take it for a spin</span>
          <ArrowDown size={17} />
        </a>
        <div className="practice-intro-meta">
          <span>
            <ShieldCheck size={15} /> Private transfers
          </span>
          <span>
            <Globe2 size={15} /> Made for the journey
          </span>
          <span>
            <Smartphone size={15} /> Traveler + Driver
          </span>
        </div>
        <div className="practice-orbit" aria-hidden="true">
          <span />
          <span />
          <Navigation size={60} />
        </div>
      </section>

      <section id="practice" className="practice-stage">
        <div className="practice-stage-heading">
          <div>
            <div className="practice-eyebrow">
              <FlaskConical size={13} /> THE PRACTICE STUDIO
            </div>
            <h2>Try a journey. See it happen.</h2>
            <p>Book on the left. Go online and accept on the right. Follow every step.</p>
          </div>
          <span className="practice-sandbox">
            <span /> Practice only · no charges
          </span>
        </div>
        <div className="practice-toolbar">
          <div role="group" aria-label="Choose app view">
            {(["both", "rider", "driver"] as const).map((v) => (
              <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>
                {v === "both" ? "Both apps" : v === "rider" ? "Traveler" : "Driver"}
              </button>
            ))}
          </div>
          <div>
            <button disabled={!token} onClick={share}>
              <Copy size={14} />
              {copied ? "Link copied" : "Share session"}
            </button>
            <button
              disabled={busy || !token}
              onClick={() => void act("reset")}
              aria-label="Reset practice session"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Start over</span>
            </button>
          </div>
        </div>
        {error && (
          <div className="practice-error" role="alert">
            {error}
            <button onClick={() => void reconnect(true)}>
              New session <ArrowRight size={14} />
            </button>
          </div>
        )}
        <div className={cn("practice-phones", view !== "both" && "practice-single")}>
          {view !== "driver" && (
            <div className="practice-device-column">
              <div className="practice-device-label">
                <span>01 / THE TRAVELER</span>
                <span>
                  Arrive happy <Sparkles size={13} />
                </span>
              </div>
              <div className="practice-phone" data-testid="rider-app">
                <PhoneHeader />
                <div className="practice-phone-scroll">
                  <JourneyMap moving={trip?.status === "en_route"} />
                  <div className="practice-sheet">
                    <div className="practice-handle" />
                    {active || trip?.status === "completed" ? (
                      <>
                        <div className="practice-small-label">YOUR JOURNEY</div>
                        <h3 aria-live="polite">{statusLabel[trip.status]}</h3>
                        <div className="practice-status-steps">
                          {["pending", "claimed", "en_route", "completed"].map((s, i) => (
                            <span
                              key={s}
                              className={
                                i <=
                                ["pending", "claimed", "en_route", "completed"].indexOf(trip.status)
                                  ? "done"
                                  : ""
                              }
                            />
                          ))}
                        </div>
                        {assigned ? (
                          <div className="practice-driver-card">
                            <span className="practice-avatar">N</span>
                            <div>
                              <strong>
                                Nikos{" "}
                                <span>
                                  <Star size={11} fill="currentColor" /> 4.9
                                </span>
                              </strong>
                              <p>
                                {trip.vehicleName} · {trip.plate}
                              </p>
                            </div>
                            <ShieldCheck size={22} />
                          </div>
                        ) : (
                          <div className="practice-matching">
                            <span className="practice-pulse" />
                            <span>
                              {state.online
                                ? "Your request is waiting in the Driver app."
                                : "Your request is ready. Put the driver online."}
                            </span>
                          </div>
                        )}
                        <RouteRail from={trip.from} to={trip.to} />
                        <div className="practice-receipt">
                          <span>Practice fare · 2 passengers</span>
                          <strong>{money(trip.priceCents)}</strong>
                        </div>
                        {trip.status === "completed" ? (
                          <div className="practice-arrived">
                            <CheckCircle2 size={22} />
                            <p>
                              Less planning. More living.
                              <small>This was a simulated trip. No payment was taken.</small>
                            </p>
                          </div>
                        ) : (
                          ["pending", "claimed"].includes(trip.status) && (
                            <button
                              className="practice-text-button"
                              disabled={busy}
                              onClick={() => void act("cancel")}
                            >
                              Cancel practice trip
                            </button>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        <div className="practice-small-label">YOUR HOLIDAY STARTS HERE</div>
                        <h3>Where are we taking you?</h3>
                        {trip?.status === "cancelled" && (
                          <p className="practice-cancelled">
                            <Check size={13} /> Cancelled. Ready when you are.
                          </p>
                        )}
                        <label className="practice-route-select">
                          Choose your practice route
                          <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                            {PRACTICE_ROUTES.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.from} → {r.to}
                              </option>
                            ))}
                          </select>
                        </label>
                        <RouteRail from={route.from} to={route.to} />
                        <div className="practice-trip-meta">
                          <span>
                            <Plane size={13} /> Tomorrow · private transfer
                          </span>
                          <span>
                            <Users size={13} /> 2 travelers
                          </span>
                        </div>
                        <div className="practice-vehicles" role="group" aria-label="Choose vehicle">
                          {PRACTICE_VEHICLES.map((v) => (
                            <button
                              key={v.id}
                              aria-pressed={vehicle === v.id}
                              onClick={() => setVehicle(v.id)}
                            >
                              <img src={`/fleet/${v.id}.jpg`} alt="" />
                              <span>
                                <strong>{v.name}</strong>
                                <small>{v.seats} seats</small>
                              </span>
                              <b>{money(practiceFare(route.baseCents, v.multiplier))}</b>
                              {vehicle === v.id && <CheckCircle2 size={15} />}
                            </button>
                          ))}
                        </div>
                        <button
                          className="practice-primary"
                          disabled={busy || !token}
                          onClick={() => void act("request", { route: routeId, vehicle })}
                        >
                          {busy ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <>
                              Request practice ride{" "}
                              <span>
                                {money(practiceFare(route.baseCents, selected.multiplier))}
                                <ArrowRight size={16} />
                              </span>
                            </>
                          )}
                        </button>
                        <p className="practice-fine">
                          A fictional journey. A real feel for how it works.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <PhoneNav />
              </div>
            </div>
          )}

          {view === "both" && (
            <div className="practice-connection" aria-hidden="true">
              <span />
              <span>
                <ArrowRight size={18} />
              </span>
              <span />
              <small>in sync</small>
            </div>
          )}

          {view !== "rider" && (
            <div className="practice-device-column">
              <div className="practice-device-label">
                <span>02 / THE DRIVER</span>
                <span>Your road. Your rhythm.</span>
              </div>
              <div className="practice-phone practice-driver-phone" data-testid="driver-app">
                <PhoneHeader driver />
                <div className="practice-phone-scroll">
                  <div className="practice-driver-greeting">
                    <div className="practice-small-label">GOOD TO SEE YOU, NIKOS</div>
                    <h3>
                      Make every arrival
                      <br />a good one.
                    </h3>
                    <div className="practice-availability">
                      <span>
                        <i className={state.online ? "online" : ""} />
                        {state.online ? "You’re online" : "You’re offline"}
                        <small>
                          {state.online
                            ? "Ready for your next journey"
                            : "Go online to receive requests"}
                        </small>
                      </span>
                      <button
                        role="switch"
                        aria-checked={state.online}
                        aria-label="Driver online"
                        disabled={busy || !token}
                        onClick={() => void act(state.online ? "offline" : "online")}
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                  <div className="practice-driver-body">
                    {trip && active && (state.online || trip.status !== "pending") ? (
                      <div className="practice-offer">
                        <div className="practice-offer-top">
                          <span>
                            <span />
                            {trip.status === "pending"
                              ? "NEW PRACTICE REQUEST"
                              : "YOUR ACTIVE JOURNEY"}
                          </span>
                          <span>Private transfer</span>
                        </div>
                        <div className="practice-offer-fare">
                          <div>
                            <small>Your practice earnings</small>
                            <strong>{money(Math.round(trip.priceCents * 0.85))}</strong>
                          </div>
                          <span>
                            85% of {money(trip.priceCents)}
                            <small>Practice illustration</small>
                          </span>
                        </div>
                        <RouteRail from={trip.from} to={trip.to} />
                        <div className="practice-customer">
                          <span className="practice-avatar">A</span>
                          <div>
                            <strong>{trip.customerName}</strong>
                            <p>2 travelers · {trip.vehicleName}</p>
                          </div>
                          <Users size={18} />
                        </div>
                        <button
                          className="practice-primary"
                          disabled={busy}
                          onClick={() =>
                            void act(
                              trip.status === "pending"
                                ? "accept"
                                : trip.status === "claimed"
                                  ? "start"
                                  : "complete",
                            )
                          }
                        >
                          {trip.status === "pending"
                            ? "Accept practice ride"
                            : trip.status === "claimed"
                              ? "Start driving to pickup"
                              : "Complete practice trip"}
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    ) : trip?.status === "completed" ? (
                      <div className="practice-driver-complete">
                        <div>
                          <CheckCircle2 size={35} />
                        </div>
                        <div className="practice-small-label">ANOTHER HAPPY ARRIVAL</div>
                        <h3>Beautifully done.</h3>
                        <p>One journey. Two connected experiences.</p>
                        <strong>
                          {money(Math.round(trip.priceCents * 0.85))}
                          <small>Illustrative earnings · no payout</small>
                        </strong>
                        <button
                          className="practice-primary"
                          disabled={busy}
                          onClick={() => void act("reset")}
                        >
                          Try another journey <RotateCcw size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <JourneyMap />
                        <div className="practice-driver-empty">
                          <span>
                            <Navigation size={25} />
                          </span>
                          <h4>
                            {state.online ? "Ready for a great day." : "Your next journey awaits."}
                          </h4>
                          <p>
                            {state.online
                              ? "Request a ride in the Traveler app. It will appear right here."
                              : "Switch on your availability, then request a practice ride in the Traveler app."}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="practice-driver-note">
                      <ShieldCheck size={17} />
                      <p>
                        Your practice space
                        <small>Fictional traveler. No real dispatch or payment.</small>
                      </p>
                    </div>
                  </div>
                </div>
                <PhoneNav driver />
              </div>
            </div>
          )}
        </div>
        <div className="practice-live">
          <div>
            <span className={token ? "practice-live-dot" : ""} />
            <strong>{token ? "Connected practice session" : "Connecting your apps…"}</strong>
            <span>Works across devices · expires in 2 hours</span>
          </div>
          <p>
            Open the shared link on a second screen, or paste the session code into either mobile
            app.
          </p>
          {token && (
            <details>
              <summary>Mobile app session code</summary>
              <code>{token}</code>
            </details>
          )}
        </div>
        <div className="practice-timeline" aria-live="polite">
          <div className="practice-small-label">THE JOURNEY, AS IT HAPPENS</div>
          {state.events.length ? (
            <ol>
              {state.events.slice(-5).map((event, i) => (
                <li key={`${event.at}-${i}`}>
                  <CheckCircle2 size={15} />
                  <span>{event.label}</span>
                  <time>
                    {new Date(event.at).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </li>
              ))}
            </ol>
          ) : (
            <p>Your first move starts the story. Put the driver online and request a ride.</p>
          )}
        </div>
      </section>
      <section className="practice-outro">
        <span className="practice-eyebrow">LESS FRICTION. MORE FREEDOM.</span>
        <h2>
          The holiday feeling.
          <br />
          <em>From the very first mile.</em>
        </h2>
        <p>When you’re ready for the real journey, your transfer is just a few taps away.</p>
        <Link to="/{-$locale}/book" className="practice-primary">
          Plan your actual transfer <ArrowUpRight size={18} />
        </Link>
        <span>Practice mode never creates a real booking.</span>
      </section>
    </div>
  );
}
