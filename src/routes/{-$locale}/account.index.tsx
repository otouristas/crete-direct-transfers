import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { dateFnsLocale } from "@/lib/date-locale";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleX,
  Clock,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getDict, useLocale, useT } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { myBookingsQuery, type Booking } from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookingCtaBand } from "@/components/account/booking-cta-band";
import { AccountAppDownload } from "@/components/account/account-app-download";
import { NextTransferCard } from "@/components/account/next-transfer-card";
import { getRoute } from "@/data/routes";
import { useMoney } from "@/hooks/use-currency";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/account/")({
  component: MyBookingsPage,
});

type StatusTab = "upcoming" | "completed" | "canceled";
type SortKey = "upcoming" | "newest" | "oldest";

const TERMINAL_DONE = new Set(["completed", "no_show"]);
const PAGE_SIZES = [10, 20, 50] as const;

function bookingLabel(b: Booking): string {
  const route = getRoute(b.route_slug);
  if (route) return `${route.from} → ${route.to}`;
  if (b.pickup_address && b.dropoff_address) return `${b.pickup_address} → ${b.dropoff_address}`;
  if (b.pickup_address) return b.pickup_address;
  return b.route_slug;
}

function isUpcoming(b: Booking, now: number): boolean {
  return (
    new Date(b.pickup_at).getTime() >= now &&
    !TERMINAL_DONE.has(b.status) &&
    b.status !== "cancelled"
  );
}

function isCanceled(b: Booking): boolean {
  return b.status === "cancelled";
}

function isCompleted(b: Booking, now: number): boolean {
  if (isCanceled(b)) return false;
  return TERMINAL_DONE.has(b.status) || new Date(b.pickup_at).getTime() < now;
}

function MyBookingsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();

  const [statusTab, setStatusTab] = useState<StatusTab>("upcoming");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>();
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);
  const [sort, setSort] = useState<SortKey>("upcoming");
  const [page, setPage] = useState(0);

  const bookings = useQuery({
    ...myBookingsQuery(user?.id ?? "", user?.email ?? ""),
    enabled: !!user,
  });

  const filtered = useMemo(() => {
    const all = bookings.data ?? [];
    const now = Date.now();
    let list = all.filter((b) => {
      if (statusTab === "upcoming") return isUpcoming(b, now);
      if (statusTab === "canceled") return isCanceled(b);
      return isCompleted(b, now);
    });

    const q = appliedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const hay = [
          bookingLabel(b),
          b.pickup_address ?? "",
          b.dropoff_address ?? "",
          b.customer_name ?? "",
          b.route_slug,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    if (appliedRange?.from) {
      const from = startOfDay(appliedRange.from);
      const to = endOfDay(appliedRange.to ?? appliedRange.from);
      list = list.filter((b) => {
        const d = parseISO(b.pickup_at);
        return isWithinInterval(d, { start: from, end: to });
      });
    }

    list = [...list].sort((a, b) => {
      if (sort === "oldest") return a.pickup_at.localeCompare(b.pickup_at);
      if (sort === "newest") return b.pickup_at.localeCompare(a.pickup_at);
      // upcoming first: soonest first for upcoming tab, else newest
      if (statusTab === "upcoming") return a.pickup_at.localeCompare(b.pickup_at);
      return b.pickup_at.localeCompare(a.pickup_at);
    });

    return list;
  }, [bookings.data, statusTab, appliedQuery, appliedRange, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  if (bookings.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  const statusTabs: { id: StatusTab; label: string; icon: typeof Clock }[] = [
    { id: "upcoming", label: t.account.upcoming, icon: Clock },
    { id: "completed", label: t.account.completedTab, icon: BadgeCheck },
    { id: "canceled", label: t.account.canceledTab, icon: CircleX },
  ];

  const dateLabel =
    appliedRange?.from &&
    (appliedRange.to
      ? `${format(appliedRange.from, "d MMM yyyy", { locale: dateFnsLocale(locale) })} – ${format(appliedRange.to, "d MMM yyyy", { locale: dateFnsLocale(locale) })}`
      : format(appliedRange.from, "d MMM yyyy", { locale: dateFnsLocale(locale) }));

  const nextTransfer = (bookings.data ?? [])
    .filter((b) => isUpcoming(b, Date.now()))
    .sort((a, b) => a.pickup_at.localeCompare(b.pickup_at))[0];

  return (
    <div>
      {nextTransfer && <NextTransferCard booking={nextTransfer} locale={locale} />}
      <nav className="mb-7 mt-1 flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none]">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const active = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusTab(tab.id);
                setPage(0);
              }}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mb-3 mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex overflow-hidden rounded-lg border border-border bg-card shadow-sm focus-within:border-primary/30 focus-within:shadow-md">
          <div className="flex items-center pl-3 text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            id="filterBooking"
            name="filterBooking"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedQuery(query);
                setPage(0);
              }
            }}
            placeholder={t.account.searchPlaceholder}
            className="block h-[42px] w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setAppliedQuery(query);
              setPage(0);
            }}
            className="flex shrink-0 items-center border-l border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {t.account.search}
          </button>
        </div>

        <Popover>
          <div className="flex overflow-hidden rounded-lg border border-border bg-card shadow-sm focus-within:border-primary/30 focus-within:shadow-md">
            <div className="flex items-center pl-3 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
            </div>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="block h-[42px] w-full cursor-pointer bg-transparent px-3 py-2.5 text-left text-sm text-foreground focus:outline-none"
              >
                <span className={cn(!dateLabel && "text-muted-foreground")}>
                  {dateLabel || t.account.dateRangePlaceholder}
                </span>
              </button>
            </PopoverTrigger>
            <button
              type="button"
              onClick={() => {
                setAppliedRange(dateRange);
                setPage(0);
              }}
              className="flex shrink-0 items-center border-l border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {t.account.search}
            </button>
          </div>
          <PopoverContent align="end" className="w-auto p-4">
            <Calendar
              locale={dateFnsLocale(locale)}
              mode="range"
              numberOfMonths={2}
              selected={dateRange}
              onSelect={setDateRange}
              defaultMonth={dateRange?.from}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
                onClick={() => {
                  setDateRange(undefined);
                  setAppliedRange(undefined);
                  setPage(0);
                }}
              >
                {t.account.clearDates}
              </button>
              <button
                type="button"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                onClick={() => {
                  setAppliedRange(dateRange);
                  setPage(0);
                }}
              >
                {t.account.search}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-7 mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
        <h2 className="text-2xl font-semibold text-primary">{t.account.bookingsHeading}</h2>
        <span className="rounded-sm bg-primary px-2 py-1 text-base text-primary-foreground">
          {filtered.length}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SelectMenu
            icon={<SlidersHorizontal className="h-3 w-3 text-muted-foreground" />}
            prefix={t.account.showLabel}
            value={t.account.perPage(pageSize)}
            options={PAGE_SIZES.map((n) => ({
              value: String(n),
              label: t.account.perPage(n),
            }))}
            onChange={(v) => {
              setPageSize(Number(v) as (typeof PAGE_SIZES)[number]);
              setPage(0);
            }}
          />
          <SelectMenu
            icon={<SlidersHorizontal className="h-3 w-3 text-muted-foreground" />}
            prefix={t.account.sortLabel}
            value={
              sort === "upcoming"
                ? t.account.sortUpcoming
                : sort === "newest"
                  ? t.account.sortNewest
                  : t.account.sortOldest
            }
            options={[
              { value: "upcoming", label: t.account.sortUpcoming },
              { value: "newest", label: t.account.sortNewest },
              { value: "oldest", label: t.account.sortOldest },
            ]}
            onChange={(v) => {
              setSort(v as SortKey);
              setPage(0);
            }}
          />
        </div>
      </div>

      <BookingList bookings={pageItems} />

      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ←
          </button>
          <span className="text-sm text-muted-foreground">
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      <BookingCtaBand />
      <AccountAppDownload />
    </div>
  );
}

function SelectMenu({
  icon,
  prefix,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  prefix: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[38px] cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm transition hover:border-primary/30 hover:bg-muted/50"
      >
        {icon}
        <span className="text-muted-foreground">{prefix}</span>
        <span className="font-medium">{value}</span>
        <ChevronDown
          className={cn("h-3 w-3 text-muted-foreground transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-40 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.label === value}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingList({ bookings }: { bookings: Booking[] }) {
  const t = useT();
  const locale = useLocale();
  const money = useMoney();

  if (bookings.length === 0) {
    return (
      <div className="mt-3 space-y-5">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Missing%20booking`}
          className="mt-12 flex w-full flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t.account.reportBug}
        >
          <h2 className="animate-pulse text-4xl font-semibold text-muted-foreground/30">
            {t.account.emptyFiltered}
          </h2>
          <p className="animate-pulse text-2xl text-muted-foreground/30">
            {t.account.emptyFilteredHint}
          </p>
          <span className="mt-6 text-xs italic text-muted-foreground">
            {t.account.emptyReportHint} – {t.account.reportBug}
          </span>
        </a>
      </div>
    );
  }

  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <div className="mt-3 space-y-4">
      {bookings.map((b) => {
        const label = bookingLabel(b);
        return (
          <Link
            key={b.id}
            to="/{-$locale}/account/bookings/$id"
            params={{ id: b.id }}
            className="block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg text-primary">{label}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {new Date(b.pickup_at).toLocaleString(dateLocale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {b.trip_type === "return" && ` · ${t.widget.return}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <span className="font-display text-lg text-primary">
                  {money.format(b.price_cents / 100)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent-deep">
              {t.account.viewDetails}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
